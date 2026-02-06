'use strict';

import { QueryInterface } from "sequelize";

module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE plan
      ADD COLUMN event_allotment VARCHAR(255) NULL AFTER currency;
    `);
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeColumn('plan', 'event_allotment');
  }
};
