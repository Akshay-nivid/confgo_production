import { Token } from '../../models/Token';
import { ResponseDTO, createResponse } from '../ResponseDTO';

/**
 * @interface TokenValidationDTO
 * @interface OtpValidationDTO
 * @interface CreateTokenDTO
 * @description Interface for creating a new participant type.
 */
export interface CreateTokenDTO {
  type: string;
  userId: number;
  email: string;
}

/**
 * @interface CreateOtpTokenDTO
 * @description Interface for creating a new participant type.
 */
export interface CreateOtpTokenDTO {
  phone: string;
  type: string;
  email?: string;
}

/**
 * @interface OtpTokenResponseDTO
 * @description Interface for formatting participant type data in responses.
 */
export interface OtpTokenResponseDTO {
  id: number;
  type: string;
  createdOn: Date;
  otp?: number;
  token: string;
  createdBy: number;
  modifiedOn: Date;
  modifiedBy: number;
}

/**
 * @function createOtpTokenResponse
 * @description Formats the response data for participant type creation.
 * @param user - The participant type data to format.
 * @returns The formatted response data.
 */
export const createOtpTokenResponse = (
  token: Token
): ResponseDTO<OtpTokenResponseDTO> => {
  const response: OtpTokenResponseDTO = {
    id: token.id,
    type: token.type,
    token: token.token,
    otp: token.otp, //TODO : need to remove
    createdBy: 0,
    createdOn: token.createdOn || new Date(),
    modifiedBy: 0,
    modifiedOn: token.modifiedOn || new Date(),
  };

  return createResponse({
    status: 'success',
    message: 'Otp generated successfully',
    data: response,
  });
};

/**
 * @interface TokenResponseDTO
 * @description Defines the structure of the response object for create token .
 */
export interface TokenResponseDTO {
  id: number;
  type: string;
  token: string;
  userId?: number;
}

/**
 * @function createTokenResponse
 * @description Formats the response data for participant type creation.
 * @param user - The participant type data to format.
 * @returns The formatted response data.
 */
export const createTokenResponse = (
  token?: Token
): ResponseDTO<TokenResponseDTO | null> => {
  if (!token) {
    return createResponse({
      status: 'error',
      message: 'Token creation failed',
      data: null,
    });
  }
  const response: TokenResponseDTO = {
    id: token.id,
    type: token.type,
    token: token.token,
    userId: token.userId,
  };
  return createResponse({
    status: 'success',
    message: 'Token created successfully',
    data: response,
  });
};

export interface TokenValidationDTO {
  userId: number;
  token: string;
  type: string;
}

export interface OtpValidationDTO {
  userId: number;
  token: string;
  type: string;
  otp: number;
}

/**
 * Otp Validation Response
 * @description Formats the response data for participant type creation.
 * @param user - The participant type data to format.
 * @returns The formatted response data.
 */
export const getOtpValidationResponse = (result: {
  isValid: boolean;
  token?: string;
}): ResponseDTO<{
  isValid: boolean;
  token?: string;
}> => {
  if (result.isValid) {
    return createResponse({
      status: 'success',
      message: 'OTP validate succefully',
      data: result,
    });
  } else {
    return createResponse({
      status: 'error',
      message: 'OTP validate Failed',
      data: result,
    });
  }
};

/**
 * Token Validation Response
 * @description Formats the response data for participant type creation.
 * @param user - The participant type data to format.
 * @returns The formatted response data.
 */
export const getTokenValidationResponse = (
  result: boolean
): ResponseDTO<boolean> => {
  if (result) {
    return createResponse({
      status: 'success',
      message: 'Token validate succefully',
      data: result,
    });
  } else {
    return createResponse({
      status: 'error',
      message: 'Token validate Failed',
      data: result,
    });
  }
};

export interface StatusValidationDTO {
  name: string;
}

export interface StatusValidateDTO {
  statusName: string;
}
export interface StatusResponseDTO {
  id?: number;
  statusName?: string;
  description?: string;
}

export interface StatusFilterDTO {
  id?: number;
  statusName?: string;
  description?: string;
}

export const getStatusByNameResponse = (
  result: StatusResponseDTO
): ResponseDTO<StatusResponseDTO> => {
  if (result) {
    return createResponse({
      status: 'success',
      message: ' status get succefully',
      data: result,
    });
  } else {
    return createResponse({
      status: 'error',
      message: 'Failed to retrive the status',
      data: result,
    });
  }
};

export const getAllStatusResponse = (
  result: StatusResponseDTO[]
): ResponseDTO<StatusResponseDTO[]> => {
  if (result) {
    return {
      status: 'success',
      message: ' status get succefully',
      data: result,
    };
  } else {
    return {
      status: 'error',
      message: 'Failed to retrive the status',
      data: result,
    };
  }
};
