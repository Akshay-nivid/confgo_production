'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE notification
      ADD COLUMN instant_notification TINYINT(1) NULL DEFAULT 0 AFTER send_status;
    `);    
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeColumn('notification', 'instant_notification');
  }
};
