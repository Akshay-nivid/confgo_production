import { Request } from 'express';
import { validateAssignEvent, validateAssignEventToVolunteer, validatePassword, validateUser } from '../../validators/userValidator';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UpdatePasswordDTO,
  RetriveUserDTO,
  UpdateUserPhoneDTO,
  ForgotPasswordRequestDTO,
  CheckUserRegistrationDTO,
  AssignEventToUserDTO,
  AssignEventVolunteerDTO,
  PasswordDataDTO
} from '../../dtos/user/UserDTO';
import { AppError } from '../../utils/AppError';
import Joi from 'joi';
import { validateObjectRequest } from '../../validators/validator';

/**
 * Extracts and validates user data from the request for user creation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 * @author : sarathavs
 */
export const extractUserData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateUserDTO => {
  const { firstName, lastName, email, phone, assetId,roleId ,companyId,userDescription,designation} = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateUser(
    { firstName, lastName, email, phone, assetId ,roleId,companyId,userDescription,designation},
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateUserDTO;
};

/**
 * Extracts and validates user data from the request for user update.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 */
export const extractUpdateUserData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateUserDTO => {
  const { firstName, lastName, email, acceptedTerms, assetId,statusId,deviceToken,userDesciption,designation } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateUser(
    { firstName, lastName, email, acceptedTerms, assetId,statusId,deviceToken,userDesciption,designation },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateUserDTO;
};

/**
 *
 * @param req
 * @param schema
 * @returns
 */
export const extractPassword = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdatePasswordDTO => {
  const { password, token, userId, type } = req.body;
  const { error, value } = validatePassword(
    { password, token, userId, type },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdatePasswordDTO;
};

/**
 * Extracts user data from the request and validates it against the provided schema.
 *
 * @param req - The Express request object containing the user data.
 * @param schema - The Joi validation schema used to validate the extracted data.
 * @returns The validated user data as an RetriveUserDTO object.
 * @throws AppError if validation fails, with an error message and status code 400.
 */
export const extractUserDetailData = (
  req: Request,
  schema: Joi.ObjectSchema
): RetriveUserDTO => {
  const { token, userId, type } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateUser({ token, userId, type }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as RetriveUserDTO;
};

/**
 * Extracts and validates user data from the request for user updateUserPhone.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated updateUserPhone data.
 * @throws AppError if validation fails.
 */
export const extractupdateUserPhoneData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateUserPhoneDTO => {
  const { phone, token, type, otp } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateUser({ phone, token, type, otp }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateUserPhoneDTO;
};

/**
 * Extracts and validates user data from the request for user update.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 */
export const extractforgetpasswordData = (
  req: Request,
  schema: Joi.ObjectSchema
): ForgotPasswordRequestDTO => {
  const { username } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      username,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as ForgotPasswordRequestDTO;
};

export const extractPhoneAndEmail = (
  req: Request,
  schema: Joi.ObjectSchema
): CheckUserRegistrationDTO => {
  const { phone, email } = req.body;
  const { error, value } = validateUser({ phone, email }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CheckUserRegistrationDTO;
};

/**
 * Extracts and validates user data from the request for assign event.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated attendee data.
 * @throws AppError if validation fails.
 */
export const extractUserEventData = (
  req: Request,
  schema: Joi.ObjectSchema
): AssignEventToUserDTO => {
  const { userId, eventId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateAssignEvent(
    {
      userId,
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as AssignEventToUserDTO;
};
export const extractAssignVolunteerData = (
  req: Request,
  schema: Joi.ObjectSchema
): AssignEventVolunteerDTO => {
  const {
    userIds,
    eventId,
    speakerFileId,
    statusId,
  } = req.body;

  const { error, value } = validateAssignEventToVolunteer(
    {
      userIds,
      eventId,
      speakerFileId,
      statusId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as AssignEventVolunteerDTO;
};

/**
 * This function extracts the data for changing a user's password, validates it against a schema,
 * and returns the password data if valid, otherwise throws an error.
 *
 * @param req - The incoming request object that contains the body data (old and new password).
 * @param schema - The Joi schema object used to validate the password data.
 * @returns - Returns the valid password data as PasswordDataDTO.
 */
export const extractChangePasswordData = (
  req: Request,
  schema: Joi.ObjectSchema
): PasswordDataDTO => {
  const { newPassword, currentPassword } = req.body;
  const { error, value } = validatePassword(
    { newPassword, currentPassword },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as PasswordDataDTO;
};
