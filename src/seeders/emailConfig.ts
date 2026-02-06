import { QueryInterface, QueryTypes } from 'sequelize';
export = {
  async up(queryInterface: QueryInterface) {
    // Check if the values already exist
    const existingNames = await queryInterface.sequelize.query(
      `SELECT config_name FROM email_config WHERE config_name IN ('COMPANY_REGISTRATION', 'CONTACT_US_SUBMIT', 
      'CONTACT_US_SUBMIT_ACKNOWLEDGE', 'COMPANY_FORGOT_PASSWORD', 'EVENT_REGISTRATION', 'EVENT_SHARE', 'USER_REGISTRATION',
      'EVENT_REMINDER','ROLE_EVENT_REMINDER','USER_FORGOT_PASSWORD', 'SPONSORSHIP_INTEREST_SUBMIT', 'SPONSORSHIP_INTEREST_SUBMIT_ACKNOWLEDGE',
      'SUBSCRIPTION_EXPIRY', 'OTP_SENDING')`,
      { type: QueryTypes.SELECT }
    );

    const existingConfigNames = existingNames.map(
      (obj: any) => obj.config_name
    );

    // Insert only if the values do not exist
    const configsToInsert = [
      {
        id:1,
        config_name: 'COMPANY_REGISTRATION',
        template: 'email_verify',
        subject: 'Company Registration',
        enabled: 1,
      },
      {
        id:2,
        config_name: 'CONTACT_US_SUBMIT',
        template: 'contact_us_mail',
        subject: 'New Contact Form Submission',
        enabled: 1,
      },
      {
        id:3,
        config_name: 'CONTACT_US_SUBMIT_ACKNOWLEDGE',
        template: 'contact_us_acknowledge_mail',
        subject: 'Thank you for contacting Confgo',
        enabled: 1,
      },
      {
        id:4,
        config_name: 'COMPANY_FORGOT_PASSWORD',
        template: 'password_reset',
        subject: 'Reset password link',
        enabled: 1,
      },
      {
        id:5,
        config_name: 'EVENT_REGISTRATION',
        template: 'event_registration',
        subject: 'Event Registration',
        enabled: 1,
      },
      {
        id:6,
        config_name: 'EVENT_SHARE',
        template: 'event_invitation_mail',
        subject: 'Event Invitation',
        enabled: 1,
      },
      {
        id:7,
        config_name: 'USER_REGISTRATION',
        template: 'useremail_verify',
        subject: 'User Registration',
        enabled: 1,
      },
      {
        id:8,
        config_name: 'EVENT_REMINDER',
        template: 'event_reminder',
        subject: 'Event Reminder',
        enabled: 1,
      },
      {
        id:9,
        config_name: 'ROLE_EVENT_REMINDER',
        template: 'role_event_reminder',
        subject: 'Role Based Event Reminder',
        enabled: 1,
      },
      {
        id:10,
        config_name: 'USER_FORGOT_PASSWORD',
        template: 'password_reset',
        subject: 'User Reset password link',
        enabled: 1,
      },
      {
        id:11,
        config_name: 'SPONSORSHIP_INTEREST_SUBMIT',
        template: 'sponsorship_interest_mail',
        subject: 'Sponsorship Interest',
        enabled: 1,
      },
      {
        id:12,
        config_name: 'SPONSORSHIP_INTEREST_SUBMIT_ACKNOWLEDGE',
        template: 'sponsorship_interest_acknowledge_mail',
        subject: 'Thank you for contacting Confgo',
        enabled: 1,
      },
      {
        id:13,
        config_name: 'SUBSCRIPTION_EXPIRY',
        template: 'subscription_expiry',
        subject: 'Your Subscription is Expiring Soon!',
        enabled: 1,
      },
      {
        id:14,
        config_name: 'OTP_SENDING',
        template: 'otp_sending_mail',
        subject: 'Your One-Time Password (OTP)',
        enabled: 1,
      },
    ].filter((obj) => !existingConfigNames.includes(obj.config_name));

    if (configsToInsert.length > 0) {
      await queryInterface.bulkInsert('email_config', configsToInsert);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('email_config', {
      config_name: [
        'COMPANY_REGISTRATION',
        'CONTACT_US_SUBMIT',
        'CONTACT_US_SUBMIT_ACKNOWLEDGE',
        'COMPANY_FORGOT_PASSWORD',
        'EVENT_REGISTRATION',
        'EVENT_SHARE',
        'USER_REGISTRATION',
        'EVENT_REMINDER',
        'ROLE_EVENT_REMINDER',
        'USER_FORGOT_PASSWORD',
        'SPONSORSHIP_INTEREST_SUBMIT',
        'SPONSORSHIP_INTEREST_SUBMIT_ACKNOWLEDGE',
        'SUBSCRIPTION_EXPIRY',
        'OTP_SENDING'
      ],
    });
  },
};
