import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Remove the `user_event` table
    await queryInterface.dropTable('user_event');
  },

  async down(queryInterface: QueryInterface) {
    // Recreate the `user_event` table if needed
    await queryInterface.createTable('user_event', {
      id: {
        type: 'INTEGER',
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: 'INTEGER',
        allowNull: false,
        references: {
          model: 'volunteer',
          key: 'id',
        },
        onUpdate: 'CASCADE',
      },
      event_id: {
        type: 'INTEGER',
        allowNull: true,
        references: {
          model: 'event',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_by: {
        type: 'INTEGER',
        allowNull: false,
      },
      created_on: {
        type: 'DATETIME',
        allowNull: false
      },
      modified_by: {
        type: 'INTEGER',
        allowNull: false,
      },
      modified_on: {
        type: 'DATETIME',
        allowNull: false
      },
    });
  },
};
