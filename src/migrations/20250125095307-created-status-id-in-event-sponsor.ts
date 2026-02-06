'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE event_sponsor
      ADD COLUMN status_id INT NULL AFTER reserved_seats;
    `);

    await queryInterface.addIndex('event_sponsor', ['status_id'], {
      name: 'event_sponsor_sponsor_status_FK_idx',
    });

    await queryInterface.addConstraint('event_sponsor', {
      fields: ['status_id'],
      type: 'foreign key',
      name: 'event_sponsor_sponsor_status_FK',
      references: {
        table: 'sponsor_status',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeColumn('event_sponsor', 'status_id')
  }
};
