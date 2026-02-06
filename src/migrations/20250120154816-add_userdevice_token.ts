import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE user
      ADD COLUMN device_token Text NULL AFTER sso_metadata;
    `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('user', 'device_token');
  },
};
