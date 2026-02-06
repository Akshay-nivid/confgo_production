'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('sponsor_status', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      status_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE sponsor
      ADD COLUMN status_id INT NOT NULL AFTER company_id;
    `);

    await queryInterface.addIndex('sponsor', ['status_id'], {
      name: 'sponsor_sponsor_status_FK_idx',
    });

    await queryInterface.addConstraint('sponsor', {
      fields: ['status_id'],
      type: 'foreign key',
      name: 'sponsor_sponsor_status_FK',
      references: {
        table: 'sponsor_status',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('sponsor', 'status_id');
    await queryInterface.dropTable('sponsor_status');
  },
};
