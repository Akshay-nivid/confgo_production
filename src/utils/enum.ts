export enum enumStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

export enum enumRoll {
  ADMIN = 'ADMIN',
  COMPANYADMIN = 'COMPANYADMIN',
  USER = 'USER',
  PARTICIPANT = 'PARTICIPANT',
  VOLUNTEER = 'VOLUNTEER',
  SPEAKER = 'SPEAKER',
  REVIEWER = 'REVIEWER',
}

export enum enumTokenType {
  USER_REGISTRATION = 'USER_REGISTRATION',
  COMPANY_REGISTRATION = 'COMPANY_REGISTRATION',
  COMPANY_REGISTRATION_OTP = 'COMPANY_REGISTRATION_OTP',
  USER_REGISTRATION_OTP = 'USER_REGISTRATION_OTP',
  RESET_PASSWORD_OTP = 'RESET_PASSWORD_OTP',
  FORGOT_PASSWORD_OTP = 'FORGOT_PASSWORD_OTP',
}

export enum enumSMSConfig {
  USER_REGISTRATION_OTP = 'USER_REGISTRATION_OTP',
}

export enum enumNotificationType {
  EMAIL = 'EMAIL',
  PUSH='PUSH'
}
export enum enumNotificationActionName {
  LOGIN = 'LOGIN',
  REGISTRATION = 'REGISTRATION',
}

export enum enumCouponStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  EXPIRED = 2,
}

export enum enumEventProgramStatus {
  INACTIVE = 2,
  ACTIVE = 1,
}

export enum enumEventSpeakerStatus {
  INACTIVE = 2,
  ACTIVE = 1,
}

export enum enumTokenStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  EXPIRED = 3,
}

export enum enumPlanPropertyAssignmentStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum enumEventStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  PENDING = 3,
  COMPLETED = 4,
  DRAFTED = 5,
  DELETED = 6,
  EXPIRED = 7,
}

export enum enumSubscriptionStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  PENDING = 3,
  EXPIRED = 4,
}

export enum enumCartStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum enumOrderStatus {
  PENDING = 1,
  AWAITING_PAYMENT = 2,
  COMPLETED = 3,
  FAILED = 4,
  CANCELED = 5,
}

export enum enumPaymentState {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export enum enumEventClass {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  HYBRID = 'HYBRID',
}

export enum enumEventAddonStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum enumEventProgramSchedulerStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum enumVolunteerStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum enumNotificationStatus {
  UNSEND = 0,
  SEND = 1,
}

export enum enumAbstractStatus {
  APPROVED = 1,
  REJECTED = 2,
  SUBMITTED = 3,
  ASSIGNED = 4,
}

export enum enumVolunteerEventStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum enumSponsorStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum enumPaypalConfigStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum enumUserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum enumUserAbstractStatus {
  INACTIVE = 2,
  ACTIVE = 1,
}
