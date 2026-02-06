'use strict';

import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('sponsor_type', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    });
    await queryInterface.createTable('event_sponsor', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sponsor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sponsor_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      parent_event_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      event_addon_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      event_addon_property_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reserved_seats: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      modified_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('event_sponsor', ['sponsor_id'], {
      name: 'event_sponsor_sponsor_FK_idx',
    });
    await queryInterface.addIndex('event_sponsor', ['sponsor_type_id'], {
      name: 'event_sponsor_sponsor_type_FK_idx',
    });
    await queryInterface.addIndex('event_sponsor', ['event_id'], {
      name: 'event_sponsor_event_FK_idx',
    });
    await queryInterface.addIndex('event_sponsor', ['parent_event_id'], {
      name: 'event_sponsor_parent_event_FK_idx',
    });
    await queryInterface.addIndex('event_sponsor', ['event_addon_id'], {
      name: 'event_sponsor_event_addon_FK_idx',
    });
    await queryInterface.addIndex(
      'event_sponsor',
      ['event_addon_property_id'],
      {
        name: 'event_sponsor_event_addon_property_FK_idx',
      }
    );

    // Add foreign key constraints
    await queryInterface.addConstraint('event_sponsor', {
      fields: ['sponsor_id'],
      type: 'foreign key',
      name: 'event_sponsor_sponsor_FK',
      references: {
        table: 'sponsor',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('event_sponsor', {
      fields: ['sponsor_type_id'],
      type: 'foreign key',
      name: 'event_sponsor_sponsor_type_FK',
      references: {
        table: 'sponsor_type',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('event_sponsor', {
      fields: ['event_id'],
      type: 'foreign key',
      name: 'event_sponsor_event_FK',
      references: {
        table: 'event',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('event_sponsor', {
      fields: ['parent_event_id'],
      type: 'foreign key',
      name: 'event_sponsor_parent_event_FK',
      references: {
        table: 'event',
        field: 'parent_id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('event_sponsor', {
      fields: ['event_addon_id'],
      type: 'foreign key',
      name: 'event_sponsor_event_addon_FK',
      references: {
        table: 'event_addon',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    
    await queryInterface.addConstraint('event_sponsor', {
      fields: ['event_addon_property_id'],
      type: 'foreign key',
      name: 'event_sponsor_event_addon_property_FK',
      references: {
        table: 'event_addon_property',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('event_sponsor');

    await queryInterface.dropTable('sponsor_type');
  },
};
