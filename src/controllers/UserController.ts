/**
 * @class UserController
 * @description Controller class for handling HTTP requests related to User operations.
 *
 * @author : sarathavs
 */

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import {
  assignVolunteerSchema,
  changePasswordSchema,
  checkUserRegistrationSchema,
  createUserSchema,
  forgotPasswordSchema,
  retrieveUserSchema,
  updateUserPhoneSchema,
  updateUserSchema,
  userPasswordSchema,
} from '../validators/userValidator';
import { handleError } from '../utils/error_util';
import {
  extractUpdateUserData,
  extractUserData,
  extractPassword,
  extractUserDetailData,
  extractupdateUserPhoneData,
  extractforgetpasswordData,
  extractPhoneAndEmail,
  extractUserEventData,
  extractAssignVolunteerData,
  extractChangePasswordData,
} from '../handlers/user/userRequestHandler';
import {
  assignEventVolunteerResponse,
  createForgotPasswordResponse,
  createUserResponse,
  getUserResponse,
  updatePasswordResponse,
  updateUserResponse,
  UserResponseDTO,
} from '../dtos/user/UserDTO';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { User } from '../models/User';
import { JwtPayload } from 'jsonwebtoken';
import { Logger } from '../utils/logger';
import { TokenService } from '../services/TokenService';
import { enumRoll, enumStatus, enumTokenType } from '../utils/enum';
import { Transaction } from 'sequelize';
import { sequelize } from '../models';
import { RoleService } from '../services/RoleService';
import { NotificationService } from '../services/NotificationService';
import { NotificationCreateDTO } from '../dtos/notification/NotificationDTO';
import { Next } from 'mysql2/typings/mysql/lib/parsers/typeCast';
export class UserController {
  private userService = new UserService();
  private tokenService = new TokenService();
  private roleService = new RoleService();
  private notificationService = new NotificationService();

  /**
   * Handles the request to get all users.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract list-related parameters from the request body
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Apply base filters (e.g., only active users)
      const baseFilter = { status: 'ACTIVE' };

      // Combine base filters with provided filters
      const finalFilters = { ...baseFilter, ...filters };

      // Fetch users with applied filters, pagination, limit, and sorting
      const { rows: users, count: total } = await this.userService.getAllUsers(
        finalFilters,
        limit,
        offset,
        sortBy,
        sortDirection
      );

      // Optionally filter the response fields
      const filteredUsers = users.map((user: User) =>
        this.filterUserFields(user)
      );

      // Create the paginated response using the utility function
      const response = createPaginatedResponse(
        filteredUsers,
        total,
        limit,
        offset
      );

      // Send the paginated response
      res.status(200).json(response);
    } catch (error) {
      handleError(next, error);
    }
  }

  /**
   * Filters the user fields based on the requested fields.
   * @param user - The user object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered user object.
   */
  private filterUserFields(user: User) {
    return user;
  }

  /**
   * Handles the request to get a user by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const user = await this.userService.getUserById(Number(userId));
      if (user) {
        const response = getUserResponse(user as UserResponseDTO); // Convert to DTO for consistent response
        res.status(200).json(response);
      } else {
        res.status(404).json({ status: 'error', message: 'User not found' });
      }
    } catch (error) {
      handleError(next, error);
    }
  }

  /**
   * Retrieves user details by their ID and validates the provided token.
   * If the user is found and the token is valid, it returns the user data.
   * Otherwise, it sends an appropriate error response.
   *
   * @param req - Express request object containing the userId and token in the body
   * @param res - Express response object used to send the result back to the client
   * @param next - Express next function to pass errors to the error handler
   */
  async retrieveUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = extractUserDetailData(req, retrieveUserSchema);

      const tokenData = await this.tokenService.tokenValidation({
        token: userData.token,
        userId: userData.userId,
        type: userData.type,
      });
      if (!tokenData) {
        res.status(404).json({ status: 'error', message: 'Invalid token' });
      }

