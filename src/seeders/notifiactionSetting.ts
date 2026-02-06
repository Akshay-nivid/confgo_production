import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingNames = await queryInterface.sequelize.query(
      `SELECT action_name FROM notification_setting WHERE action_name IN ('COMPANY_REGISTRATION', 'USER_REGISTRATION', 
      'CONTACT_US_SUBMIT', 'CONTACT_US_SUBMIT_ACKNOWLEDGE', 'COMPANY_FORGOT_PASSWORD', 'EVENT_SHARE', 'EVENT_REGISTRATION',
      'EVENT_REMINDER','ROLE_EVENT_REMINDER', 'SPONSORSHIP_INTEREST_SUBMIT', 'SPONSORSHIP_INTEREST_SUBMIT_ACKNOWLEDGE',
      'SUBSCRIPTION_EXPIRY', 'OTP_SENDING')`,
      { type: QueryTypes.SELECT }
    );

    const existingNotiNames = existingNames.map((obj: any) => obj.action_name);

    // Insert only if the values do not exist
    const settingsToInsert = [
      {
        id:1,
        action_name: 'COMPANY_REGISTRATION',
        description: 'COMPANY_REGISTRATION',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      { 
        id:2,
        action_name: 'USER_REGISTRATION',
        description: 'USER_REGISTRATION',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:3,
        action_name: 'CONTACT_US_SUBMIT',
        description: 'CONTACT_US_SUBMIT',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:4,
        action_name: 'CONTACT_US_SUBMIT_ACKNOWLEDGE',
        description: 'CONTACT_US_SUBMIT_ACKNOWLEDGE',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:5,
        action_name: 'COMPANY_FORGOT_PASSWORD',
        description: 'COMPANY_FORGOT_PASSWORD',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id: 6,
        action_name: 'EVENT_SHARE',
        description: 'EVENT_SHARE',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id: 7,
        action_name: 'EVENT_REGISTRATION',
        description: 'EVENT_REGISTRATION',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:8,
        action_name: 'USER_REGISTRATION',
        description: 'USER_REGISTRATION',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:9,
        action_name: 'EVENT_REMINDER',
        description: 'EVENT_REMINDER',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      { 
        id:10,
        action_name: 'ROLE_EVENT_REMINDER',
        description: 'ROLE_EVENT_REMINDER',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:11,
        action_name: 'USER_FORGOT_PASSWORD',
        description: 'USER_FORGOT_PASSWORD',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:12,
        action_name: 'SPONSORSHIP_INTEREST_SUBMIT',
        description: 'SPONSORSHIP_INTEREST_SUBMIT',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:13,
        action_name: 'SPONSORSHIP_INTEREST_SUBMIT_ACKNOWLEDGE',
        description: 'SPONSORSHIP_INTEREST_SUBMIT_ACKNOWLEDGE',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:14,
        action_name: 'SUBSCRIPTION_EXPIRY',
        description: 'SUBSCRIPTION_EXPIRY',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
      {
        id:15,
        action_name: 'OTP_SENDING',
        description: 'OTP_SENDING',
        email: 1,
        sms: 0,
        whatsapp: 0,
        is_enabled: 1,
      },
    ].filter((obj) => !existingNotiNames.includes(obj.action_name));

    if (settingsToInsert.length > 0) {
      await queryInterface.bulkInsert('notification_setting', settingsToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('notification_setting', {
      action_name: [
        'COMPANY_REGISTRATION',
        'USER_REGISTRATION',
        'CONTACT_US_SUBMIT',
        'COMPANY_FORGOT_PASSWORD',
        'EVENT_REGISTRATION',
        'USER_REGISTRATION',
        'EVENT_REMINDER',
        'ROLE_EVENT_REMINDER',
        'USER_FORGOT_PASSWORD',
        'SPONSORSHIP_INTEREST_SUBMIT',
        'SUBSCRIPTION_EXPIRY',
        'OTP_SENDING'
      ],
    });
  },
};
