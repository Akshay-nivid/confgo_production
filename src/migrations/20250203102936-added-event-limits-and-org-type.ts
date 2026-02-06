'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE plan
      ADD COLUMN organization_type VARCHAR(100) NULL AFTER event_allotment;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE plan
      ADD COLUMN event_limits TEXT NULL AFTER event_allotment;
    `);
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeColumn('plan', 'event_limits');
    await queryInterface.removeColumn('plan', 'organization_type');
  }
};
