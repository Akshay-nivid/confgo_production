'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`order\`
      ADD COLUMN \`program_total_amount\` DECIMAL(10, 2) NULL AFTER \`final_price\`;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE \`order\`
      ADD COLUMN \`addon_total_amount\` DECIMAL(10, 2) NULL AFTER \`program_total_amount\`;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE \`order\`
      ADD COLUMN \`price_tier_discount\` DECIMAL(10, 2) NULL AFTER \`addon_total_amount\`;
    `);
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeColumn('order', 'program_total_amount');
    await queryInterface.removeColumn('order', 'addon_total_amount');
    await queryInterface.removeColumn('order', 'price_tier_discount');
  }
};
