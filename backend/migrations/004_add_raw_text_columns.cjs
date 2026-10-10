/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  pgm.addColumns('herbs', {
    raw_karma: { type: 'text' },
    raw_indication: { type: 'text' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('herbs', ['raw_karma', 'raw_indication']);
};
