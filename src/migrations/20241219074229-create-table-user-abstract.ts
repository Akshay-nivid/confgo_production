import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    //  Create the `user_abstract` table
    await queryInterface.createTable('user_abstract', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviewer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
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
    await queryInterface.addIndex('user_abstract', ['event_id'], {
      name: 'idx_user_abstract_event_id',
    });
    await queryInterface.addIndex('user_abstract', ['user_id'], {
      name: 'idx_user_abstract_user_id',
    });
    await queryInterface.addIndex('user_abstract', ['asset_id'], {
      name: 'idx_user_abstract_asset_id',
    });
    await queryInterface.addIndex('user_abstract', ['reviewer_id'], {
      name: 'idx_user_abstract_reviewer_id',
    });
    await queryInterface.addIndex('user_abstract', ['status_id'], {
      name: 'idx_user_abstract_status_id',
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('user_abstract', {
      fields: ['event_id'],
      type: 'foreign key',
      name: 'fk_user_abstract_event_id',
      references: {
        table: 'event',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('user_abstract', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_abstract_user_id',
      references: {
        table: 'user',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('user_abstract', {
      fields: ['asset_id'],
      type: 'foreign key',
      name: 'fk_user_abstract_asset_id',
      references: {
        table: 'asset',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('user_abstract', {
      fields: ['reviewer_id'],
      type: 'foreign key',
      name: 'fk_user_abstract_reviewer_id',
      references: {
        table: 'user',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('user_abstract', {
      fields: ['status_id'],
      type: 'foreign key',
      name: 'fk_user_abstract_status_id',
      references: {
        table: 'user_abstract_status',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    // Remove all indexes
    await queryInterface.removeIndex(
      'user_abstract',
      'idx_user_abstract_event_id'
    );
    await queryInterface.removeIndex(
      'user_abstract',
      'idx_user_abstract_user_id'
    );
    await queryInterface.removeIndex(
      'user_abstract',
      'idx_user_abstract_asset_id'
    );
    await queryInterface.removeIndex(
      'user_abstract',
      'idx_user_abstract_reviewer_id'
    );
    await queryInterface.removeIndex(
      'user_abstract',
      'idx_user_abstract_status_id'
    );

    // Remove all foreign key constraints
    await queryInterface.removeConstraint(
      'user_abstract',
      'fk_user_abstract_event_id'
    );
    await queryInterface.removeConstraint(
      'user_abstract',
      'fk_user_abstract_user_id'
    );
    await queryInterface.removeConstraint(
      'user_abstract',
      'fk_user_abstract_asset_id'
    );
    await queryInterface.removeConstraint(
      'user_abstract',
      'fk_user_abstract_reviewer_id'
    );
    await queryInterface.removeConstraint(
      'user_abstract',
      'fk_user_abstract_status_id'
    );

    // Drop the `user_abstract` table
    await queryInterface.dropTable('user_abstract');
  },
};
