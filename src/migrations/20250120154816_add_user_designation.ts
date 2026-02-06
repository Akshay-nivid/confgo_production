import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE user
      ADD COLUMN designation Text NULL AFTER sso_metadata;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE user
      ADD COLUMN user_description Text NULL AFTER device_token;
    `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('user', 'designation');
    await queryInterface.removeColumn('user', 'user_description');
  },
};
