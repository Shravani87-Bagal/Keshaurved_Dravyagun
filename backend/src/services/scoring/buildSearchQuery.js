/**
 * Single-query weighted search using LEFT JOIN LATERAL per active parameter group.
 */

function multiSelectLateral(group, junctionTable, termTable, termCol, paramIndex, extraJoinCondition = '') {
  const alias = `${group}_lat`;
  return {
    join: `
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (WHERE j.${termCol} IS NOT NULL)::float
      / NULLIF(cardinality($${paramIndex}::int[]), 0) AS ratio,
    jsonb_build_object(
      'group', '${group}',
      'weight', $w_${group},
      'ratio', COUNT(*) FILTER (WHERE j.${termCol} IS NOT NULL)::float
        / NULLIF(cardinality($${paramIndex}::int[]), 0),
      'items', COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'label', t.canonical_en,
          'matched', j.${termCol} IS NOT NULL
        ) ORDER BY t.canonical_en
      ), '[]'::jsonb)
    ) AS breakdown
  FROM unnest($${paramIndex}::int[]) AS sel(${termCol})
  JOIN ${termTable} t ON t.id = sel.${termCol}
  LEFT JOIN ${junctionTable} j
    ON j.herb_id = h.id AND j.${termCol} = sel.${termCol} ${extraJoinCondition}
) ${alias} ON cardinality($${paramIndex}::int[]) > 0`,
    alias,
    ratioExpr: `${alias}.ratio`,
    breakdownExpr: `${alias}.breakdown`,
    weightKey: group,
    activeWhen: (c) => c.length > 0,
  };
}

function malaWithEffectLateral(group, junctionTable, termTable, termCol, paramIndex) {
  const alias = `${group}_lat`;
  return {
    join: `
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (WHERE j.${termCol} IS NOT NULL AND j.effect = sel.effect)::float
      / NULLIF(jsonb_array_length($${paramIndex}::jsonb), 0) AS ratio,
    jsonb_build_object(
      'group', '${group}',
      'weight', $w_${group},
      'ratio', COUNT(*) FILTER (WHERE j.${termCol} IS NOT NULL AND j.effect = sel.effect)::float
        / NULLIF(jsonb_array_length($${paramIndex}::jsonb), 0),
      'items', COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'label', t.canonical_en,
          'matched', j.${termCol} IS NOT NULL AND j.effect = sel.effect,
          'effect', sel.effect
        ) ORDER BY t.canonical_en
      ), '[]'::jsonb)
    ) AS breakdown
  FROM jsonb_to_recordset($${paramIndex}::jsonb) AS sel(${termCol} int, effect dosha_effect)
  JOIN ${termTable} t ON t.id = sel.${termCol}
  LEFT JOIN ${junctionTable} j
    ON j.herb_id = h.id AND j.${termCol} = sel.${termCol} AND j.effect = sel.effect
) ${alias} ON jsonb_array_length($${paramIndex}::jsonb) > 0`,
    alias,
    ratioExpr: `${alias}.ratio`,
    breakdownExpr: `${alias}.breakdown`,
    weightKey: group,
    activeWhen: (c) => c.length > 0,
  };
}

function scoredLateral(group, junctionTable, termTable, termCol, paramIndex) {
  const alias = `${group}_lat`;
  return {
    join: `
LEFT JOIN LATERAL (
  SELECT
    AVG(COALESCE(j.score, 0)::float / 5.0) AS ratio,
    jsonb_build_object(
      'group', '${group}',
      'weight', $w_${group},
      'ratio', AVG(COALESCE(j.score, 0)::float / 5.0),
      'items', COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'label', t.canonical_en,
          'matched', COALESCE(j.score, 0) > 0,
          'score', COALESCE(j.score, 0)
        ) ORDER BY t.canonical_en
      ), '[]'::jsonb)
    ) AS breakdown
  FROM unnest($${paramIndex}::int[]) AS sel(${termCol})
  JOIN ${termTable} t ON t.id = sel.${termCol}
  LEFT JOIN ${junctionTable} j
    ON j.herb_id = h.id AND j.${termCol} = sel.${termCol}
) ${alias} ON cardinality($${paramIndex}::int[]) > 0`,
    alias,
    ratioExpr: `${alias}.ratio`,
    breakdownExpr: `${alias}.breakdown`,
    weightKey: group,
    activeWhen: (c) => c.length > 0,
  };
}

