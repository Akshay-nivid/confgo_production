import { sequelize } from './../models/index';
import { CompanyService } from '../services/CompanyService';
import { handleError } from '../utils/error_util';
import {
  extractUpdateCompanyData,
  extractCreateCompanyData,
} from '../handlers/company/companyRequestHandler';
import { Request, Response, NextFunction } from 'express';
import {
  createCompanySchema,
  updateCompanySchema,
} from '../validators/companyValidator';
import {
  CompanyDetailsResponse,
  createCompanyResponse,
  updateCompanyResponse,
} from '../dtos/company/CompanyDTO';
import { CompanyStatus } from '../models/init-models';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { UserService } from '../services/UserService';
import { PlanService } from '../services/PlanService';
import { TokenService } from '../services/TokenService';
import { NotificationService } from '../services/NotificationService';
import { enumRoll, enumTokenType } from '../utils/enum';
import { SubscriptionService } from '../services/SubscriptionService';
import { calculateEndDate } from '../utils/date_util';
import { Transaction } from 'sequelize';
import { RoleService } from '../services/RoleService';
import { JwtPayload } from 'jsonwebtoken';
import { NotificationCreateDTO } from '../dtos/notification/NotificationDTO';

/**
 * @author saneeshiv
 * @class CompanyController
 * @description
 */

export class CompanyController {
  private companyService = new CompanyService();
  private userService = new UserService();
  private planService = new PlanService();
  private tokenService = new TokenService();
  private subscriptionService = new SubscriptionService();
  private notificationService = new NotificationService();
  private roleService = new RoleService();

  /**
   * Handles the request to create a new company.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createCompany(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const companyData = extractCreateCompanyData(req, createCompanySchema);

      const newCompany = await this.companyService.createCompany(
        companyData,
        transaction
      );

      // Prepare the user creation request object
      const userPayload = {
        firstName: companyData.firstName,
        lastName: companyData.lastName,
        email: companyData.email,
        phone: companyData.phone,
        username: companyData.email,
        createdBy: 0,
        modifiedBy: 0,
      };


      // get the roll details
      const roleData = await this.roleService.getRoleByName(enumRoll.COMPANYADMIN);
      if (!roleData) {
        throw new Error('User creation failed. Could not find role.');
      }

      // Create a new user in the database
      const newUser = await this.userService.createUser(
      userPayload,
      roleData.dataValues.roleName,
      transaction,
      );
      
      // Prepare the user role payload
      const userRolePayoad = {
        userId: newUser.dataValues.id,
        roleId: roleData.dataValues.id,
      };
      this.userService.createUserRoll(userRolePayoad, transaction);

      // Prepare the association between the user and the company
      const companyUserPayoad = {
        userId: newUser.dataValues.id,
        companyId: newCompany.dataValues.id,
        createdBy: newUser.dataValues.id,
        modifiedBy: newUser.dataValues.id,
      };
      // Create the association between the user and the company in the database
      await this.userService.createCompanyUser(companyUserPayoad, transaction);

      // Create the Token while registering a company
      const tokenReq = {
        type: enumTokenType.COMPANY_REGISTRATION,
        userId: newUser.dataValues.id,
        email: newUser.email,
      };
      const tokenData = await this.tokenService.createToken(
        tokenReq,
        transaction
      );

      const startDate = new Date(); // Set the subscription start date

      // Validate subscriptionData by checking if the provided planId exists
      const planData = await this.planService.getPlanById(companyData.planId);
      if (!planData) {
        throw new Error('The provided planId does not exist.');
      }

      // Prepare the subscription data for the company
      const subscriptionData = {
        userId: newUser.dataValues.id,
        planId: companyData.planId,
        startDate: startDate,
        endDate: calculateEndDate(startDate, planData.dataValues.validityDay),
        validityDay: planData.dataValues.validityDay,
        isTrial: 0,
        statusId: 0,
        createdBy: newUser.dataValues.id,
      };

      // Call the SubscriptionService to create a subscription for the company
      const newSubscription = await this.subscriptionService.createSubscription(
        subscriptionData,
        transaction
      );

      const actionData =
        await this.notificationService.getNotificationSettingByActionName(
          'COMPANY_REGISTRATION',
          transaction
        );
      if (actionData) {
        const metaDetails = {
          year:new Date().getFullYear().toString(),
          contactName: newUser.dataValues.firstName,
          token: tokenData.dataValues.token,
          userId: Buffer.from(newUser.dataValues.id.toString()).toString(
            'base64'
          ),
          email: newUser.dataValues.email,
        };
        //notification create request
        const req: NotificationCreateDTO = {
          userId: newUser.dataValues.id,
          templateId: actionData?.dataValues.id,
          metadata: JSON.stringify(metaDetails),
          recipient: newUser.dataValues.email,
          sendStatus: 0,
          createdBy: newUser.dataValues.id,
          modifiedBy: newUser.dataValues.id,
        };
        //Add email send entry to notification
        await this.notificationService.createNotification(
          newUser.dataValues.id,
          req,
          transaction
        );
      }
      transaction.commit();
      const response = createCompanyResponse(
        newCompany,
        newUser,
        newSubscription.dataValues.id
      );

      res.status(201).json(response);
    } catch (err) {
      transaction.rollback();
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Updates the company information based on the provided data.
   *
   * This function extracts company data from the request, validates and updates it in the database,
   * and returns the updated company information. If the update is unsuccessful, it returns an error response.
   *
   * @param req - Express request object, containing the `id` of the company to update in `req.params`
   *              and the updated data in the request body.
   * @param res - Express response object used to send back the JSON response.
   * @param next - Express next function, used to pass control to the error handler in case of an error.
   *
   * @returns A JSON response with the updated company data if successful; otherwise, an error message.
   */
  async updateCompany(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const companyId = req.params?.id;

      // Extract and validate company data from request body based on the provided schema.
      const companyData = extractUpdateCompanyData(req, updateCompanySchema);

      // Perform the update operation within the transaction.
      const [updatedCount] = await this.companyService.updateCompany(
        Number(companyId),
        companyData,
        transaction
      );
      transaction.commit();

      // Check if any records were updated.
      if (updatedCount > 0) {
        const updatedCompany = await this.companyService.getCompanyOrThrow(
          Number(companyId)
        );
        const response = updateCompanyResponse(updatedCompany);
        res.status(200).json(response);
      } else {
        res
          .status(500)
          .json({ status: 'error', message: 'Failed to update company' });
      }
    } catch (err) {
      transaction.rollback();
      handleError(next, err);
    }
  }

  /*
   * Handles the request to retrieve company status list.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllCompanyStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      const { rows: compStatus, count: total } =
        await this.companyService.getAllCompanyStatus(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection
        );
      const filteredStatus = compStatus.map((company: CompanyStatus) =>
        this.filterCompanyStatusFields(company)
      );

      const response = createPaginatedResponse(
        filteredStatus,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      handleError(next, error);
    }
  }

  /**
   * Filters the company status fields based on the requested fields.
   * @param status - The company status object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered CompanyStatus object.
   */
  private filterCompanyStatusFields(status: CompanyStatus) {
    return status;
  }

  /**
   * Handles the request to get company details by userId.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getCompanyDetailsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;

      // Fetch the company details related to the user
      const companyResp =
        await this.companyService.getCompanyDetailsByUserId(userId);

      const response = CompanyDetailsResponse(
        companyResp.company,
        companyResp.userData
      );
      res.status(200).json(response);
    } catch (err) {
      // Catch any errors and pass to the error handler middleware
      handleError(next, err);
    }
  }
}
