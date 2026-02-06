'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`order\`
      ADD COLUMN taxInclusive INT NULL DEFAULT 0 AFTER tax;
    `);
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeColumn('order', 'taxInclusive');
  }
};
