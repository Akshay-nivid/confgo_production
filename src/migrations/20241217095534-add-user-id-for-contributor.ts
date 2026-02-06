import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    // Step 1: Add `user_id` column after `id` using a raw SQL query
    await queryInterface.sequelize.query(`
      ALTER TABLE event_program_schedule
      ADD COLUMN user_id INT NULL AFTER id;
    `);

    // Step 2: Add foreign key constraint for `user_id` referencing `user` table
    await queryInterface.addConstraint('event_program_schedule', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_id',
      references: {
        table: 'user',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    // Step 1: Remove the foreign key constraint
    await queryInterface.removeConstraint('event_program_schedule', 'fk_user_id');

    // Step 2: Remove the `user_id` column
    await queryInterface.sequelize.query(`
      ALTER TABLE event_program_schedule
      DROP COLUMN user_id;
    `);
  },
};
