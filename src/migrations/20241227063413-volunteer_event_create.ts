import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Drop the existing `volunteer_id` column
    await queryInterface.removeColumn('volunteer_event', 'volunteer_id');

    // Add the new `user_id` column with reference to the `user` table
    await queryInterface.addColumn('volunteer_event', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user', // Reference the `user` table
        key: 'id', // Reference the `id` column in the `user` table
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
  
    });

    // Optionally, add an index for the new `user_id` column
    await queryInterface.addIndex('volunteer_event', ['user_id'], {
      name: 'user_ibfk_1_idx',
    });

    // Add the foreign key constraint for `user_id`
    await queryInterface.addConstraint('volunteer_event', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'user_event_fk', // You can name this constraint as needed
      references: {
        table: 'user',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    // Remove the foreign key constraint for `user_id`
    await queryInterface.removeConstraint('volunteer_event', 'volunteer_event_ibfk_571');

    // Drop the `user_id` column
    await queryInterface.removeColumn('volunteer_event', 'user_id');

    // Optionally, restore the original `volunteer_id` column (if necessary)
    await queryInterface.addColumn('volunteer_event', 'volunteer_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'volunteer', // Reference the `volunteer` table
        key: 'id', // Reference the `id` column in the `volunteer` table
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Optionally, add an index for the restored `volunteer_id` column
    await queryInterface.addIndex('volunteer_event', ['volunteer_id'], {
      name: 'volunteer_ibfk_1_idx',
    });

    // Add the foreign key constraint for `volunteer_id`
    await queryInterface.addConstraint('volunteer_event', {
      fields: ['volunteer_id'],
      type: 'foreign key',
      name: 'volunteer_event_ibfk_571',
      references: {
        table: 'volunteer',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
