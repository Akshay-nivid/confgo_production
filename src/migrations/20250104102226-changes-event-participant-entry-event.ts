'use strict';

import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE event
      ADD COLUMN event_start_time VARCHAR(45) AFTER company_id`);

    await queryInterface.sequelize.query(`
      ALTER TABLE event
      ADD COLUMN event_end_time VARCHAR(45) AFTER event_start_time`);

    await queryInterface.changeColumn(
      'event_participant_entry',
      'participant_type_id',
      {
        type: DataType.INTEGER,
        allowNull: true,
      }
    );
  },

  async down(queryInterface: QueryInterface) {
    queryInterface.removeColumn('event', 'event_start_time');
    queryInterface.removeColumn('event', 'event_end_time');

    await queryInterface.changeColumn(
      'event_participant_entry',
      'participant_type_id',
      {
        type: DataType.INTEGER,
        allowNull: false,
      }
    );
  },
};
