import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingRoles = await queryInterface.sequelize.query(
      `SELECT role_id, resource_id, action_id FROM role_permission`,
      { type: QueryTypes.SELECT }
    );

    const existingRolePermission = new Set(
      existingRoles.map(
        (obj: any) => `${obj.role_id}-${obj.resource_id}-${obj.action_id}`
      )
    );

    // Insert only if the values do not exist
    const rolePermissionsToInsert = [
      {
        id: 1,
        role_id: 3, //User Role with User Read permission on asset
        resource_id: 1,
        action_id: 1,
      },
      {
        id: 2,
        role_id: 3, //User Role with User Write permission on asset
        resource_id: 1,
        action_id: 2,
      },
      {
        id: 3,
        role_id: 3, //User Role with User Read permission on asset
        resource_id: 1,
        action_id: 3,
      },
      {
        id: 4,
        role_id: 1, //ADMIN --> on asset module
        resource_id: 1,
        action_id: 1,
      },
      {
        id: 5,
        role_id: 1,
        resource_id: 1,
        action_id: 3,
      },
      {
        id: 6,
        role_id: 1,
        resource_id: 1,
        action_id: 3,
      },
      {
        id: 7,
        role_id: 1, //ADMIN --> on user module
        resource_id: 2,
        action_id: 1,
      },
      {
        id: 8,
        role_id: 1,
        resource_id: 2,
        action_id: 3,
      },
      {
        id: 9,
        role_id: 1,
        resource_id: 2,
        action_id: 3,
      },
      {
        id: 10,
        role_id: 2, //COMPANY ADMIN --> on event module
        resource_id: 3,
        action_id: 1,
      },
      {
        id: 11,
        role_id: 2,
        resource_id: 3,
        action_id: 3,
      },
      {
        id: 12,
        role_id: 2,
        resource_id: 3,
        action_id: 3,
      },
      {
        id: 13,
        role_id: 2,
        resource_id: 3,
        action_id: 4,
      },
      {
        id: 14,
        role_id: 2, //COMPANY ADMIN --> on company create,edit read permission
        resource_id: 5,
        action_id: 1,
      },
      {
        id: 15,
        role_id: 2,
        resource_id: 5,
        action_id: 3,
      },
      {
        id: 16,
        role_id: 2,
        resource_id: 5,
        action_id: 3,
      },
      {
        id: 17,
        role_id: 2,
        resource_id: 5,
        action_id: 4,
      },
      //Volunteer
      {
        id: 18,
        role_id: 4, //volunteer user persmission
        resource_id: 2,
        action_id: 1,
      },
      {
        id: 19,
        role_id: 4,
        resource_id: 2,
        action_id: 2,
      },
      {
        id: 20,
        role_id: 4,
        resource_id: 2,
        action_id: 3,
      },
      {
        id: 21,
        role_id: 4,
        resource_id: 2,
        action_id: 4,
      }, //volunteer volunteer_event module persmission
      {
        id: 22,
        role_id: 4,
        resource_id: 7,
        action_id: 1,
      },
      {
        id: 23,
        role_id: 4,
        resource_id: 7,
        action_id: 2,
      },
      {
        id: 24,
        role_id: 4,
        resource_id: 7,
        action_id: 3,
      },
      {
        id: 25,
        role_id: 4,
        resource_id: 7,
        action_id: 4,
      },
      //Speaker
      {
        id: 26,
        role_id: 5,
        resource_id: 4,
        action_id: 1,
      },
      {
        id: 27,
        role_id: 5,
        resource_id: 4,
        action_id: 2,
      },
      {
        id: 28,
        role_id: 5,
        resource_id: 4,
        action_id: 3,
      },
      {
        id: 29,
        role_id: 5,
        resource_id: 4,
        action_id: 4,
      },
      //REVIWER userabstract module persmission
      {
        id: 30,
        role_id: 6,
        resource_id: 4,
        action_id: 1,
      },
      {
        id: 31,
        role_id: 6,
        resource_id: 4,
        action_id: 2,
      },
      {
        id: 32,
        role_id: 6,
        resource_id: 4,
        action_id: 3,
      },
      //REVIWER user module persmission
      {
        id: 33,
        role_id: 6,
        resource_id: 2,
        action_id: 1,
      },
      {
        id: 34,
        role_id: 6,
        resource_id: 2,
        action_id: 2,
      },
      {
        id: 35,
        role_id: 6,
        resource_id: 2,
        action_id: 3,
      },
      {
        id: 36,
        role_id: 6,
        resource_id: 2,
        action_id: 4,
      },
    ].filter(
      (obj) =>
        !existingRolePermission.has(
          `${obj.role_id}-${obj.resource_id}-${obj.action_id}`
        )
    );

    if (rolePermissionsToInsert.length > 0) {
      await queryInterface.bulkInsert(
        'role_permission',
        rolePermissionsToInsert
      );
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('role_permission', {
      role_id: [1, 2, 3, 4, 5, 6],
    });
  },
};
