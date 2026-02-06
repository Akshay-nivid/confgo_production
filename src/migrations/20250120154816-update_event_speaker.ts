import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Remove the `speaker_file_id` column from `event_speaker` table
    await queryInterface.removeColumn('event_speaker', 'speaker_file_id');
    // Remove the `asset_id` column from `event_speaker` table
    await queryInterface.removeColumn('event_speaker', 'assetId');
  },

  async down(queryInterface: QueryInterface) {
    // Add the `speaker_file_id` column back in case we need to revert the migration
    await queryInterface.addColumn('event_speaker', 'speaker_file_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'asset', // Assuming 'asset' is the referenced table
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    // Add the `asset_id` column back in case we need to revert the migration
    await queryInterface.addColumn('event_speaker', 'assetId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'asset', // Assuming 'asset' is the referenced table
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },
};
