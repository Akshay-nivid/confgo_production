import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingNames = await queryInterface.sequelize.query(
      `SELECT action_name FROM action WHERE action_name IN ('READ', 'WRITE','DELETE','CREATE')`,
      { type: QueryTypes.SELECT }
    );

    const existingActionNames = existingNames.map(
      (obj: any) => obj.action_name
    );

    // Insert only if the values do not exist
    const actionsToInsert = [
      {
        id: 1,
        action_name: 'READ',
        description: 'Permission to view the resource',
      },
      {
        id: 2,
        action_name: 'WRITE',
        description: 'Permission to edit the resource',
      },
      {
        id: 3,
        action_name: 'DELETE',
        description: 'Permission to delete the resource',
      },
      {
        id: 4,
        action_name: 'CREATE',
        description: 'Permission to delete the resource',
      },
    ].filter((obj) => !existingActionNames.includes(obj.action_name));

    if (actionsToInsert.length > 0) {
      await queryInterface.bulkInsert('action', actionsToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('action', {
      action_name: ['READ', 'WRITE', 'DELETE', 'CREATE'],
    });
  },
};
