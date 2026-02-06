import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingNames = await queryInterface.sequelize.query(
      `SELECT name FROM specialty WHERE name IN ('MEDICAL', 'BUSINESS', 'ACADEMIC', 'CULTURAL', 'ENTERTAINMENT', 'OTHERS')`,
      { type: QueryTypes.SELECT }
    );

    const existingSpecialityNames = existingNames.map(
      (obj: any) => obj.name
    );

    // Insert only if the values do not exist
    const specialityToInsert = [
      {
        id: 1,
        name: 'MEDICAL',
        description: 'MEDICAL',
      },
      {
        id: 2,
        name: 'BUSINESS',
        description: 'BUSINESS',
      },
      {
        id: 3,
        name: 'ACADEMIC',
        description: 'ACADEMIC',
      },
      {
        id: 4,
        name: 'CULTURAL',
        description: 'CULTURAL',
      },
      {
        id: 5,
        name: 'ENTERTAINMENT',
        description: 'ENTERTAINMENT',
      },
      {
        id: 6,
        name: 'OTHERS',
        description: 'OTHERS',
      },
    ].filter((obj) => !existingSpecialityNames.includes(obj.name));

    if (specialityToInsert.length > 0) {
      await queryInterface.bulkInsert('specialty', specialityToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('specialty', {
      name: [
        'MEDICAL',
        'BUSINESS',
        'ACADEMIC',
        'CULTURAL',
        'ENTERTAINMENT',
        'OTHERS',
      ],
    });
  },
};
