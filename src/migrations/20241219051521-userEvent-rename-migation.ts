'use strict';

import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    // Drop the `volunteer_event` table
    await queryInterface.dropTable('volunteer_event');

    // Create the `user_event` table
    await queryInterface.createTable('user_event', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user', // References the `user` table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'event', // References the `event` table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    // Drop the `user_event` table
    await queryInterface.dropTable('user_event');

    // Restore the `volunteer_event` table
    await queryInterface.createTable('volunteer_event', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      volunteer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'volunteer', // References the `volunteer` table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'event', // References the `event` table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
};
