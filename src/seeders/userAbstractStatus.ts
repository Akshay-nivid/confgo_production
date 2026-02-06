import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingStatuses = await queryInterface.sequelize.query(
      `SELECT status_name FROM user_abstract_status WHERE status_name IN ('APPROVED', 'REJECTED', 'SUBMITTED', 'ASSIGNED')`,
      { type: QueryTypes.SELECT }
    );

    const existingStatusNames = existingStatuses.map(
      (status: any) => status.status_name
    );

    // Insert only if the values do not exist
    const statusesToInsert = [
      { id: 1, status_name: 'APPROVED', description: 'APPROVED' },
      { id: 2, status_name: 'REJECTED', description: 'REJECTED' },
      { id: 3, status_name: 'SUBMITTED', description: 'SUBMITTED' },
      { id: 4, status_name: 'ASSIGNED', description: 'ASSIGNED' },
    ].filter((status) => !existingStatusNames.includes(status.status_name));

    if (statusesToInsert.length > 0) {
      await queryInterface.bulkInsert('user_abstract_status', statusesToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('user_abstract_status', {
      status_name: ['APPROVED', 'REJECTED', 'SUBMITTED', 'ASSIGNED'],
    });
  },
};
