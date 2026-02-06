import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Rename the table `event_program_schedule` to `event_speaker`
    await queryInterface.renameTable('event_program_schedule', 'event_speaker');
    
    // Remove the specified columns from the `event_speaker` table
    await queryInterface.removeColumn('event_speaker', 'name');
    await queryInterface.removeColumn('event_speaker', 'bio');
    await queryInterface.removeColumn('event_speaker', 'email');
    await queryInterface.removeColumn('event_speaker', 'phone');
    await queryInterface.removeColumn('event_speaker', 'start_time');
    await queryInterface.removeColumn('event_speaker', 'end_time');
    await queryInterface.removeColumn('event_speaker', 'topic');
    await queryInterface.removeColumn('event_speaker', 'language');
    await queryInterface.removeColumn('event_speaker', 'designation');
    await queryInterface.removeColumn('event_speaker', 'media_url');
    await queryInterface.removeColumn('event_speaker', 'description');
    await queryInterface.removeColumn('event_speaker', 'program_type');

    // Rename the column `asset_id` to `speaker_file_id`
    await queryInterface.renameColumn('event_speaker', 'asset_id', 'speaker_file_id');
 
  },

  async down(queryInterface: QueryInterface) {
    // Rename the table `event_speaker` back to `event_program_schedule`
    await queryInterface.renameTable('event_speaker', 'event_program_schedule');
    
    // Add the removed columns back to the `event_program_schedule` table
    await queryInterface.addColumn('event_program_schedule', 'name', {
      type: DataTypes.STRING(45),
      allowNull: false,
    });
    await queryInterface.addColumn('event_program_schedule', 'bio', {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'email', {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'phone', {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'start_time', {
      type: DataTypes.TIME,
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'end_time', {
      type: DataTypes.TIME,
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'topic', {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'language', {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'media_url', {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'designation', {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'description', {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    await queryInterface.addColumn('event_program_schedule', 'program_type', {
      type: DataTypes.STRING(45),
      allowNull: true,
    });
    // Rename the column `speaker_file_id` back to `asset_id`
    await queryInterface.renameColumn('event_program_schedule', 'speaker_file_id', 'asset_id');
 
  },
};
