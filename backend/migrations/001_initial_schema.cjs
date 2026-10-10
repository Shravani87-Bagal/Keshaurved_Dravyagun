/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  pgm.createExtension('pg_trgm', { ifNotExists: true });
  // Supabase uses gen_random_uuid() natively, no extension needed

  pgm.createType('user_role', ['admin', 'editor', 'domain_expert', 'clinician']);
  pgm.createType('user_status', ['active', 'inactive']);
  pgm.createType('herb_status', ['draft', 'reviewed', 'verified', 'archived']);
  pgm.createType('language_code', ['en-IN', 'hi-IN', 'mr-IN', 'sa-IN']);
  pgm.createType('dosha_type', ['vata', 'pitta', 'kapha']);
  pgm.createType('dosha_effect', ['pacifies', 'increases']);
  pgm.createType('translation_status', ['machine_translated', 'verified_translation']);

  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    email: { type: 'text', notNull: true, unique: true },
    password_hash: { type: 'text', notNull: true },
    full_name: { type: 'text', notNull: true },
    role: { type: 'user_role', notNull: true, default: 'clinician' },
    status: { type: 'user_status', notNull: true, default: 'active' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('password_reset_tokens', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users', onDelete: 'CASCADE' },
    token_hash: { type: 'text', notNull: true },
    expires_at: { type: 'timestamptz', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  const termTable = (name) => {
    pgm.createTable(name, {
      id: { type: 'serial', primaryKey: true },
      canonical_en: { type: 'text', notNull: true, unique: true },
      definition_en: { type: 'text' },
      slug: { type: 'text', notNull: true, unique: true },
      created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
      updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    });
    pgm.createIndex(name, 'canonical_en', { method: 'gin', opclass: 'gin_trgm_ops' });
  };

  [
    'rasa_terms',
    'guna_terms',
    'karma_terms',
    'indication_terms',
    'virya_terms',
    'vipaka_terms',
    'dhatu_terms',
    'mala_terms',
    'srotas_terms',
    'avayava_terms',
  ].forEach(termTable);

  pgm.createTable('term_synonyms', {
    id: { type: 'serial', primaryKey: true },
    vocabulary: { type: 'text', notNull: true },
    term_id: { type: 'integer', notNull: true },
    language_code: { type: 'language_code', notNull: true },
    text: { type: 'text', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.createIndex('term_synonyms', ['vocabulary', 'term_id']);
  pgm.sql(
    `CREATE INDEX term_synonyms_text_trgm ON term_synonyms USING gin (text gin_trgm_ops);`
  );

  pgm.createTable('herbs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    code: { type: 'text', notNull: true, unique: true },
    english_name: { type: 'text', notNull: true },
    botanical_name: { type: 'text' },
    part_used: { type: 'text' },
    prabhava: { type: 'text' },
    description: { type: 'text' },
    image_url: { type: 'text' },
    original_language: { type: 'language_code', notNull: true, default: 'en-IN' },
    status: { type: 'herb_status', notNull: true, default: 'draft' },
    virya_id: { type: 'integer', references: 'virya_terms' },
    vipaka_id: { type: 'integer', references: 'vipaka_terms' },
    verified_by: { type: 'uuid', references: 'users' },
    verified_at: { type: 'timestamptz' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.createIndex('herbs', 'status');
  pgm.sql(
    `CREATE INDEX herbs_english_name_trgm ON herbs USING gin (english_name gin_trgm_ops);`
  );

  pgm.createTable('herb_regional_names', {
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    name: { type: 'text', notNull: true },
  });
  pgm.addConstraint('herb_regional_names', 'herb_regional_names_pkey', {
    primaryKey: ['herb_id', 'name'],
  });
  pgm.sql(
    `CREATE INDEX herb_regional_names_trgm ON herb_regional_names USING gin (name gin_trgm_ops);`
  );

  pgm.createTable('herb_references', {
    id: { type: 'serial', primaryKey: true },
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    source: { type: 'text', notNull: true },
    citation_text: { type: 'text', notNull: true },
    chapter_ref: { type: 'text' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  const herbJunction = (table, termPrefix, termTable) => {
    const termCol = `${termPrefix}_id`;
    pgm.createTable(table, {
      herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
      [termCol]: {
        type: 'integer',
        notNull: true,
        references: termTable,
      },
    });
    pgm.addConstraint(table, `${table}_pkey`, {
      primaryKey: ['herb_id', termCol],
    });
    pgm.createIndex(table, 'herb_id');
  };

  herbJunction('herb_rasa', 'rasa', 'rasa_terms');
  herbJunction('herb_guna', 'guna', 'guna_terms');
  herbJunction('herb_karma', 'karma', 'karma_terms');
  herbJunction('herb_indications', 'indication', 'indication_terms');

  const scoredJunction = (table, colPrefix, termTable) => {
    pgm.createTable(table, {
      herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
      [`${colPrefix}_id`]: { type: 'integer', notNull: true, references: termTable },
      score: { type: 'smallint', notNull: true },
    });
    pgm.addConstraint(table, `${table}_pkey`, {
      primaryKey: ['herb_id', `${colPrefix}_id`],
    });
    pgm.addConstraint(table, `${table}_score_check`, {
      check: 'score >= 0 AND score <= 5',
    });
    pgm.createIndex(table, 'herb_id');
  };

  scoredJunction('herb_dhatu', 'dhatu', 'dhatu_terms');
  scoredJunction('herb_mala', 'mala', 'mala_terms');
  scoredJunction('herb_avayava', 'avayava', 'avayava_terms');

  // herb_srotas is a simple junction (yes/no, no score)
  herbJunction('herb_srotas', 'srotas', 'srotas_terms');

  pgm.createTable('herb_dosha_actions', {
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    dosha: { type: 'dosha_type', notNull: true },
    effect: { type: 'dosha_effect', notNull: true },
  });
  pgm.addConstraint('herb_dosha_actions', 'herb_dosha_actions_pkey', {
    primaryKey: ['herb_id', 'dosha'],
  });
  pgm.createIndex('herb_dosha_actions', 'herb_id');

  pgm.createTable('scoring_weights', {
    parameter_group: { type: 'text', primaryKey: true },
    weight: { type: 'numeric', notNull: true },
    updated_by: { type: 'uuid', references: 'users' },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('search_events', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', references: 'users' },
    mode: { type: 'text', notNull: true },
    query_text: { type: 'text' },
    filters_json: { type: 'jsonb' },
    lang: { type: 'language_code' },
    result_count: { type: 'integer', notNull: true, default: 0 },
    top_match_pct: { type: 'numeric' },
    db_duration_ms: { type: 'numeric' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.createIndex('search_events', 'created_at');

  pgm.createTable('audit_log', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    actor_id: { type: 'uuid', references: 'users' },
    action: { type: 'text', notNull: true },
    entity_type: { type: 'text', notNull: true },
    entity_id: { type: 'text', notNull: true },
    before_json: { type: 'jsonb' },
    after_json: { type: 'jsonb' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.createIndex('audit_log', 'created_at');

  pgm.createTable('translation_cache', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    content_type: { type: 'text', notNull: true },
    content_id: { type: 'text', notNull: true },
    field_name: { type: 'text', notNull: true },
    target_language: { type: 'language_code', notNull: true },
    translated_text: { type: 'text', notNull: true },
    status: { type: 'translation_status', notNull: true, default: 'machine_translated' },
    verified_by: { type: 'uuid', references: 'users' },
    cached_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
  pgm.addConstraint('translation_cache', 'translation_cache_unique', {
    unique: ['content_type', 'content_id', 'field_name', 'target_language'],
  });

  pgm.createTable('rag_explanation_cache', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    cache_key: { type: 'text', notNull: true, unique: true },
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    filters_hash: { type: 'text', notNull: true },
    explanation_text: { type: 'text', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('search_synonym_seeds', {
    id: { type: 'serial', primaryKey: true },
    query_token: { type: 'text', notNull: true },
    maps_to_vocabulary: { type: 'text', notNull: true },
    maps_to_term_slug: { type: 'text', notNull: true },
  });
  pgm.createIndex('search_synonym_seeds', 'query_token');
};

exports.down = (pgm) => {
  pgm.dropTable('search_synonym_seeds');
  pgm.dropTable('rag_explanation_cache');
  pgm.dropTable('translation_cache');
  pgm.dropTable('audit_log');
  pgm.dropTable('search_events');
  pgm.dropTable('scoring_weights');
  pgm.dropTable('herb_dosha_actions');
  pgm.dropTable('herb_avayava');
  pgm.dropTable('herb_srotas');
  pgm.dropTable('herb_mala');
  pgm.dropTable('herb_dhatu');
  pgm.dropTable('herb_indications');
  pgm.dropTable('herb_karma');
  pgm.dropTable('herb_guna');
  pgm.dropTable('herb_rasa');
  pgm.dropTable('herb_references');
  pgm.dropTable('herb_regional_names');
  pgm.dropTable('herbs');
  pgm.dropTable('term_synonyms');
  [
    'avayava_terms',
    'srotas_terms',
    'mala_terms',
    'dhatu_terms',
    'vipaka_terms',
    'virya_terms',
    'indication_terms',
    'karma_terms',
    'guna_terms',
    'rasa_terms',
  ].forEach((t) => pgm.dropTable(t));
  pgm.dropTable('password_reset_tokens');
  pgm.dropTable('users');
  pgm.dropType('translation_status');
  pgm.dropType('dosha_effect');
  pgm.dropType('dosha_type');
  pgm.dropType('language_code');
  pgm.dropType('herb_status');
  pgm.dropType('user_status');
  pgm.dropType('user_role');
};
