'use strict';

import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.removeIndex('user', 'email');

    await queryInterface.changeColumn('user', 'email', {
      type: DataType.STRING(255),
      allowNull: false
    });


    await queryInterface.removeIndex('user', 'phone_UNIQUE');

    await queryInterface.changeColumn('user', 'phone', {
      type: DataType.STRING(50),
      allowNull: true
    });
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.changeColumn('user', 'email', {
      type: DataType.STRING(255),
      allowNull: false,
      unique: "email"
    });

    await queryInterface.changeColumn('user', 'phone', {
      type: DataType.STRING(50),
      allowNull: true,
      unique: "phone_UNIQUE"
    });
  }
};
