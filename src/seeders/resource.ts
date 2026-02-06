import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingNames = await queryInterface.sequelize.query(
      `SELECT resource_name FROM resource WHERE resource_name IN ('ASSET', 'USER', 'EVENT','USER_ABSTRACT','COMPANY','COUPON','VOLUNTEER_EVENT')`,
      { type: QueryTypes.SELECT }
    );

    const existingResourceNames = existingNames.map(
      (obj: any) => obj.resource_name
    );

    // Insert only if the values do not exist
    const resourcesToInsert = [
      {
        id: 1,
        resource_name: 'ASSET',
        description: 'Asset table permission',
      },
      {
        id: 2,
        resource_name: 'USER',
        description: 'User table permission',
      },
      {
        id: 3,
        resource_name: 'EVENT',
        description: 'Event table permission',
      },
      {
        id: 4,
        resource_name: 'USER_ABSTRACT',
        description: 'Abstract table permission',
      },
      {
        id: 5,
        resource_name: 'COMPANY',
        description: 'Company table permission',
      },
      {
        id: 6,
        resource_name: 'COUPON',
        description: 'Coupon table permission',
      },
      {
        id: 7,
        resource_name: 'VOLUNTEER_EVENT',
        description: 'Volunteer Event table permission',
      },
    ].filter((status) => !existingResourceNames.includes(status.resource_name));

    if (resourcesToInsert.length > 0) {
      await queryInterface.bulkInsert('resource', resourcesToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('resource', {
      resource_name: [
        'USER',
        'EVENT',
        'USER_ABSTRACT',
        'COMPANY',
        'COUPON',
        'ASSET',
        'VOLUNTEER_EVENT',
      ],
    });
  },
};
