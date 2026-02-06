import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingStatuses = await queryInterface.sequelize.query(
      `SELECT status_name FROM token_status WHERE status_name IN ('ACTIVE', 'INACTIVE', 'EXPIRED')`,
      { type: QueryTypes.SELECT }
    );

    const existingStatusNames = existingStatuses.map(
      (status: any) => status.status_name
    );

    // Insert only if the values do not exist
    const statusesToInsert = [
      { id: 1, status_name: 'ACTIVE', description: 'ACTIVE' },
      { id: 2, status_name: 'INACTIVE', description: 'INACTIVE' },
      { id: 3, status_name: 'EXPIRED', description: 'EXPIRED' },
    ].filter((status) => !existingStatusNames.includes(status.status_name));

    if (statusesToInsert.length > 0) {
      await queryInterface.bulkInsert('token_status', statusesToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('token_status', {
      status_name: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
    });
  },
};
