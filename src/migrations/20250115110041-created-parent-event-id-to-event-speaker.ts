'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE event_speaker
      ADD COLUMN parent_event_id INT NULL AFTER speaker_file_id;
    `);

    await queryInterface.addIndex('event_speaker', ['parent_event_id'], {
      name: 'event_speaker_parent_event_FK_idx',
    });

    await queryInterface.addConstraint('event_speaker', {
      fields: ['parent_event_id'],
      type: 'foreign key',
      name: 'event_speaker_parent_event_FK',
      references: {
        table: 'event',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeColumn('event_speaker', 'parent_event_id');
  }
};
