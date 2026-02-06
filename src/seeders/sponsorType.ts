import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingNames = await queryInterface.sequelize.query(
      `SELECT name FROM sponsor_type WHERE name IN ('DIAMOND', 'PLATINUM', 'GOLD', 'SILVER')`,
      { type: QueryTypes.SELECT }
    );

    const existingSponsorTypeNames = existingNames.map(
      (obj: any) => obj.name
    );

    // Insert only if the values do not exist
    const typeNameToInsert = [
      {
        id: 1,
        name: 'DIAMOND',
        description: 'DIAMOND',
      },
      {
        id: 2,
        name: 'PLATINUM',
        description: 'PLATINUM',
      },
      {
        id: 3,
        name: 'GOLD',
        description: 'GOLD',
      },
      {
        id: 4,
        name: 'SILVER',
        description: 'SILVER',
      }
    ].filter((obj) => !existingSponsorTypeNames.includes(obj.name));

    if (typeNameToInsert.length > 0) {
      await queryInterface.bulkInsert('sponsor_type', typeNameToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('sponsor_type', {
        name: [
        'DIAMOND',
        'PLATINUM',
        'GOLD',
        'SILVER',
      ],
    });
  },
};
