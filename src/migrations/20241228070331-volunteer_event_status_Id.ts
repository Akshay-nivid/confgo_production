import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Add the `statusId` column to `volunteer_event`
    await queryInterface.addColumn('volunteer_event', 'status_id', {
      type: DataTypes.INTEGER,
      allowNull: true, // Column allows NULL by default
      references: {
        model: 'volunteer_status', // Reference the `volunteer_status` table
        key: 'id', // Reference the `id` column in the `volunteer_status` table
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Optionally, add an index for the `statusId` column for performance
    await queryInterface.addIndex('volunteer_event', ['status_id'], {
      name: 'status_ibfk_1_idx',
    });
  },

  async down(queryInterface: QueryInterface) {
    // Remove the `statusId` column and associated index
    await queryInterface.removeIndex('volunteer_event', 'status_ibfk_1_idx');
    await queryInterface.removeColumn('volunteer_event', 'status_id');
  },
};
