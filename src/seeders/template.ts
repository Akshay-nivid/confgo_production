import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingTemps = await queryInterface.sequelize.query(
      `SELECT name FROM template WHERE name IN ('Classic Event', 'Modern Theme', 'Minimalist Design')`,
      { type: QueryTypes.SELECT }
    );

    const existingTemplates = existingTemps.map((obj: any) => obj.name);

    // Insert only if the values do not exist
    const templatesToInsert = [
      {
        id: 1,
        name: 'Classic Event',
        description: 'A timeless template suitable for all event types.',
        enabled: 1,
        is_default: 1,
        created_by: 0,
        created_on: new Date(),
        modified_by: 0,
        modified_on: new Date(),
      },
      {
        id: 2,
        name: 'Modern Theme',
        description: 'A sleek and modern template for contemporary events.',
        enabled: 1,
        is_default: 0,
        created_by: 0,
        created_on: new Date(),
        modified_by: 0,
        modified_on: new Date(),
      },
      {
        id: 3,
        name: 'Minimalist Design',
        description: 'A clean and minimal template focused on simplicity.',
        enabled: 1,
        is_default: 0,
        created_by: 0,
        created_on: new Date(),
        modified_by: 0,
        modified_on: new Date(),
      },
    ].filter((obj) => !existingTemplates.includes(obj.name));

    if (templatesToInsert.length > 0) {
      await queryInterface.bulkInsert('template', templatesToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('template', {});
  },
};
