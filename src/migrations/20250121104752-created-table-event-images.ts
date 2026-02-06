'use strict';

import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('event_images', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

    // Add indexes
    await queryInterface.addIndex('event_images', ['event_id'], {
      name: 'event_images_event_FK_idx',
    });
    await queryInterface.addIndex('event_images', ['asset_id'], {
      name: 'event_images_asset_FK_idx',
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('event_images', {
      fields: ['event_id'],
      type: 'foreign key',
      name: 'event_images_event_FK',
      references: {
        table: 'event',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('event_images', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'event_images_asset_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    // Drop the `user_abstract` table
    await queryInterface.dropTable('event_images');
  },
};
