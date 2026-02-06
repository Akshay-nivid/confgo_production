import { Token } from '../../models/Token';
import { User } from '../../models/User';
import { VolunteerEvent } from '../../models/VolunteerEvent';
import { enumRoll } from '../../utils/enum';
import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface CreateUserDTO
 * @description Interface for creating a new user.
 * @author : sarathavs
 */
export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  acceptedTerms?: number;
  statusId?: number;
  phone: string;
  roleId?: number;
  companyId?:number;
  assetId?: string;
  createdBy: number;
  modifiedBy: number;
}

export interface CreateSsoUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  isSsoUser: number;
  ssoMetadata: string;
  provider: string;
  providerUserId: string;
  acceptedTerms?: number;
  statusId?: number;
  phone?: string;
  assetId?: string;
  createdBy: number;
  modifiedBy: number;
}

/**
 * @interface UpdateUserDTO
 * @description Interface for updating an existing user.
 */
export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  assetId?: string;
  deviceToken?:string;
  phoneVerified?: number;
  statusId?: number;
}

/**
 * @interface UserResponseDTO
 * @description Interface for formatting user data in responses.
 */
export interface UserResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  userDescription: string;
  assetId?: string;
  acceptedTerms?: boolean;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

/**
 * @interface UserCreationResponseDTO
 * @description Interface for formatting user data in responses.
 */
export interface UserCreationResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assetId?: string;
  designation?: string;
  userDescription?: string;
  acceptedTerms?: number;
  token: {
    token: string;
    userId?: number;
    type: string;
  };
}
//assign event to volunteer user
export interface AssignEventVolunteerDTO {
  userIds: number[];
  eventId: number;
  speakerFileId?: number;
  statusId?: number;
  
}
export interface AssignEventVolunteerResponseDTO {
  userId: number;
  eventId?: number;
  statusId?: number;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}
/**
 * @interface RetriveUserDTO
 * @description Interface for updating an existing user.
 */
export interface RetriveUserDTO {
  token: string;
  userId: number;
  type: string;
}

export interface CheckUserRegistrationDTO {
  phone: string;
  email: string;
}

export interface AssignEventToUserDTO {
  userId: number;
  eventId: number;
}
export interface UserRoleFilterDTO {
  userId: number;
  eventId: number;
  statusId: number;
  roleId: number;
  companyId:number;
  name:string;
  phone: number;
  roleEnums:enumRoll[];
}
export interface UserEventResponseDTO {
  userId: number;
  eventId: number;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

/**
 * @function createUserResponse
 * @description Formats the response data for user creation.
 * @param user - The user data to format.
 * @returns The formatted response data.
 */
export const createUserResponse = (
  user: User,
  token: Token
): ResponseDTO<UserCreationResponseDTO> => {
  const response: UserCreationResponseDTO = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    designation:user.designation||'',
    userDescription:user.userDescription||'',
    phone: user.phone || '',
    assetId: user.assetId,
    acceptedTerms: user.acceptedTerms,
    token: {
      token: token.token,
      userId: token.userId || 0,
      type: token.type,
    },
  };

  return {
    status: 'success',
    message: 'User created successfully',
    data: response,
  };
};

/**
 * @function updateUserResponse
 * @description Formats the response data for user updates.
 * @param user - The user data to format.
 * @returns The formatted response data.
 */
export const updateUserResponse = (
  user: UserResponseDTO
): ResponseDTO<UserResponseDTO> => {
  return {
    status: 'success',
    message: 'User updated successfully',
    data: user,
  };
};

/**
 * @function getUserResponse
 * @description Formats the response data for retrieving a user.
 * @param user - The user data to format.
 * @returns The formatted response data.
 */
export const getUserResponse = (
  user: UserResponseDTO
): ResponseDTO<UserResponseDTO> => {
  return {
    status: 'success',
    data: user,
  };
};

export interface UpdatePasswordDTO {
  password: string;
  token: string;
  userId: number;
  type: string;
}

export const updatePasswordResponse = (): ResponseDTO<boolean> => {
  return {
    status: 'success',
    message: 'Password updated successfully',
  };
};

/**
 * @interface CreateUserRoleDTO
 * @description interface for creating a user role assignment.
 */
export interface CreateUserRoleDTO {
  userId: number;
  roleId: number;
}

/**
 * @interface UpdateUserPhoneDTO
 * @description Interface for updating user phone number.
 */
export interface UpdateUserPhoneDTO {
  phone: string;
  token: string;
  type: string;
  otp: number;
  userId: number;
}

/**
 * DTO for the Forgot Password request.
 *
 * @interface ForgotPasswordRequestDTO
 * @property {string} username - The username of the user requesting the password reset.
 */
export interface ForgotPasswordRequestDTO {
  username: string;
}

/**
 * DTO for the Forgot Password response.
 *
 * @interface ForgotPasswordResponseDTO
 * @property {number} id - The ID of the user.
 * @property {string} [email] - The email of the user.
 * @property {string} [phone] - The phone number of the user.
 * @property {Token} [token] - The token object for resetting the password.
 */
export interface ForgotPasswordResponseDTO {
  id: number;
  email?: string;
  phone?: string;
  role: {
    id: number;
    roleName: string;
  };
  token?: {
    token: string;
    userId?: number;
    otp: number;
    type: string;
  };
}

/**
 * Creates the response object for a forgot password request.
 *
 * This function generates a structured response based on the provided user information
 * and an optional token. The response includes the user's ID, email, phone, and the token data.
 *
 * @param {User} user - The user object containing details like ID, email, and phone.
 * @param {Token} [token] - Optional token object for resetting the password.
 * @returns {ResponseDTO<ForgotPasswordResponseDTO>} - A standardized success response containing user and token details.
 */
export const createForgotPasswordResponse = (
  user: User,
  userRole: {
    id: number;
    roleName: string;
  },
  token?: Token
): ResponseDTO<ForgotPasswordResponseDTO> => {
  const response: ForgotPasswordResponseDTO = {
    id: user.id,
    email: user.email,
    phone: user.phone ? user.phone.replace(/.(?=.{4})/g, '*') : '',
    role: {
      id: userRole.id,
      roleName: userRole.roleName,
    },
    token: {
      token: token?.token || '',
      userId: token?.userId || 0,
      otp: token?.otp || 0,
      type: token?.type || '',
    },
  };

  return {
    status: 'success',
    message: 'success',
    data: response,
  };
};

export const assignEventVolunteerResponse = (
  volunteers: VolunteerEvent[]
): ResponseDTO<AssignEventVolunteerResponseDTO[]> => {
  const response: AssignEventVolunteerResponseDTO[] = volunteers.map((volunteer) => ({
    id: volunteer.id,
    userId: volunteer.userId,
    statusId: volunteer.statusId,
    eventId: volunteer.eventId as number, // Assert that eventId is always a number
    createdBy: volunteer.createdBy || 0,
    createdOn: volunteer.createdOn || new Date(),
    modifiedBy: volunteer.modifiedBy || 0,
    modifiedOn: volunteer.modifiedOn || new Date(),
  }));

  return {
    status: 'success',
    message: 'Event Volunteer created successfully',
    data: response,
  };
};

export interface UserListFiltersDTO{
  statusId?:number;
  roleId?: number;
  userId?: number;
  roleEnums?: string[];
  name?: string;
  companyId?: number;
}

export interface PasswordDataDTO {
  currentPassword: string;
  newPassword: string;
}