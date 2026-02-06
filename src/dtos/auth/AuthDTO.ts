import { User } from '../../models/User';
import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface AuthDTO
 * @author : sarathavs
 */

export interface AuthResponseDTO {
  token: string | null;
  refreshToken: string | null;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  lastLogin: Date | null;
  userRole: {
    id: number;
    roleName: string;
  };
  userCart: {
    id: number | null;
  } | null;
  companyId: number | null;
  subscriptionStatus: string | null;
  acceptedTerms: number | null;
}
export interface AuthRequestDTO {
  username: string;
  password: string;
}
export interface TokenResponseDTO {
  accessToken?: string;
}
/**
 * Represents the data required to initiate an SSO authentication request.
 *
 * @property {string} provider - The name of the SSO provider (e.g., Google, Facebook).
 * @property {string} providerUserId - The unique identifier for the user from the SSO provider.
 */
export interface AuthSsoRequestDTO {
  provider: string;
  providerUserId: string;
}

/**
 * Represents the data required to create a new user during SSO registration.
 *
 * @property {string} firstName - The user's first name.
 * @property {string} [lastName] - The user's last name (optional).
 * @property {string} email - The user's email address.
 * @property {boolean} [acceptedTerms] - Whether the user has accepted the terms and conditions (optional).
 * @property {number} [statusId] - Status identifier for the user (optional, defaults may apply).
 * @property {string} [phone] - The user's phone number (optional, can be added after SSO auth).
 * @property {number} [createdBy] - Identifier for the user who created this record (optional).
 * @property {number} [modifiedBy] - Identifier for the user who last modified this record (optional).
 */
export interface CreateSsoUserDTO {
  firstName: string;
  lastName?: string;
  email: string;
  ssoMetadata: string;
  acceptedTerms?: boolean;
  statusId?: number;
  phone?: string;
  createdBy?: number;
  modifiedBy?: number;
}

/**
 * Represents the response sent after a successful SSO authentication.
 *
 * @property {string | null} token - The JWT token for user authentication, or null if not issued.
 * @property {number} id - The user's unique identifier.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email address.
 * @property {Date | null} lastLogin - The timestamp of the user's last login, or null if not available.
 * @property {boolean} phoneVerified - Indicates whether the user's phone number is verified.
 */
export interface AuthSSoResponseDTO {
  token: string | null;
  refreshToken:string|null,
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  lastLogin: Date | null;
  userRole?: {
    id: number;
    roleName: string;
  } | null;
  userCart: {
    id: number | null;
  } | null;
  phoneVerified: boolean;
}

export const createAuthResponse = (
  token: string | null,
  refreshToken:string|null,
  user: Partial<User> & {
    username: string | null;
    lastLogin: Date | null;
    userRole?: {
      id: number;
      roleName: string;
    } | null;
    companyId: number | null;
    subscriptionStatus: string | null;
    acceptedTerms?: number | null;
    userCart?: { id: number | null } | null;
  }
): ResponseDTO<AuthResponseDTO> => {
  const response: AuthResponseDTO = {
    token,
    refreshToken,
    id: user?.id || 0,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
    lastLogin: user?.lastLogin,
    userRole: {
      id: user?.userRole?.id || 0,
      roleName: user?.userRole?.roleName || '',
    },
    userCart: {
      id: user?.userCart?.id || null,
    },
    companyId: user?.companyId ?? 0,
    subscriptionStatus: user?.subscriptionStatus || null,
    acceptedTerms: user?.acceptedTerms ?? 0,
  };
  return {
    status: 'success',
    data: response,
  };
};
//Refresh Token renew response
export const createRefreshTokenResponse = (
  accessToken?:string
): ResponseDTO<TokenResponseDTO> => {
  const response: TokenResponseDTO = {
    accessToken,
  };
  return {
    status: 'success',
    data: response,
  };
};
/**
/**
 * Constructs the SSO authentication response.
 * 
 * This function builds the response object for successful SSO authentication, 
 * including the token, user details, and phone verification status.
 * 
 * @param {string | null} token - JWT token for authentication, or null if unavailable.
 * @param {Partial<User> & { lastLogin: Date | null }} user - Partial user details, including optional last login date.
 * @param {boolean} phoneVerified - Flag indicating if the user's phone number has been verified.
 * @returns {ResponseDTO<AuthSSoResponseDTO>} - Standard API response with user and authentication data.
 */
export const createSsoAuthResponse = (
  token: string | null,
  refreshToken:string|null,
  user: Partial<User> & {
    lastLogin: Date | null;
    userRole?: {
      id: number;
      roleName: string;
    } | null;
    userCart?: { id: number | null } | null;
  },

  phoneVerified: boolean
): ResponseDTO<AuthSSoResponseDTO> => {
  const response: AuthSSoResponseDTO = {
    token,
    refreshToken,
    id: user?.id || 0,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    lastLogin: user?.lastLogin,
    userRole: {
      id: user?.userRole?.id || 0,
      roleName: user?.userRole?.roleName || '',
    },
    userCart: {
      id: user?.userCart?.id || null,
    },
    phoneVerified: phoneVerified,
  };
  return {
    status: 'success',
    data: response,
  };
};
