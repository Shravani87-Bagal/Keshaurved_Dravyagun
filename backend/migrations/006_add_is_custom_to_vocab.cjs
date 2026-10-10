/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  const vocabTables = [
    'rasa_terms',
    'guna_terms',
    'karma_terms',
    'indication_terms',
    'virya_terms',
    'vipaka_terms',
    'mala_terms',
    'dhatu_terms',
    'srotas_terms',
    'avayava_terms',
  ];

  for (const table of vocabTables) {
    pgm.addColumn(table, {
      is_custom: { type: 'boolean', default: false, notNull: true },
    });
  }
};

exports.down = (pgm) => {
  const vocabTables = [
    'rasa_terms',
    'guna_terms',
    'karma_terms',
    'indication_terms',
    'virya_terms',
    'vipaka_terms',
    'mala_terms',
    'dhatu_terms',
    'srotas_terms',
    'avayava_terms',
  ];

  for (const table of vocabTables) {
    pgm.dropColumn(table, 'is_custom');
  }
};
