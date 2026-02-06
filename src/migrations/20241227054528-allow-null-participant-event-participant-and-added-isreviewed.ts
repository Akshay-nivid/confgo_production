'use strict';

import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('participant', 'participant_type_id', {
      type: DataType.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('event_participant', 'role_name', {
      type: DataType.STRING(100),
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE user_abstract
      ADD COLUMN is_reviewed INT NOT NULL DEFAULT 0 AFTER rating;
    `);    
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('participant', 'participant_type_id', {
      type: DataType.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('event_participant', 'role_name', {
      type: DataType.STRING(100),
      allowNull: false,
    });

    await queryInterface.removeColumn('user_abstract', 'is_reviewed');
  },
};
