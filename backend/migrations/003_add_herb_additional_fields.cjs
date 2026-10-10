/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = (pgm) => {
  pgm.addColumns('herbs', {
    sanskrit_name: { type: 'text' },
    local_name: { type: 'text' },
    family: { type: 'text' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('herbs', ['sanskrit_name', 'local_name', 'family']);
};