const GROUP_DEFS = [
  {
    key: 'rasa',
    kind: 'multi',
    junction: 'herb_rasa',
    termTable: 'rasa_terms',
    termCol: 'rasa_id',
    criteriaKey: 'rasaIds',
  },
  {
    key: 'guna',
    kind: 'multi',
    junction: 'herb_guna',
    termTable: 'guna_terms',
    termCol: 'guna_id',
    criteriaKey: 'gunaIds',
  },
  {
    key: 'karma',
    kind: 'multi',
    junction: 'herb_karma',
    termTable: 'karma_terms',
    termCol: 'karma_id',
    criteriaKey: 'karmaIds',
  },
  {
    key: 'indication',
    kind: 'multi',
    junction: 'herb_indications',
    termTable: 'indication_terms',
    termCol: 'indication_id',
    criteriaKey: 'indicationIds',
  },
  {
    key: 'dhatu',
    kind: 'scored',
    junction: 'herb_dhatu',
    termTable: 'dhatu_terms',
    termCol: 'dhatu_id',
    criteriaKey: 'dhatuIds',
  },
  {
    key: 'mala',
    kind: 'mala_with_effect',
    junction: 'herb_mala',
    termTable: 'mala_terms',
    termCol: 'mala_id',
    criteriaKey: 'malaIdsWithEffects',
  },
  {
    key: 'srotas',
    kind: 'multi',
    junction: 'herb_srotas',
    termTable: 'srotas_terms',
    termCol: 'srotas_id',
    criteriaKey: 'srotasIds',
  },
  {
    key: 'avayava',
    kind: 'scored',
    junction: 'herb_avayava',
    termTable: 'avayava_terms',
    termCol: 'avayava_id',
    criteriaKey: 'avayavaIds',
  },
];

