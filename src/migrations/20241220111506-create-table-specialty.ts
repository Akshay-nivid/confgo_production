import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Create the `specialty` table
    await queryInterface.createTable('specialty', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    // Drop the `specialty` table
    await queryInterface.dropTable('specialty');
  },
};
