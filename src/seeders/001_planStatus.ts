import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingStatuses = await queryInterface.sequelize.query(
      `SELECT status_name FROM plan_status WHERE status_name IN ('ACTIVE', 'INACTIVE')`,
      { type: QueryTypes.SELECT }
    );

    const existingStatusNames = existingStatuses.map((status: any) => status.status_name);

    // Insert only if the values do not exist
    const statusesToInsert = [
      { id: 1, status_name: 'ACTIVE', description: 'ACTIVE' },
      { id: 2, status_name: 'INACTIVE', description: 'INACTIVE' },
    ].filter(status => !existingStatusNames.includes(status.status_name));

    if (statusesToInsert.length > 0) {
      await queryInterface.bulkInsert('plan_status', statusesToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('plan_status', {
      status_name: ['ACTIVE', 'INACTIVE'],
    });
  },
};
