import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Create the `user_abstract_status` table
    await queryInterface.createTable('company_tax', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user', // The referenced table name
          key: 'id', // The referenced column
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tax_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tax_percentage: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      tax_inclusive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false,
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
  },

  async down(queryInterface: QueryInterface) {
    // Drop the `user_abstract_status` table
    await queryInterface.dropTable('company_tax');
  },
};
