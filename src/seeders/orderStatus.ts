import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingStatuses = await queryInterface.sequelize.query(
      `SELECT status_name FROM order_status WHERE status_name IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELED')`,
      { type: QueryTypes.SELECT }
    );

    const existingStatusNames = existingStatuses.map(
      (status: any) => status.status_name
    );

    // Insert only if the values do not exist
    const statusesToInsert = [
      {
        id: 1,
        status_name: 'PENDING',
        description: 'Order is pending payment',
      },
      {
        id: 2,
        status_name: 'COMPLETED',
        description: 'Order has been completed',
      },
      { id: 3, status_name: 'FAILED', description: 'Payment has failed' },
      {
        id: 4,
        status_name: 'CANCELED',
        description: 'Order has been canceled',
      },
    ].filter((status) => !existingStatusNames.includes(status.status_name));

    if (statusesToInsert.length > 0) {
      await queryInterface.bulkInsert('order_status', statusesToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('order_status', {
      status_name: ['ACTIVE', 'INACTIVE'],
    });
    await queryInterface.bulkDelete('order_status', {
      status_name: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELED'],
    });
  },
};
