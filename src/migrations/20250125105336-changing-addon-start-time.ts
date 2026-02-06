'use strict';

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('event_addon', 'start_time', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },
  

  async down (queryInterface: QueryInterface) {
      await queryInterface.changeColumn('event_addon', 'start_time', {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
  }
};
