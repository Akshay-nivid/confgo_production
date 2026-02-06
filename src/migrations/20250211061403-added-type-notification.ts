'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.sequelize.query(`
      ALTER TABLE notification
      ADD COLUMN type ENUM('EMAIL', 'PUSH') NULL DEFAULT 'EMAIL' AFTER send_status;
    `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('notification', 'type');
  }
};