export function buildSearchQuery(criteria, weights, options) {
  const { statuses, limit = 50, offset = 0 } = options;
  const params = [statuses];
  let paramIndex = 2;

  const joins = [];
  const ratioParts = [];
  const breakdownParts = [];
  let activeWeightSum = 0;

  const paramByKey = {};

  for (const def of GROUP_DEFS) {
    const values = criteria[def.criteriaKey] || [];
    if (!values.length) {
      continue;
    }

    paramByKey[def.key] = paramIndex;
    params.push(values);
    activeWeightSum += weights[def.key] ?? 0;

    const lateral =
      def.kind === 'scored'
        ? scoredLateral(def.key, def.junction, def.termTable, def.termCol, paramIndex)
        : def.kind === 'mala_with_effect'
        ? malaWithEffectLateral(def.key, def.junction, def.termTable, def.termCol, paramIndex)
        : multiSelectLateral(def.key, def.junction, def.termTable, def.termCol, paramIndex, def.extraJoinCondition || '');

    joins.push(lateral.join);
    ratioParts.push({
      weight: weights[def.key] ?? 0,
      ratio: lateral.ratioExpr,
    });
    breakdownParts.push(lateral.breakdownExpr);
    paramIndex += 1;
  }

  // Virya (single FK on herbs)
  let viryaJoin = '';
  let viryaRatio = null;
  if (criteria.viryaId) {
    params.push(criteria.viryaId);
    const idx = paramIndex;
    paramIndex += 1;
    activeWeightSum += weights.virya ?? 0;
    viryaJoin = `
LEFT JOIN LATERAL (
  SELECT
    CASE WHEN h.virya_id = $${idx} THEN 1.0 ELSE 0.0 END AS ratio,
    jsonb_build_object(
      'group', 'virya',
      'weight', $w_virya,
      'ratio', CASE WHEN h.virya_id = $${idx} THEN 1.0 ELSE 0.0 END,
      'items', jsonb_build_array(
        jsonb_build_object(
          'id', vt.id,
          'label', vt.canonical_en,
          'matched', h.virya_id = $${idx}
        )
      )
    ) AS breakdown
  FROM virya_terms vt
  WHERE vt.id = $${idx}
) virya_lat ON true`;
    joins.push(viryaJoin);
    ratioParts.push({ weight: weights.virya ?? 0, ratio: 'virya_lat.ratio' });
    breakdownParts.push('virya_lat.breakdown');
  }

  // Vipaka
  if (criteria.vipakaId) {
    params.push(criteria.vipakaId);
    const idx = paramIndex;
    paramIndex += 1;
    activeWeightSum += weights.vipaka ?? 0;
    joins.push(`
LEFT JOIN LATERAL (
  SELECT
    CASE WHEN h.vipaka_id = $${idx} THEN 1.0 ELSE 0.0 END AS ratio,
    jsonb_build_object(
      'group', 'vipaka',
      'weight', $w_vipaka,
      'ratio', CASE WHEN h.vipaka_id = $${idx} THEN 1.0 ELSE 0.0 END,
      'items', jsonb_build_array(
        jsonb_build_object(
          'id', vt.id,
          'label', vt.canonical_en,
          'matched', h.vipaka_id = $${idx}
        )
      )
    ) AS breakdown
  FROM vipaka_terms vt
  WHERE vt.id = $${idx}
) vipaka_lat ON true`);
    ratioParts.push({ weight: weights.vipaka ?? 0, ratio: 'vipaka_lat.ratio' });
    breakdownParts.push('vipaka_lat.breakdown');
  }

  // Dosha direction selections
  if (criteria.doshaSelections?.length) {
    params.push(JSON.stringify(criteria.doshaSelections));
    const idx = paramIndex;
    paramIndex += 1;
    activeWeightSum += weights.dosha ?? 0;
    joins.push(`
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (WHERE hda.herb_id IS NOT NULL)::float
      / NULLIF(jsonb_array_length($${idx}::jsonb), 0) AS ratio,
    jsonb_build_object(
      'group', 'dosha',
      'weight', $w_dosha,
      'ratio', COUNT(*) FILTER (WHERE hda.herb_id IS NOT NULL)::float
        / NULLIF(jsonb_array_length($${idx}::jsonb), 0),
      'items', COALESCE(jsonb_agg(
        jsonb_build_object(
          'dosha', sel.dosha,
          'effect', sel.effect,
          'matched', hda.herb_id IS NOT NULL
        )
      ), '[]'::jsonb)
    ) AS breakdown
  FROM jsonb_to_recordset($${idx}::jsonb) AS sel(dosha dosha_type, effect dosha_effect)
  LEFT JOIN herb_dosha_actions hda
    ON hda.herb_id = h.id
   AND hda.dosha = sel.dosha
   AND hda.effect = sel.effect
) dosha_lat ON jsonb_array_length($${idx}::jsonb) > 0`);
    ratioParts.push({ weight: weights.dosha ?? 0, ratio: 'dosha_lat.ratio' });
    breakdownParts.push('dosha_lat.breakdown');
  }

  // Prabhava substring terms
  if (criteria.prabhavaTerms?.length) {
    params.push(criteria.prabhavaTerms);
    const idx = paramIndex;
    paramIndex += 1;
    activeWeightSum += weights.prabhava ?? 0;
    joins.push(`
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) FILTER (
      WHERE lower(COALESCE(h.prabhava, '')) LIKE '%' || term || '%'
    )::float / NULLIF(cardinality($${idx}::text[]), 0) AS ratio,
    jsonb_build_object(
      'group', 'prabhava',
      'weight', $w_prabhava,
      'ratio', COUNT(*) FILTER (
        WHERE lower(COALESCE(h.prabhava, '')) LIKE '%' || term || '%'
      )::float / NULLIF(cardinality($${idx}::text[]), 0),
      'items', COALESCE(jsonb_agg(
        jsonb_build_object(
          'term', term,
          'matched', lower(COALESCE(h.prabhava, '')) LIKE '%' || term || '%'
        )
      ), '[]'::jsonb)
    ) AS breakdown
  FROM unnest($${idx}::text[]) AS u(term)
) prabhava_lat ON cardinality($${idx}::text[]) > 0`);
    ratioParts.push({ weight: weights.prabhava ?? 0, ratio: 'prabhava_lat.ratio' });
    breakdownParts.push('prabhava_lat.breakdown');
  }

  params.push(activeWeightSum);
  const activeWeightParam = paramIndex;
  paramIndex += 1;

  params.push(limit);
  const limitParam = paramIndex;
  paramIndex += 1;

  params.push(offset);
  const offsetParam = paramIndex;

  const earnedExpr =
    ratioParts.length === 0
      ? '0'
      : ratioParts
          .map((p) => `COALESCE(${p.ratio}, 0) * ${p.weight}`)
          .join(' + ');

  const breakdownExpr =
    breakdownParts.length === 0
      ? `'[]'::jsonb`
      : `jsonb_build_array(${breakdownParts.join(', ')})`;

  const matchPctExpr =
    ratioParts.length === 0
      ? '0::numeric'
      : `CAST(
          ROUND(
            CASE WHEN $${activeWeightParam} > 0
              THEN 100.0 * (${earnedExpr}) / $${activeWeightParam}
              ELSE 0
            END
          ) AS numeric(10,1)
        )`;

  const weightReplacements = Object.entries(weights).reduce((acc, [k, v]) => {
    acc[`$w_${k}`] = String(v ?? 0);
    return acc;
  }, {});

  let sql = `
SELECT
  h.id,
  h.code,
  h.english_name,
  h.botanical_name,
  h.part_used,
  h.prabhava,
  h.status,
  h.image_url,
  ${matchPctExpr} AS match_percentage,
  ${breakdownExpr} AS breakdown
FROM herbs h
${joins.join('\n')}
WHERE h.status = ANY($1::herb_status[])
ORDER BY match_percentage DESC, h.english_name ASC
LIMIT $${limitParam} OFFSET $${offsetParam}`;

  for (const [token, value] of Object.entries(weightReplacements)) {
    sql = sql.split(token).join(value);
  }

  return { sql, params, activeWeightSum, paramByKey };
}
