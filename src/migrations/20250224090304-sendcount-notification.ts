'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.sequelize.query(`
      ALTER TABLE notification
      ADD COLUMN send_count INT NULL DEFAULT 0 AFTER send_status;
    `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('notification', 'send_count');
  }
};

