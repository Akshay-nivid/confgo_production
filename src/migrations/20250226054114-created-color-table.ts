'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('color', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      color: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE event
      ADD COLUMN color_id INT NULL AFTER template_id;
    `);

    await queryInterface.addConstraint('event', {
      fields: ['color_id'],
      type: 'foreign key',
      name: 'event_color_FK',
      references: {
        table: 'color',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('color');

    await queryInterface.removeConstraint('event', 'event_color_FK');

    await queryInterface.removeColumn('event', 'colorId');
  },
};
