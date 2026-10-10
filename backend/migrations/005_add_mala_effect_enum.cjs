/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  // Create separate enum for Mala effects (increases/decreases)
  pgm.createType('mala_effect', ['increases', 'decreases']);

  // Drop and recreate herb_mala with mala_effect enum
  pgm.dropTable('herb_mala');

  pgm.createTable('herb_mala', {
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    mala_id: { type: 'integer', notNull: true, references: 'mala_terms' },
    effect: { type: 'mala_effect', notNull: true },
  });
  pgm.addConstraint('herb_mala', 'herb_mala_pkey', {
    primaryKey: ['herb_id', 'mala_id'],
  });
  pgm.createIndex('herb_mala', 'herb_id');
};

exports.down = (pgm) => {
  // Revert to dosha_effect enum
  pgm.dropTable('herb_mala');

  pgm.createTable('herb_mala', {
    herb_id: { type: 'uuid', notNull: true, references: 'herbs', onDelete: 'CASCADE' },
    mala_id: { type: 'integer', notNull: true, references: 'mala_terms' },
    effect: { type: 'dosha_effect', notNull: true },
  });
  pgm.addConstraint('herb_mala', 'herb_mala_pkey', {
    primaryKey: ['herb_id', 'mala_id'],
  });
  pgm.createIndex('herb_mala', 'herb_id');

  pgm.dropType('mala_effect');
};
