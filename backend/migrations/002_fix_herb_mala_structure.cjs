/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  // Drop the old herb_mala table with score
  pgm.dropTable('herb_mala');

  // Recreate herb_mala with effect (Increases/Decreases) instead of score
  pgm.createTable('herb_mala', {
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    mala_id: { type: 'integer', notNull: true, references: 'mala_terms' },
    effect: { type: 'dosha_effect', notNull: true },
  });
  pgm.addConstraint('herb_mala', 'herb_mala_pkey', {
    primaryKey: ['herb_id', 'mala_id'],
  });
  pgm.createIndex('herb_mala', 'herb_id');

  // Drop the old herb_srotas table with score
  pgm.dropTable('herb_srotas');

  // Recreate herb_srotas as simple junction (yes/no, no score)
  pgm.createTable('herb_srotas', {
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    srotas_id: { type: 'integer', notNull: true, references: 'srotas_terms' },
  });
  pgm.addConstraint('herb_srotas', 'herb_srotas_pkey', {
    primaryKey: ['herb_id', 'srotas_id'],
  });
  pgm.createIndex('herb_srotas', 'herb_id');
};

exports.down = (pgm) => {
  // Revert herb_mala to original structure with score
  pgm.dropTable('herb_mala');

  pgm.createTable('herb_mala', {
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    mala_id: { type: 'integer', notNull: true, references: 'mala_terms' },
    score: { type: 'smallint', notNull: true },
  });
  pgm.addConstraint('herb_mala', 'herb_mala_pkey', {
    primaryKey: ['herb_id', 'mala_id'],
  });
  pgm.addConstraint('herb_mala', 'herb_mala_score_check', {
    check: 'score >= 0 AND score <= 5',
  });
  pgm.createIndex('herb_mala', 'herb_id');

  // Revert herb_srotas to original structure with score
  pgm.dropTable('herb_srotas');

  pgm.createTable('herb_srotas', {
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    srotas_id: { type: 'integer', notNull: true, references: 'srotas_terms' },
    score: { type: 'smallint', notNull: true },
  });
  pgm.addConstraint('herb_srotas', 'herb_srotas_pkey', {
    primaryKey: ['herb_id', 'srotas_id'],
  });
  pgm.addConstraint('herb_srotas', 'herb_srotas_score_check', {
    check: 'score >= 0 AND score <= 5',
  });
  pgm.createIndex('herb_srotas', 'herb_id');
};