      const user = await this.userService.getUserById(userData.userId);
      if (user) {
        const response = getUserResponse(user as UserResponseDTO); // Convert to DTO for consistent response
        res.status(200).json(response);
      } else {
        res.status(404).json({ status: 'error', message: 'User not found' });
      }
    } catch (error) {
      handleError(next, error);
    }
  }

  /**
   * Handles the request to create a new user.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createUser(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    let roleData;
    try {
      const userData = extractUserData(req, createUserSchema);

      // get the roll details
      if (!userData.roleId) {
        roleData = await this.roleService.getRoleByName(enumRoll.USER);
      }
      else {
        roleData = await this.roleService.getRoleById(userData.roleId);
      }
      if (!roleData) {
        throw new Error('User creation failed. Could not find role.');
      }
      //creating new user
      const newUser = await this.userService.createUser(userData,roleData.dataValues.roleName, transaction,);

      // Prepare the user role payload
      const userRolePayoad = {
        userId: newUser.dataValues.id,
        roleId: roleData.dataValues.id,
      };
      this.userService.createUserRoll(userRolePayoad, transaction);

      const tokenReq = {
        type: enumTokenType.USER_REGISTRATION,
        userId: newUser.dataValues.id,
        phone: userData.phone ?? '',
        email: userData.email,
        
      };
      const tokenData = await this.tokenService.createToken(
        tokenReq,
        transaction
      );
      //Assign to company
      if(userData.companyId){
      const companyUserPayoad = {
        userId: newUser.dataValues.id,
        companyId: userData.companyId,
        createdBy: newUser.dataValues.id,
        modifiedBy: newUser.dataValues.id,
      };
      // Create the association between the user and the company in the database
      await this.userService.createCompanyUser(companyUserPayoad, transaction);
      }
      if(userData.roleId){
      //Role message
      const roleMessages:any = {
          REVIEWER: "You have been selected to serve as a reviewer for the company event.",
          SPEAKER: "You have been invited to join the company event as a speaker and contributor.",
          VOLUNTEER: "We’re excited to have you join as a volunteer for the  event."
      };
      //sending email for user registration
      const actionData =
        await this.notificationService.getNotificationSettingByActionName(
          'USER_REGISTRATION',
          transaction
        );
      if (actionData) {
        const metaDetails = {
          year:new Date().getFullYear().toString(),
          contactName: newUser.dataValues.firstName,
          userName: newUser.dataValues.email,
          token: tokenData.dataValues.token,
          userId: Buffer.from(newUser.dataValues.id.toString()).toString(
            'base64'
          ),
          roleName:roleData.dataValues.roleName.toLowerCase(),
          roleMessage:roleMessages[roleData.dataValues.roleName],
          email: newUser.dataValues.email,
        };
        //notification create request
        const req: NotificationCreateDTO = {
          userId: newUser.dataValues.id,
          templateId: actionData?.dataValues.id,
          metadata: JSON.stringify(metaDetails),
          recipient: newUser.dataValues.email,
          sendStatus: 1,
          createdBy: newUser.dataValues.id,
          modifiedBy: newUser.dataValues.id,
        };
        //Add email send entry to notification
        await this.notificationService.createNotification(
          newUser.dataValues.id,
          req,
          transaction
        );
         // Send an quick email notification for user registration
        this.notificationService.sendEmailNotification(
          {
            actionName: 'USER_REGISTRATION',
            toAddress: newUser.dataValues.email,
            mailVars:metaDetails,
          },
          transaction
        );
        
      }
      }
      transaction.commit();
      const response = createUserResponse(newUser, tokenData);
      res.status(201).json(response);
    } catch (err) {
      transaction.rollback();
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Handles the request to update an existing user by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = extractUpdateUserData(req, updateUserSchema);
      const userId = (req.user as JwtPayload)?.id;

      const [updatedCount] = await this.userService.updateUser(
        Number(userId),
        userData
      );

      if (updatedCount > 0) {
        const updatedUser = await this.userService.getUserOrThrow(
          Number(userId)
        );

        const response = updateUserResponse(updatedUser as UserResponseDTO);

        res.status(200).json(response);
      } else {
        res.status(422).json({ message: 'No changes applied to the user' });
      }
    } catch (err) {
      handleError(next, err);
    }
  }

  /**
   * Handles the request to delete a user by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.userService.deleteUser(Number(req.params.id));

      if (deleted) {
        res.status(204).send(); // 204 No Content response
      } else {
        res.status(404).json({ status: 'error', message: 'User not found' });
      }
    } catch (err) {
      handleError(next, err);
    }
  }

  /**
   * Handle the request to set the password
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async setPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = extractPassword(req, userPasswordSchema);
      const { userId, token, type } = data;
      //Validating the token
      const tokenValidationResult = await this.tokenService.tokenValidation({
        token,
        userId,
        type,
      });
      if (!tokenValidationResult) {
        Logger.info('Password not updated because of token invalid or expired');
        throw Error('Password not updated because of token invalid or expired');
      }

      await this.userService.updatePassword(Number(userId), data);

      //After updating the password updating the statusId in token as expired
      const tokenExpirationResult = await this.tokenService.expireToken(token);
      if (!tokenExpirationResult) {
        Logger.info('Failed to expire the token:');
        throw Error('Failed to expire the token while setting up the password');
      }
      const response = updatePasswordResponse();
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Setting password failed', err);
      handleError(next, err);
    }
  }

  /**
   * Updates the phone number for the authenticated user.
   *
   * Flow:
   * 1. Extract and validate the phone number and OTP from the request.
   * 2. Validate the OTP to ensure the provided phone number is authentic.
   * 3. If the OTP validation is successful, update the user's phone number and mark it as verified.
   * 4. If the update is successful, return the updated user information.
   * 5. If the update fails, return an error response.
   *
   * @param {Request} req - The Express request object, which includes user data and OTP.
   * @param {Response} res - The Express response object used to send the result.
   * @param {NextFunction} next - The next middleware function in the Express stack.
   */
  async updateUserPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const userData = extractupdateUserPhoneData(req, updateUserPhoneSchema);
      const { phone, ...otpValidateData } = userData;

      const otpResult = await this.tokenService.OtpValidation(otpValidateData);

      if (!otpResult) {
        throw new Error('Otp validation failed');
      }

      const userUpdateData = {
        phone,
        phoneVerified: 1,
      };

      const [updatedCount] = await this.userService.updateUser(
        Number(userId),
        userUpdateData
      );

      if (updatedCount > 0) {
        const updatedUser = await this.userService.getUserOrThrow(
          Number(userId)
        );

        const response = updateUserResponse(updatedUser as UserResponseDTO);

        res.status(200).json(response);
      } else {
        res.status(500).json({ message: 'Failed to update user' });
      }
    } catch (err) {
      handleError(next, err);
    }
  }

  /**
   * Handles the forgot password process for both company and regular users.
   *
   * Steps:
   * 1. Extracts and validates the username from the request.
   * 2. Fetches user details based on the username.
   * 3. If the user is a company, generates a reset token and sends an email.
   * 4. If the user is a regular user, generates an OTP token (SMS sending is TODO).
   * 5. Commits the transaction on success, or rolls back on error.
   *
   * @param {Request} req - The request containing forgot password data.
   * @param {Response} res - The response sent back to the client.
   * @param {NextFunction} next - Middleware for error handling.
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const { username } = extractforgetpasswordData(req, forgotPasswordSchema);

      const userResp =
        await this.userService.getUserDetailFromUsername(username);
        //check whether user is ACTIVE or INACTIVE
        const userStatus=await this.userService.getUserStatus(enumStatus.INACTIVE);
        if(userStatus && (userResp?.user.statusId==userStatus.dataValues.id && userResp?.userRole.roleName != enumRoll.COMPANYADMIN  ))
        {
          throw new Error('Forgot password is blocked for inactive users.');
        }
      if (userResp?.userRole.roleName === enumRoll.COMPANYADMIN) {
        // Create the Token for email
        const tokenReq = {
          type: enumTokenType.FORGOT_PASSWORD_OTP,
          userId: userResp.user.id,
          email: userResp.user.email,
        };
        const tokenData = await this.tokenService.createToken(
          tokenReq,
          transaction
        );

        // Send an email notification for company forgot password
        const actionData =
          await this.notificationService.getNotificationSettingByActionName(
            'COMPANY_FORGOT_PASSWORD',
            transaction
          );
        if (actionData) {
          const metaDetails = {
            year:new Date().getFullYear().toString(),
            CONTACTNAME: userResp.user.firstName,
            TOKEN: tokenData.dataValues.token,
            USERID: Buffer.from(userResp.user.id.toString()).toString('base64'),
            email: userResp.user.email,
          };
          //notification create request
          const req: NotificationCreateDTO = {
            userId: userResp.user.id,
            templateId: actionData?.dataValues.id,
            metadata: JSON.stringify(metaDetails),
            recipient: userResp.user.email,
            sendStatus: 0,
            createdBy: userResp.user.id,
            modifiedBy: userResp.user.id,
          };
          //Add email send entry to notification
          await this.notificationService.createNotification(
            userResp.user.id,
            req,
            transaction
          );
        }

        const response = createForgotPasswordResponse(
          userResp.user,
          userResp.userRole,
          undefined
        );

        transaction.commit();

        res.status(200).json(response);
      } else if (userResp?.userRole.roleName === enumRoll.VOLUNTEER || userResp?.userRole.roleName === enumRoll.REVIEWER || userResp?.userRole.roleName === enumRoll.SPEAKER || userResp?.userRole.roleName === enumRoll.USER) {
        
        // Changing existing token status.
        const existingToken = await this.tokenService.inactiveExistingToken(
          userResp.user.id,
          enumTokenType.FORGOT_PASSWORD_OTP
        );

        // Create the otp
        const tokenReq = {
          type: enumTokenType.FORGOT_PASSWORD_OTP,
          phone: userResp.user.phone || '',
        };
        const tokenData = await this.tokenService.createOtpToken(
          tokenReq,
          transaction
        );

          // Send an email notification for user forgot password
        //   const actionData =
        //   await this.notificationService.getNotificationSettingByActionName(
        //     'USER_FORGOT_PASSWORD',
        //     transaction
        //   );
        // if (actionData) {
        //   const metaDetails = {
        //     CONTACTNAME: userResp.user.firstName,
        //     TOKEN: tokenData.dataValues.token,
        //     USERID: Buffer.from(userResp.user.id.toString()).toString('base64'),
        //     email: userResp.user.email,
        //   };
        //   //notification create request
        //   const req: NotificationCreateDTO = {
        //     userId: userResp.user.id,
        //     templateId: actionData?.dataValues.id,
        //     metadata: JSON.stringify(metaDetails),
        //     recipient: userResp.user.email,
        //     sendStatus: 0,
        //     createdBy: userResp.user.id,
        //     modifiedBy: userResp.user.id,
        //   };
        //   //Add email send entry to notification
        //   await this.notificationService.createNotification(
        //     userResp.user.id,
        //     req,
        //     transaction
        //   );
        // }

        // TODO send OTP SMS after otp creation

        const response = createForgotPasswordResponse(
          userResp.user,
          userResp.userRole,
          tokenData
        );
        transaction.commit();

        res.status(200).json(response);
      }
    } catch (err) {
      transaction.rollback();
      handleError(next, err);
    }
  }
  /**
   * controller to check if the provided phone number and/or email already exist in the database.
   * Returns a response indicating whether the phone number and/or email exists.
   * @param {Request} req - The request object, containing the user's phone number and email.
   * @param {Response} res - The response object used to send the validation result.
   * @param {NextFunction} next - The next middleware function to call in case of an error.
   * @returns {void} - sends a JSON response with data including flags for phoneExists and emailExists.
   */
  async checkUserRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const data = extractPhoneAndEmail(req, checkUserRegistrationSchema);
      const { phoneExists, emailExists } =
        await this.userService.checkUserRegistration(data.phone, data.email);
      const response = {
        status: 'success',
        message:
          phoneExists || emailExists
            ? 'Account already exists. Please login or use different details.'
            : 'No account found with this information. Please register.',
        data: { phoneExists, emailExists },
      };
      res.status(200).json(response);
    } catch (error) {
      handleError(next, error);
    }
  }

    /**
   * Handles the request to get all users.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
    async getAllUserWithRoles(req: Request, res: Response, next: NextFunction) {
      try {
        const { id: userId, userRole } = req.user as JwtPayload;
        // Extract list-related parameters from the request body
        const { filters, limit, offset, sortBy, sortDirection } =
          extractListRequestData(req);
  
        // Fetch user roles with applied filters, pagination, limit, and sorting
        const { rows: users, count: total } = await this.userService.getAllUserWithRoles(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection,
          userId,
          userRole,
        );
        // Create the paginated response using the utility function
        const response = createPaginatedResponse(
          users,
          total,
          limit,
          offset
        );
  
        // Send the paginated response
        res.status(200).json(response);
      } catch (error) {
        handleError(next, error);
      }
    }
   /**
   * Assign Event to user.
   * @param req -containing event program data.
   * @param res -object used to send the response back .
   * @param next -The next middleware function in the stack, used for error handling.
   */
  async assignEventToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const programData = extractAssignVolunteerData(
        req,
        assignVolunteerSchema
      );

      const event =await this.userService.assignEventToUsers(programData);
      const response = assignEventVolunteerResponse(event);
      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error assign event to volunteer:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
  * Handles the request to get all event assigned volunteer.
  * @param req - Express request object.
  * @param res - Express response object.
  * @param next - Express next middleware function.
  */
  async getAllVolunteerEvents(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract list-related parameters from the request body
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Combine base filters with provided filters
      const finalFilters = { ...filters };

      // Fetch user roles with applied filters, pagination, limit, and sorting
      const { rows: users, count: total } = await this.userService.getAllVolunteerEvents(
        finalFilters,
        limit,
        offset,
        sortBy,
        sortDirection
      );
      // Create the paginated response using the utility function
      const response = createPaginatedResponse(
        users,
        total,
        limit,
        offset
      );

      // Send the paginated response
      res.status(200).json(response);
    } catch (error) {
      handleError(next, error);
    }
  }
  /**
  * Handles the request to delete a assigned event from volunteer user by ID.
  * @param req - Express request object.
  * @param res - Express response object.
  * @param next - Express next middleware function.
  */
  async deleteVolunteerEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await this.userService.deleteVolunteerEvent(Number(req.params.id));

      if (deleted) {
        const response = {
          status: 'success',
          data: null,
          message: 'Assigned Event Volunteer deleted.',
        };
        res.status(200).json(response);
      } else {
        res
          .status(404)
          .json({ status: 'error', message: 'Assigned Event Volunteer not found' });
      }
    } catch (err) {
      handleError(next, err);
    }
  }

  /**
   * Controller for COMPANYADMIN role to edit other users(speaker, reviewer...) details.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async adminUpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = (req.user as JwtPayload)?.userRole;
      // Check if the user is authorized to perform the update operation
      if (userRole !== enumRoll.COMPANYADMIN) {
        throw new Error(
          "Access Denied: You don't have permission to perform this action."
        );
      }
      const userData = extractUpdateUserData(req, updateUserSchema);
      const userId = req.params.id;

      await this.userService.updateUser(Number(userId), userData);

      const updatedUser = await this.userService.getUserOrThrow(Number(userId));

      const response = updateUserResponse(updatedUser as UserResponseDTO);

      res.status(200).json(response);
    } catch (err) {
      Logger.error("Error adminUpdateUser:",err)
      handleError(next, err);
    }
  }

  /**
   * Changes the user's password after validating the provided password data.
   *
   * @param req - The request object that contains user data and password details.
   * @param res - The response object used to send the response back to the client.
   * @param next - The NextFunction used to pass control to the next middleware in case of an error.
   */
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;

      // Extract the password data (old and new password) from the request body and validate it against the schema.
      const passwordData = extractChangePasswordData(req, changePasswordSchema);

      // Call the service layer to change the password, passing the validated password data and userId.
      const changePassword = await this.userService.changePassword(
        passwordData,
        userId
      );

      // If password change is successful, send a success response.
      if (changePassword) {
        const response = {
          status: 'success',
          data: null,
          message: 'Password Changed Successfully.',
        };
        res.status(200).json(response);
      } else {
        // If password change failed (i.e., if changePassword returns false), send an error response.
        res.status(404).json({
          status: 'error',
          message: 'Password change Failed, try again',
        });
      }
    } catch (err) {
      // Log any errors that occur during the password change process for debugging purposes.
      Logger.error('Error in changePassword:', err);
      handleError(next, err);
    }
  }
}
