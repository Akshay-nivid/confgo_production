import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Create the `speaker_bio` table
    await queryInterface.createTable('speaker_bio', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      event_speaker_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'event_speaker', // Name of the related table
          key: 'id', // Column in the related table that is the primary key
        },
        onDelete: 'CASCADE', // Optionally define behavior on deletion
        onUpdate: 'CASCADE', // Optionally define behavior on update
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_moderator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      designation: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      file_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'asset', // Name of the related table
          key: 'id', // Column in the related table that is the primary key
        },
        onDelete: 'CASCADE', // Optionally define behavior on deletion
        onUpdate: 'CASCADE', // Optionally define behavior on update
    
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    // Drop the `speaker_bio` table
    await queryInterface.dropTable('speaker_bio');
  },
};
