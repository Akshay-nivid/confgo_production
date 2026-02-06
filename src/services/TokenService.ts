/**
 * @class TokenService
 * @description Service class for handling Token operations.
 * @author nihal
 */

import { Transaction } from 'sequelize';
import { Token } from '../models/Token';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { MailVars, sendEmail } from '../helper/emailHelper';
import { v1 as uuidv1 } from 'uuid';
import {
  CreateOtpTokenDTO,
  CreateTokenDTO,
  OtpValidationDTO,
  StatusValidationDTO,
  TokenValidationDTO,
} from '../dtos/token/TokenDTO';
import { enumStatus, enumTokenStatus, enumTokenType } from '../utils/enum';
import { User } from '../models/User';
import { TokenStatus } from '../models/TokenStatus';
import { Op } from 'sequelize';
import { NotificationSetting } from '../models/NotificationSetting';
import { Notification } from '../models/Notification';
import { EmailConfig } from '../models/EmailConfig';
import { UserAuth } from '../models/UserAuth';

/**
 * @class TokenService
 * @description Service class for handling CRUD operations related to the Token model.
 */
export class TokenService {
  private tokenBaseService: BaseService<Token>;
  private userBaseService: BaseService<User>;
  private tokenStatusBaseService: BaseService<TokenStatus>;
  private notificationSettingBaseService: BaseService<NotificationSetting>
  private notificationBaseService: BaseService<Notification>;
  private emailConfigBaseService: BaseService<EmailConfig>;
  private authBaseService: BaseService<UserAuth>;
  
  constructor() {
    // Cast the Token model explicitly to match the expected constructor signature
    this.tokenBaseService = new BaseService(
      Token as unknown as { new (): Token } & typeof Token
    );

    this.userBaseService = new BaseService(
      User as unknown as { new (): User } & typeof User
    );

    // Cast the TokenStatus model explicitly to match the expected constructor signature
    this.tokenStatusBaseService = new BaseService(
      TokenStatus as unknown as { new (): TokenStatus } & typeof TokenStatus
    );

    this.notificationSettingBaseService = new BaseService(
      NotificationSetting as unknown as { new (): NotificationSetting } & typeof NotificationSetting
    );

    this.notificationBaseService= new BaseService(
      Notification as unknown as { new (): Notification } & typeof Notification
    );
    this.emailConfigBaseService = new BaseService(
          EmailConfig as unknown as {
            new (): EmailConfig;
          } & typeof EmailConfig
        );
    this.authBaseService = new BaseService(
      UserAuth as unknown as { new (): UserAuth } & typeof UserAuth
    );
  }

  /**
   * Creates a new token.
   * @param tokenData - The data to create the token.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created token.
   */
  async createToken(
    tokenData: CreateTokenDTO,
    transaction?: Transaction
  ): Promise<Token> {
    try {
      // Retrieve the user by their userId from the token data
      const userData = await this.userBaseService.findById(
        tokenData.userId,
        {
          where: {
            email: tokenData.email,
          },
        },
        transaction
      );
      // Check if user exists
      if (!userData) {
        const errorMessage = `user ID ${tokenData.userId} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      const tData = this.generateToken();
      const tokenStatus = await this.getTokenStatus(enumStatus.ACTIVE);
      if (!tokenStatus) {
        const errorMessage = `Token Status ${enumStatus.ACTIVE} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      const request = {
        token: tData.uid,
        expiryTime: tData.expiryTime,
        type: tokenData.type,
        email: tokenData.email,
        userId: tokenData.userId,
        statusId: tokenStatus.dataValues.id,
        createdBy: userData.dataValues.id,
        modifiedBy: userData.dataValues.id,
      };
      // Create Token
      const newToken = await this.tokenBaseService.create(request, transaction);
      Logger.info('Token created successfully:', newToken);
      return newToken;
    } catch (error) {
      Logger.error('Error creating token:', error);
      throw error;
    }
  }

  /**
   * Function to generate only a token.
   * @returns An object containing uid and expiryTime.
   */
  private generateToken(): { uid: string; expiryTime: Date } {
    // Generate a unique token ID
    const uid = uuidv1();

    // Set the expiry time for the token (10 minutes from now)
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours()  + 24);

    return {
      uid,
      expiryTime,
    };
  }

