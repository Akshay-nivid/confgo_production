import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingCodes = await queryInterface.sequelize.query(
      `SELECT code FROM payment_method WHERE code IN ('PAYPAL')`,
      { type: QueryTypes.SELECT }
    );

    const existingPaymentCodes = existingCodes.map(
      (obj: any) => obj.code
    );

    // Insert only if the values do not exist
    const paymentsToInsert = [
      {
        code: 'PAYPAL',
        handler: 'PAYPAL',
        enabled: 1,
        name: 'PAYPAL',
        description: 'Perfect for all payment',
        min_amount: 1,
        max_amount: 100000,
      },
    ].filter((obj) => !existingPaymentCodes.includes(obj.code));

    if (paymentsToInsert.length > 0) {
      await queryInterface.bulkInsert('payment_method', paymentsToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('payment_method', {
      code: ['PAYPAL'],
    });
  },
};
