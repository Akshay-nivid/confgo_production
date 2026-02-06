import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingColors = await queryInterface.sequelize.query(
      `SELECT color FROM color WHERE color IN ('DARK_GREEN', 'LIGHT_GREEN', 'RED', 'BLUE', 'ORANGE')`,
      { type: QueryTypes.SELECT }
    );
    const existingColor = existingColors.map((obj: any) => obj.color);

    // Insert only if the values do not exist
    const colorsToInsert = [
      {
        id: 1,
        color: 'DARK_GREEN',
      },
      {
        id: 2,
        color: 'LIGHT_GREEN',
      },
      {
        id: 3,
        color: 'RED',
      },
      {
        id: 4,
        color: 'BLUE',
      },
      {
        id: 5,
        color: 'ORANGE',
      }
    ].filter((obj) => !existingColor.includes(obj.color));

    if (colorsToInsert.length > 0) {
      await queryInterface.bulkInsert('color', colorsToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('color', {
      name: ['DARK_GREEN', 'LIGHT_GREEN', 'RED', 'BLUE', 'ORANGE'],
    });
  },
};
