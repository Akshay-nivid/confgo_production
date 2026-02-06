'use strict';

import { QueryInterface, Sequelize } from 'sequelize';
import { DataType } from 'sequelize-typescript/dist/sequelize/data-type/data-type';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    // Company paypal configuration status table
    await queryInterface.createTable('company_paypal_configuration_status', {
      id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      status_name: {
        type: DataType.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataType.TEXT,
        allowNull: true,
      },
    });

    // Company paypal configuration status table
    await queryInterface.createTable('company_paypal_configuration', {
      id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      company_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: 'company',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      user_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      client_id: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      currency: {
        type: DataType.STRING(45),
        allowNull: false,
      },
      event_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
          model: 'event',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      status_id: {
        type: DataType.INTEGER,
        allowNull: false,
        references: {
          model: 'company_paypal_configuration_status',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_by: {
        type: DataType.INTEGER,
        allowNull: false,
      },
      created_on: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      modified_by: {
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      modified_on: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('company_paypal_configuration');

    await queryInterface.dropTable('company_paypal_configuration_status');
  },
};
