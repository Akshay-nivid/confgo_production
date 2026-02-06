'use strict';

import { DataTypes, Sequelize, UUID } from 'sequelize';
import { UUIDV4 } from 'sequelize';
import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {

    // foriegn key names in server db
    await queryInterface.removeConstraint('addon', 'addon_ibfk_375');
    await queryInterface.removeConstraint('company', 'company_ibfk_574');
    await queryInterface.removeConstraint('event', 'event_ibfk_1738');
    await queryInterface.removeConstraint('event_addon_property', 'event_addon_property_ibfk_574');
    await queryInterface.removeConstraint('event_images', 'event_images_ibfk_64');
    await queryInterface.removeConstraint('event_nearby_attraction', 'event_nearby_attraction_ibfk_858');
    await queryInterface.removeConstraint('plan', 'plan_ibfk_564');
    await queryInterface.removeConstraint('plan_property', 'plan_property_ibfk_564');
    await queryInterface.removeConstraint('speaker_bio', 'speaker_bio_ibfk_66');
    await queryInterface.removeConstraint('sponsor', 'sponsor_ibfk_98');
    await queryInterface.removeConstraint('sponsor', 'sponsor_ibfk_99');
    await queryInterface.removeConstraint('template', 'template_ibfk_1');
    await queryInterface.removeConstraint('user', 'user_ibfk_560');
    await queryInterface.removeConstraint('user_abstract', 'user_abstract_ibfk_738');

    // foriegn key names in local db
    // await queryInterface.removeConstraint('addon', 'addon_ibfk_682');
    // await queryInterface.removeConstraint('company', 'company_ibfk_1214');
    // await queryInterface.removeConstraint('event', 'event_ibfk_16881');
    // await queryInterface.removeConstraint('event_addon_property', 'event_addon_property_ibfk_4288');
    // await queryInterface.removeConstraint('event_images', 'event_images_ibfk_412');
    // await queryInterface.removeConstraint('event_nearby_attraction', 'event_nearby_attraction_ibfk_8434');
    // await queryInterface.removeConstraint('plan', 'plan_ibfk_2832');
    // await queryInterface.removeConstraint('plan_property', 'plan_property_ibfk_3092');
    // await queryInterface.removeConstraint('speaker_bio', 'speaker_bio_ibfk_278');
    // await queryInterface.removeConstraint('sponsor', 'sponsor_ibfk_535');
    // await queryInterface.removeConstraint('sponsor', 'sponsor_ibfk_536');
    // await queryInterface.removeConstraint('template', 'template_ibfk_1');
    // await queryInterface.removeConstraint('user', 'user_ibfk_2128');
    // await queryInterface.removeConstraint('user_abstract', 'user_abstract_ibfk_4002');

    // changed asset id datatype and default value
    await queryInterface.sequelize.query(`
      ALTER TABLE asset
      MODIFY COLUMN id VARCHAR(36) NOT NULL DEFAULT (UUID());
    `);

    // Changed all relation tables datatype
    await queryInterface.changeColumn('addon', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('company', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('event', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('event_addon_property', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('event_images', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('event_nearby_attraction', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('plan', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('plan_property', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('speaker_bio', 'file_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('sponsor', 'logo_asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('sponsor', 'banner_img_asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('template', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('user', 'asset_id', {
      type: DataType.STRING(36),
    });
    await queryInterface.changeColumn('user_abstract', 'asset_id', {
      type: DataType.STRING(36),
    });

    // giving new relation to all tables
    await queryInterface.addConstraint('addon', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'addon_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('company', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'company_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('event', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'event_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('event_addon_property', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'event_addon_property_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('event_images', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'event_images_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('event_nearby_attraction', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'event_nearby_attraction_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('plan', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'plan_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('plan_property', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'plan_property_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('speaker_bio', {
      fields: ['file_id'],
      type: 'foreign key',
      name: 'speaker_bio_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('sponsor', {
      fields: ['logo_asset_id'],
      type: 'foreign key',
      name: 'sponsor_asset_logo_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('sponsor', {
      fields: ['banner_img_asset_id'],
      type: 'foreign key',
      name: 'sponsor_asset_banner_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('template', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'template_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('user', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'user_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('user_abstract', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'user_abstract_asset_new_FK',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    // undo all new relations
    await queryInterface.removeConstraint('addon', 'addon_asset_new_FK');
    await queryInterface.removeConstraint('company', 'company_asset_new_FK');
    await queryInterface.removeConstraint('event', 'event_asset_new_FK');
    await queryInterface.removeConstraint('event_addon_property', 'event_addon_property_asset_new_FK');
    await queryInterface.removeConstraint('event_images', 'event_images_asset_new_FK');
    await queryInterface.removeConstraint('event_nearby_attraction', 'event_nearby_attraction_asset_new_FK');
    await queryInterface.removeConstraint('plan', 'plan_ibfk_asset_new_FK');
    await queryInterface.removeConstraint('plan_property', 'plan_property_asset_new_FK');
    await queryInterface.removeConstraint('speaker_bio', 'speaker_bio_asset_new_FK');
    await queryInterface.removeConstraint('sponsor', 'sponsor_asset_logo_new_FK');
    await queryInterface.removeConstraint('sponsor', 'sponsor_asset_banner_new_FK');
    await queryInterface.removeConstraint('template', 'template_asset_new_FK');
    await queryInterface.removeConstraint('user', 'user_ibfk_asset_new_FK');
    await queryInterface.removeConstraint('user_abstract', 'user_abstract_asset_new_FK');

    //undo all relation tables asset datatype
    await queryInterface.changeColumn('addon', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('company', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('event', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('event_addon_property', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('event_images', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('event_nearby_attraction', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('plan', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('plan_property', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('speaker_bio', 'file_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('sponsor', 'logo_asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('sponsor', 'banner_img_asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('template', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('user', 'asset_id', {
      type: DataType.INTEGER,
    });
    await queryInterface.changeColumn('user_abstract', 'asset_id', {
      type: DataType.INTEGER,
    });

    // undo the change in asset id
    await queryInterface.changeColumn('asset', 'id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    });

    // undo the all deleted relations
     await queryInterface.addConstraint('addon', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'addon_ibfk_375',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('company', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'company_ibfk_574',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('event', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'event_ibfk_1738',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('event_addon_property', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'event_addon_property_ibfk_574',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('event_images', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'event_images_ibfk_64',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('event_nearby_attraction', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'event_nearby_attraction_ibfk_858',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('plan', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'plan_ibfk_564',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('plan_property', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'plan_property_ibfk_564',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('speaker_bio', {
      fields: ['file_id'],
      type: 'foreign key',
      name: 'speaker_bio_ibfk_66',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('sponsor', {
      fields: ['logo_asset_id'],
      type: 'foreign key',
      name: 'sponsor_ibfk_98',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('sponsor', {
      fields: ['banner_img_asset_id'],
      type: 'foreign key',
      name: 'sponsor_ibfk_99',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('template', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'template_ibfk_1',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('user', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'user_ibfk_560',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('user_abstract', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'user_abstract_ibfk_738',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },
};
