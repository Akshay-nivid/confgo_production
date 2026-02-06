import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingNames = await queryInterface.sequelize.query(
      `SELECT name FROM addon WHERE name IN ('Food', 'Game','Certificate')`,
      { type: QueryTypes.SELECT }
    );

    const existingAddonNames = existingNames.map((obj: any) => obj.name);

    // Insert only if the values do not exist
    const addonsToInsert = [
      {
        id: 1,
        name: 'Food',
        description: 'Food',
        owner: 'ADMIN',
      },
      {
        id: 2,
        name: 'Game',
        description: 'Game',
        owner: 'ADMIN',
      },
      {
        id: 3,
        name: 'Certificate',
        description: 'Certificate',
        owner: 'ADMIN',
      },
    ].filter((obj) => !existingAddonNames.includes(obj.name));

    if (addonsToInsert.length > 0) {
      await queryInterface.bulkInsert('addon', addonsToInsert);
    }
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('addon', {
      name: ['Food', 'Game','Certificate'],
    });
  },
};
