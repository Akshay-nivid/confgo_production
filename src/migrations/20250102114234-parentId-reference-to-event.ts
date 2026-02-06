import { QueryInterface} from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Add an index on `parentId`
    await queryInterface.addIndex('event', ['parent_id'], {
      name: 'event_ibfk_3433_idx',
    });

    await queryInterface.addConstraint('event', {
      fields: ['parent_id'],
      type: 'foreign key',
      name: 'event_ibfk_3433',
      references: {
        table: 'event',  
        field: 'id',  
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
  },

  async down(queryInterface: QueryInterface) {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('event', 'event_ibfk_3433');

    // Remove the index on `parentId`
    await queryInterface.removeIndex('event', 'event_ibfk_3433_idx');
  },
};
