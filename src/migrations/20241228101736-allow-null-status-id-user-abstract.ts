'use strict';

import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('user_abstract', 'status_id', {
      type: DataType.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('user_abstract', 'status_id', {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },
};
