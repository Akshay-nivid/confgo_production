import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE event
      ADD COLUMN hall Text NULL AFTER amount;
    `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('user', 'hall');
  },
};
