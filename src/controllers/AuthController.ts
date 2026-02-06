/**
 * @class AuthController
 * @description Controller class for handling HTTP requests related to Auth operations.
 *
 * @author : sarathavs
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import {
  createAuthResponse,
  createRefreshTokenResponse,
  createSsoAuthResponse,
} from '../dtos/auth/AuthDTO';
import { handleError } from '../utils/error_util';
import {
  extractAuthData,
  extractSsoAuthData,
  extractSsoUserData,
} from '../handlers/auth/authRequestHandler';
import { UserService } from '../services/UserService';
import { createSsoUserSchema } from '../validators/authValidator';
import { Transaction } from 'sequelize';
import { sequelize } from '../models';
import { RoleService } from '../services/RoleService';
import { enumRoll, enumStatus } from '../utils/enum';
import { SubscriptionService } from '../services/SubscriptionService';
import { SessionHelper } from '../helper/sessionHelper';
import { CartService } from '../services/CartService';
import { CompanyService } from '../services/CompanyService';

export class AuthController {
  private authService = new AuthService();
  private userService = new UserService();
  private roleService = new RoleService();
  private subscriptionService = new SubscriptionService();
  private cartService = new CartService();
  private companyService = new CompanyService();

  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      // Step 1: Extract and validate authentication data from the request
      const { username, password } = extractAuthData(req);

      // Step 2: Authenticate the user using the AuthService
      const authResp = await this.authService.authenticateUser(
        username,
        password
      );

      // Step 3: Create the response using AuthResponseDTO
      const token = authResp?.token ? `${authResp.token}` : null; // token might be null
      const refreshToken = authResp?.refreshToken ? `${authResp.refreshToken}` : null; // refresh token might be null
      const user = authResp?.user;

      // Step 4: Check if the user has an active subscription
      const activeSubscription =
        await this.subscriptionService.getActiveSubscriptions(user?.id ?? 0);
      const subscriptionStatus =
        activeSubscription.length !== 0
          ? enumStatus.ACTIVE
          : enumStatus.INACTIVE;

      // Checking the user has company
      let company;
      if (user?.userRole.roleName === enumRoll.COMPANYADMIN) {
        company = await this.companyService.getCompanyDetailsByUserId(
          user?.id ?? 0
        );
      }
      //fetching  INACTIVE status id -- checking user with deleted status
      const userStatus = await this.userService.getUserStatus(
        enumStatus.INACTIVE
      );
      if (!userStatus) {
        throw new Error('User status not found');
      }
      //checking whether user is deleted or not
      if (user?.userRole.roleName != enumRoll.COMPANYADMIN && user?.statusId === userStatus.id) {
        throw new Error('Invalid username or password');
      }
      // Step 5: Create the authentication response, ensuring all necessary user fields are included
      const response = createAuthResponse(token, refreshToken, {
        ...user, // keep other properties like id, firstName, etc.
        username: user?.username || null, // default to an empty string if undefined
        lastLogin: user?.lastLogin || null, // default to null if undefined
        userRole: user?.userRole,
        userCart: user?.userCart || null,
        companyId: company?.company.id ?? 0,
        subscriptionStatus: subscriptionStatus,
        acceptedTerms: user?.acceptedTerms ?? 0,
      });

      // If the current user is a regular user, assign guest cart to the user.
      if (user?.userRole.roleName == enumRoll.USER) {
        // Get the current session ID. If it exists, assign guest cart to the user.
        const sessionId = SessionHelper.getSessionId(req);
        if (sessionId) {
          await this.cartService.assignGuestCartToUser(
            user?.id ?? 0,
            sessionId ?? ''
          );
          req.session.destroy(() => { });
        }
      }
      // Step 6: Send the response
      res.status(200).json(response);
    } catch (err: any) {
      // Explicitly check for invalid username or password errors
      if (err.message === 'Invalid username or password') {
        return handleError(next, err, 401);
      }
      // res.status(400).json(err);
      handleError(next, err); // Proper error handling
    }
  }

  /**
   * Handles SSO authentication for a user. If the user exists, it verifies their SSO data
   * and returns the authentication token and user details. If the user does not exist,
   * a new user is created, assigned a role, and authenticated.
   *
   * Flow:
   * 1. Extract the SSO provider and user ID from the request.
   * 2. Check if the user exists in the system using the provider's SSO data.
   * 3. If the user exists, return the authentication token and user details.
   * 4. If the user doesn't exist, create a new user, assign a role, and authenticate them.
   * 5. Verify if the phone number is provided and verified; if not, set the `phoneVerified` flag.
   * 6. Return appropriate response in both cases.
   *
   * @param {Request} req - The Express request object, which includes the SSO data in the body.
   * @param {Response} res - The Express response object used to send the result.
   * @param {NextFunction} next - The next middleware function in the Express stack.
   */
  async ssoAuthenticate(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      // Step 1: Extract the SSO provider and providerUserId from the request body
      const { provider, providerUserId } = extractSsoAuthData(req);

      // Ensure that both provider and providerUserId are provided
      if (!provider || !providerUserId) {
        return res.status(400).json({
          error: 'Provider and providerId are required for SSO authentication.',
        });
      }

      // Step 2: Attempt to authenticate the user with SSO data
      const authResp = await this.authService.authenticateSsoUser(
        provider,
        providerUserId
      );

      // If the user exists and authentication is successful
      if (authResp) {
        // Prepare the token and user data for the response
        const tokenResponse = authResp?.token ? `${authResp.token}` : null;
        const refreshToken = authResp?.refreshToken ? `${authResp.refreshToken}` : null; // refresh token might be null
        const userResponse = authResp?.user;
        // Create a response object that includes the user data and token
        const response = createSsoAuthResponse(
          tokenResponse,
          refreshToken,
          {
            ...userResponse,
            lastLogin: userResponse?.lastLogin || null,
            userRole: userResponse?.userRole,
            userCart: userResponse?.userCart || null,
            acceptedTerms: userResponse?.acceptedTerms || 0,
          },
          true
        );

        // Step 3: Check if the user's phone number is provided and verified
        const userResp = await this.userService.getUserOrThrow(
          authResp.user.id || 0
        );
        if (!userResp.dataValues.phone || !userResp.dataValues.phoneVerified) {
          // Mark phoneVerified as false if phone is missing or unverified
          if (response.data) {
            response.data.phoneVerified = false;
          }
        }
        transaction.commit();

        // Send the response
        res.status(200).json(response);
      } else {
        // Step 4: If the user does not exist, proceed with creating a new user

        // Extract user data from SSO payload to create a new user
        const ssoUserData = extractSsoUserData(req, createSsoUserSchema);

        // Prepare the user creation payload
        const userPayload = {
          firstName: ssoUserData.firstName,
          lastName: ssoUserData.lastName ?? '',
          email: ssoUserData.email,
          phone: ssoUserData.phone || undefined,
          provider: provider,
          providerUserId: providerUserId,
          isSsoUser: 1,
          ssoMetadata: ssoUserData.ssoMetadata,
          createdBy: 0,
          modifiedBy: 0,
        };
        // Create the new user with the extracted data
        const newUser = await this.userService.createSsoUser(
          userPayload,
          transaction
        );

        // Step 5: Assign the user a role (e.g., USER)
        const roleData = await this.roleService.getRoleByName(
          enumRoll.USER,
          transaction
        );
        if (!roleData) {
          throw new Error('User creation failed. Could not find role.');
        }

        // Prepare the user role payload
        const userRolePayoad = {
          userId: newUser.dataValues.id,
          roleId: roleData.dataValues.id,
        };
        // Create the user-role association
        await this.userService.createUserRoll(userRolePayoad, transaction);

        // Step 6: Authenticate the newly created user using the SSO data
        const authResp = await this.authService.authenticateSsoUser(
          provider,
          providerUserId,
          transaction
        );

        // Prepare the token and user data for the response
        const tokenResponse = authResp?.token ? `${authResp.token}` : null;
        const refreshToken = authResp?.refreshToken ? `${authResp.refreshToken}` : null; // refresh token might be null
        const userResponse = authResp?.user;
        // Create a response object that includes the user data and token
        const response = createSsoAuthResponse(
          tokenResponse,
          refreshToken, 
          {
            ...userResponse,
            lastLogin: userResponse?.lastLogin || null,
          },
          false
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
   * handles refresh token and return new access token for expired case
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  async refreshTokenHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' });

      // Verify refresh token and generate new access token

      let newAccessToken = await this.authService.refreshTokenGenerator(refreshToken);
      const response = createRefreshTokenResponse(newAccessToken?.accessToken);
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }

  }
}
