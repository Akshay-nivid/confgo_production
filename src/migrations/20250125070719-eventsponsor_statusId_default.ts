'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    // Modify the status_id column to be nullable and set a default value of 1
    await queryInterface.changeColumn('event_sponsor', 'status_id', {
      type: DataTypes.INTEGER,
      allowNull: true,  // Allow null values
      defaultValue: 1,  // Set default value to 1
    });

    // Update existing rows to have default status_id = 1 if they are null
    await queryInterface.sequelize.query(`
      UPDATE event_sponsor
      SET status_id = 1
      WHERE status_id IS NULL;
    `);
  },

  async down(queryInterface: QueryInterface) {
    // Revert the column changes: remove default and make it not nullable
    await queryInterface.changeColumn('event_sponsor', 'status_id', {
      type: DataTypes.INTEGER,
      allowNull: false,  // Revert to non-nullable
    });
  },
};
