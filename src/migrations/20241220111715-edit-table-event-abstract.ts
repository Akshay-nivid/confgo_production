import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Alter `event` table to rename `speciality` to `specialty_id`
    await queryInterface.renameColumn('event', 'speciality', 'specialty_id');

    // Add new column `is_abstract` after `specialty_id` using raw SQL
    await queryInterface.sequelize.query(`
      ALTER TABLE event
      ADD COLUMN is_abstract INTEGER AFTER specialty_id
    `);

    // Add new column `abstract_date` after `is_abstract` using raw SQL
    await queryInterface.sequelize.query(`
      ALTER TABLE event
      ADD COLUMN abstract_date DATE AFTER is_abstract
    `);
    // Change `specialty_id` column type to INTEGER
    await queryInterface.changeColumn('event', 'specialty_id', {
      type: DataTypes.INTEGER,
      allowNull: true, // Adjust `allowNull` based on your requirements
    });
    // Add foreign key constraint for `specialty_id`
    await queryInterface.addConstraint('event', {
      fields: ['specialty_id'],
      type: 'foreign key',
      name: 'fk_specialty_id',
      references: {
        table: 'specialty',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    // Drop foreign key constraint for `specialty_id`
    await queryInterface.removeConstraint('event', 'fk_specialty_id');

    // Drop the `is_abstract` column
    await queryInterface.sequelize.query(`
      ALTER TABLE event
      DROP COLUMN is_abstract
    `);

    // Drop the `abstract_date` column
    await queryInterface.sequelize.query(`
      ALTER TABLE event
      DROP COLUMN abstract_date
    `);

    // Rename `specialty_id` back to `speciality`
    await queryInterface.renameColumn('event', 'specialty_id', 'speciality');
  },
};
