'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('venue', 'name', {
      type: DataTypes.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('venue', 'name', {
      type: DataTypes.STRING(50),
      allowNull: false,
    });
  },
};
