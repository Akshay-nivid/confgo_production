import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingNames = await queryInterface.sequelize.query(
      `SELECT name FROM plan WHERE name IN ('BASIC_PLAN', 'STANDARD_PLAN', 'PRO_PLAN', 'ENTERPRISE_PLAN')`,
      { type: QueryTypes.SELECT }
    );
    const existingPlanNames = existingNames.map((obj: any) => obj.name);

    // Insert only if the values do not exist
    const plansToInsert = [
      {
        id:1,
        name: 'BASIC_PLAN',
        description: 'Price: $6,000 per year',
        amount: '6000.00',
        currency: 'US Dollar',
        organization_type: 'Smaller organizations',
        event_limits: '{"totalEvent":2,"noOfAttendees":250}',
        event_allotment: '2 events/year <br/>250 participants/event',
        validity_day: '365',
        status_id: 1,
      },
      {
        id:2,
        name: 'STANDARD_PLAN',
        description: 'Price: $10,000 per year',
        amount: '10000.00',
        currency: 'US Dollar',
        event_allotment: '4 events/year <br/>500 participants/event',
        organization_type: 'Mid-sized organizations',
        event_limits: '{"totalEvent":4,"noOfAttendees":500}',
        validity_day: '365',
        status_id: 1,
      },
      {
        id:3,
        name: 'PRO_PLAN',
        description: 'Price: $18,000 per year',
        amount: '18000.00',
        currency: 'US Dollar',
        organization_type: 'Larger organizations',
        event_limits: '{"totalEvent":6,"noOfAttendees":1000}',
        event_allotment: '6 events/year <br/>1000 participants/event',
        validity_day: '365',
        status_id: 1,
      },
      {
        id:4,
        name: 'ENTERPRISE_PLAN',
        description: 'Contact us for further details',
        organization_type: 'Larger organizations',
        amount: '0.00',
        currency: 'US Dollar',
        event_limits: '{"totalEvent":"unlimited","noOfAttendees":"unlimited"}',
        event_allotment: 'Unlimited events (offline, online, hybrid), with higher attendee limits (negotiable).',
        validity_day: '365',
        status_id: 1,
      },
    ].filter((obj) => !existingPlanNames.includes(obj.name));

    if (plansToInsert.length > 0) {
      await queryInterface.bulkInsert('plan', plansToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('plan', {
      name: ['BASIC_PLAN', 'STANDARD_PLAN', 'PRO_PLAN', 'ENTERPRISE_PLAN'],
    });
  },
};
