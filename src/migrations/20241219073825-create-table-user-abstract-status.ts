import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Create the `user_abstract_status` table
    await queryInterface.createTable('user_abstract_status', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      status_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    // Drop the `user_abstract_status` table
    await queryInterface.dropTable('user_abstract_status');
  },
};
