import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingNames = await queryInterface.sequelize.query(
      `SELECT role_name FROM role WHERE role_name IN ('ADMIN', 'COMPANYADMIN', 'USER', 'VOLUNTEER','SPEAKER','REVIEWER')`,
      { type: QueryTypes.SELECT }
    );

    const existingRoleNames = existingNames.map(
      (obj: any) => obj.role_name
    );

    // Insert only if the values do not exist
    const rolesToInsert = [
      {
        id: 1,
        role_name: 'ADMIN',
        description: 'ADMIN',
      },
      {
        id: 2,
        role_name: 'COMPANYADMIN',
        description: 'COMPANYADMIN',
      },
      {
        id: 3,
        role_name: 'USER',
        description: 'USER',
      },
      {
        id: 4,
        role_name: 'VOLUNTEER',
        description: 'VOLUNTEER',
      },
      {
        id: 5,
        role_name: 'SPEAKER',
        description: 'SPEAKER',
      },
      {
        id: 6,
        role_name: 'REVIEWER',
        description: 'REVIEWER',
      },
    ].filter((obj) => !existingRoleNames.includes(obj.role_name));

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert('role', rolesToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('role', {
      role_name: [
        'ADMIN',
        'COMPANYADMIN',
        'USER',
        'VOLUNTEER',
        'SPEAKER',
        'REVIEWER',
      ],
    });
  },
};
