'use strict';

import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('sponsor', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      logo_asset_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      banner_img_asset_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
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
    await queryInterface.addIndex('sponsor', ['logo_asset_id'], {
      name: 'sponsor_logo_asset_FK_idx',
    });
    await queryInterface.addIndex('sponsor', ['banner_img_asset_id'], {
      name: 'sponsor_banner_img_asset_FK_idx',
    });
    await queryInterface.addIndex('sponsor', ['company_id'], {
      name: 'sponsor_company_FK_idx',
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('sponsor', {
      fields: ['logo_asset_id'],
      type: 'foreign key',
      name: 'sponsor_logo_asset_FK',
      references: {
        table: 'event',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('sponsor', {
      fields: ['banner_img_asset_id'],
      type: 'foreign key',
      name: 'sponsor_banner_img_asset_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('sponsor', {
      fields: ['company_id'],
      type: 'foreign key',
      name: 'sponsor_company_FK',
      references: {
        table: 'user',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('sponsor');
  },
};