  /**
   * Function to generate both token and OTP.
   * @returns An object containing otp, uid, and expiryTime.
   */
  private generateOtp(): { otp: number; uid: string; expiryTime: Date } {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Generate a unique token ID
    const uid = uuidv1();

    // Set the expiry time for the token (10 minutes from now)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);

    return {
      otp,
      uid,
      expiryTime,
    };
  }

  /**
   * Creates a new token and OTP.
   * @param tokenData - The data to create the token.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created token.
   */
  async createOtpToken(
    tokenData: CreateOtpTokenDTO,
    transaction?: Transaction
  ): Promise<Token> {
    try {
      const tokenUpdateStatus = await this.getTokenStatus(enumStatus.EXPIRED);
      if (!tokenUpdateStatus) {
        const errorMessage = `Token Status ${enumStatus.EXPIRED} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      const userData = await this.userBaseService.findOne(
        {
          where: { phone: tokenData.phone },
        },
        transaction
      );

      if (!userData) {
        const errorMessage = `Phone number ${tokenData.phone} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Find all records with the same userId and type
      const result = await this.tokenBaseService.findAll(
        {
          where: {
            phone: tokenData.phone,
            type: tokenData.type,
          },
        },
        transaction
      );

      if (result.length > 0) {
        // Update all matching records' status to EXPIRED
        const updateData = { statusId: tokenUpdateStatus.dataValues.id };
        const whereOption = {
          phone: tokenData.phone,
          type: tokenData.type,
        };
        await this.tokenBaseService.updateCustom(
          updateData,
          whereOption,
          undefined,
          transaction
        );
      }

      // Generate OTP and Token
      const tData = this.generateOtp();

      const template = await this.notificationSettingBaseService.findOne({ where: { actionName: 'OTP_SENDING' } });
      if(template){
        const notificationReq = {
          templateId: template?.dataValues.id,
          userId: userData.dataValues.id,
          recipient: userData.dataValues.email,
          metadata: JSON.stringify({
            contactName: userData.dataValues.firstName,
            otp: tData.otp,
            expiryTime: tData.expiryTime.toISOString().replace('T', ' ').split('.')[0],
            email: userData.dataValues.email,
          }),
          sendStatus: 1,
          instantNotification: 1,
          createdBy: userData.dataValues.id || 0,
          modifiedBy: 0,
        };
        await this.notificationBaseService.create(notificationReq, transaction);

         // Send an quick email notification for user registration
         await this.sendEmailNotification(
          {
            actionName: 'OTP_SENDING',
            toAddress: userData.dataValues.email,
            mailVars:{
              year:new Date().getFullYear().toString(),
              contactName: userData.dataValues.firstName,
              otp: tData.otp.toString(),
              expiryTime: tData.expiryTime.toISOString().replace('T', ' ').split('.')[0],
              email: userData.dataValues.email,
            },
          },
          transaction
        );
      }

      const tokenStatus = await this.getTokenStatus(enumStatus.ACTIVE);
      if (!tokenStatus) {
        const errorMessage = `Token Status ${enumStatus.ACTIVE} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      // Prepare request object with fetched data
      const request = {
        token: tData.uid,
        expiryTime: tData.expiryTime,
        otp: tData.otp,
        type: tokenData.type,
        userId: userData?.dataValues.id,
        phone: tokenData.phone,
        statusId: tokenStatus.dataValues.id,
        createdBy: userData.dataValues.id,
        modifiedBy: userData.dataValues.id,
      };

      // Create Token in the database
      const newToken = await this.tokenBaseService.create(request, transaction);

      Logger.info('Token created successfully:', newToken);
      return newToken;
    } catch (error) {
      Logger.error('Error creating token:', error);
      throw error; // Re-throw error for handling at a higher level
    }
  }

  /**
   * Send quick email OTP notification for users
   * @param actionName
   * @param mailVars 
   * @param transaction 
   * @returns 
   */
   async sendEmailNotification(
      {
        actionName,
        toAddress,
        cc,
        mailVars,
        attachments,
      }: {
        actionName: string;
        cc?: string;
        toAddress: string;
        mailVars?: MailVars;
        attachments?: Array<{
          filename: string;
          content: Buffer;
          path?: string;
          contentType?: string;
        }>;
        message?: string; // Optional parameter
      },
      transaction?: Transaction
    ): Promise<boolean> {
      
      //action name fetching
      const actionData = await this.notificationSettingBaseService.findOne({
        where: { actionName: actionName },
        transaction,
      });
      if (
        actionData === null ||
        !actionData.dataValues ||
        actionData.dataValues.isEnabled === 0 ||
        actionData.dataValues.email === 0
      ) {
        return false;
      }
      //email config settings
      const emailConfigData = await this.emailConfigBaseService.findOne({
        where: { configName: actionName },
        transaction,
      });

  
      if (!emailConfigData || !emailConfigData.dataValues.enabled) {
        return false;
      }
      //send email
      await sendEmail({
        subject: emailConfigData.dataValues.subject,
        templateMail: emailConfigData.dataValues.template,
        to: toAddress,
        cc: cc,
        mailVars: mailVars,
        attachments,
      });
  
      return true;
    }

  /**
   * Get Token Status
   * @param statusName
   * @returns
   */
  async getTokenStatus(
    statusName: string,
    transaction?: Transaction
  ): Promise<TokenStatus | null> {
    try {
      return this.tokenStatusBaseService.findOne(
        {
          where: { statusName: statusName },
        },
        transaction
      );
    } catch (error) {
      Logger.error('Error getTokenStatus:', error);
      throw error;
    }
  }
  /**
   * Token validation
   * @param data   An object containing the token details for validation.
   * @returns  Return true if success either return false
   *
   */
  async tokenValidation(data: TokenValidationDTO): Promise<boolean> {
    try {
      const currentDate = new Date();

      const userData = await this.userBaseService.findById(data.userId);
      if (!userData) {
        const errorMessage = `User ID ${data.userId} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (
        data.type === enumTokenType.COMPANY_REGISTRATION ||
        data.type === enumTokenType.USER_REGISTRATION
      ) {
        // checking the user already set the password
        const auth = await this.authBaseService.findOne({
          where: { userId: userData.dataValues.id },
        });
        if (auth?.dataValues.password) {
          const errorMessage = `Password already set. Use 'Forgot Password' to change it.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
      }
      
      // Find the token where expiryTime is greater than or equal to the current date
      const result = await this.tokenBaseService.findOne({
        where: {
          token: data.token,
          userId: data.userId,
          type: data.type,
          [Op.or]: [
            { email: userData.dataValues.email },
            { phone: userData.dataValues.phone },
          ],
          expiryTime: { [Op.gte]: currentDate },
          statusId: enumTokenStatus.ACTIVE,
        },
      });
      // If no token found or expired,
      if (!result) {
        Logger.info('Token not found or has expired.');
        return false;
      }
      // If token is valid
      return true;
    } catch (error) {
      Logger.error('Error tokenValidation', error);
      return false;
    }
  }

  /**
     * Method to check token existence and its status is not expired and update statusId to Expired.
     * @param token The token string that needs to be validated and potentially expired.
     * @returns Retun true or false

     */
  async expireToken(token: string): Promise<boolean> {
    try {
      // Check if the token exists
      const result = await this.tokenBaseService.findOne({
        where: {
          token: token,
        },
      });

      // If no token found
      if (!result) {
        return false;
      }

      // Get the ID of the "Expired" status from the TokenStatus table
      const expiredStatus = await this.getTokenStatus(enumStatus.EXPIRED);

      if (!expiredStatus) {
        Logger.info(
          'expireToken: Expired status not found in tokenStatus table.'
        );
        return false;
      }

      // Update the token's statusId to the ID of "Expired"
      await this.tokenBaseService.update(
        result.dataValues.id, // Use the token ID
        { statusId: expiredStatus.id } // Set the statusId to the id of "Expired"
      );

      return true;
    } catch (error) {
      Logger.error('Error expireToken', error);
      return false;
    }
  }

  /**
   * Validates the OTP and updates the token status if valid and not expired.
   *
   * @param data - The OTP validation DTO, containing:
   *  - token: the token sent to the user
   *  - otp: the one-time password (OTP) provided by the user
   *  - userId: the user's ID
   *  - email: the user's email
   * @returns {Promise<boolean>} - Returns `true` if OTP is valid and status is updated to expired; otherwise, returns `false`.
   */
  async OtpValidation(data: OtpValidationDTO): Promise<boolean> {
    try {
      const currentDate = new Date();

      // Find the otp where expiryTime is greater than or equal to the current date
      const result = await this.tokenBaseService.findOne({
        where: {
          token: data.token,
          otp: data.otp,
          type: data.type,
          userId: data.userId,
          expiryTime: { [Op.gte]: currentDate },
          statusId: enumTokenStatus.ACTIVE,
        },
      });
      // If no otp found or expired,
      if (!result) {
        Logger.info('Otp not found or has expired.');
        return false;
      }
      // Get the ID of the "Expired" status from the TokenStatus table
      const expiredStatus = await this.getTokenStatus('EXPIRED');

      if (!expiredStatus) {
        Logger.info(
          'expireOtp: Expired status not found in tokenStatus table.'
        );
        return false;
      }

      // Update the token's statusId to the ID of "Expired"
      await this.tokenBaseService.update(
        result.dataValues.id, // Use the token ID
        { statusId: expiredStatus.id } // Set the statusId to the id of "Expired"
      );
      // If token is valid
      return true;
    } catch (error) {
      Logger.error('Error OtpValidation:', error);
      return false;
    }
  }

  /**
   * Gets all status.
   * @returns A promise that resolves to a list of status.
   */
  async getTokenStatusList(
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: TokenStatus[]; count: number }> {
    try {
      const { count, rows } = await this.tokenStatusBaseService.findAndCountAll(
        {
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        }
      );
      return { rows, count };
    } catch (error) {
      Logger.error('Error getTokenStatusList:', error);
      throw error;
    }
  }
  /**
   * Retrieves a token status by its name.
   * @param data - The validation data containing the status name to search for.
   * @returns  A promise that resolves to a TokenStatus object if found, or null if not found.
   */
  async getTokenStatusByName(
    data: StatusValidationDTO
  ): Promise<TokenStatus | null> {
    try {
      return await this.tokenStatusBaseService.findOne({
        where: { statusName: data.name },
      });
    } catch (error) {
      Logger.error('Error getTokenStatusByName:', error);
      throw error;
    }
  }

  /**
   * Inactivates an existing token for a given user and type.
   *
   * @param {number} userId - The unique identifier of the user whose token needs to be inactivated.
   * @param {string} type - The type of token to be inactivated (e.g., "ACCESS_TOKEN", "REFRESH_TOKEN").
   * @returns {Promise<boolean>} - Returns `true` if the token was successfully inactivated, `false` if no token was found.
   *
   * @throws {Error} - Throws an error if any issue occurs during the token retrieval or update process.
   */
  async inactiveExistingToken(userId: number, type: string): Promise<boolean> {
    try {
      // Fetch the existing token for the given user and token type
      const existingToken = await this.tokenBaseService.findOne({
        where: { userId, type },
      });

      // If no token exists, return false
      if (!existingToken) {
        return false;
      }

      // Update the token status to INACTIVE
      await this.tokenBaseService.update(existingToken.id, {
        statusId: enumTokenStatus.INACTIVE,
      });

      // Return true to indicate the token was successfully inactivated
      return true;
    } catch (error) {
      // Log and rethrow the error for higher-level handling
      Logger.error('Error inactivating existing token:', error);
      throw error;
    }
  }
}
