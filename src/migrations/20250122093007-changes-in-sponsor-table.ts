'use strict';

import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.dropTable('sponsor');
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.createTable('sponsor', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      logo_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      asset_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      event_id: {
        type: DataTypes.INTEGER,
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

    // Add indexes
    await queryInterface.addIndex('sponsor', ['event_id'], {
      name: 'sponsor_event_FK_idx',
    });
    await queryInterface.addIndex('sponsor', ['asset_id'], {
      name: 'sponsor_asset_FK_idx',
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('sponsor', {
      fields: ['event_id'],
      type: 'foreign key',
      name: 'sponsor_event_FK',
      references: {
        table: 'event',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('sponsor', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'sponsor_asset_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },
};
