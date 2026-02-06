/**
 * @author sarathavs
 * @class AuthService
 * @description Service class for handling Auth operations .
 */
import bcrypt from 'bcrypt';
import { UserAuth } from '../models/UserAuth';
import { BaseService } from './BaseService';
import { generateRefreshToken, generateToken,verifyRefreshToken } from '../utils/jwt_util'; // Utility to generate JWT
import { User } from '../models/User';
import { UserRole } from '../models/UserRole';
import { Cart, Role } from '../models/init-models';
import { Transaction } from 'sequelize';
import { enumStatus } from '../utils/enum';

export class AuthService {
  private authBaseService: BaseService<UserAuth>;
  private baseUserService: BaseService<User>;

  constructor() {
    // Cast the User model explicitly to match the expected constructor signature
    this.baseUserService = new BaseService(
      User as unknown as { new(): User } & typeof User
    );
    this.authBaseService = new BaseService(
      UserAuth as unknown as { new(): UserAuth } & typeof UserAuth
    );
  }

  async authenticateUser(
    username: string,
    password: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: Partial<User> & {
      username: string;
      lastLogin: Date | null;
      statusId?: number;
      acceptedTerms?: number;
      userRole: {
        id: number;
        roleName: string;
      };
      userCart?: {
        id: number | null;
      } | null;
    };
  } | null> {
    const userAuth = await this.authBaseService.findOne({
      where: { username: username },
    });

    if (!userAuth) {
      throw new Error('Invalid username or password');
    }

    const isPasswordValid = userAuth.password
      ? await bcrypt.compare(password, userAuth.password)
      : false;
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    if (!userAuth.userId) {
      throw new Error('Invalid username or password');
    }

    //before generating the token update last login
    this.authBaseService.update(userAuth.id, { lastLogin: new Date() });

    const user = await this.baseUserService.findById(userAuth.userId, {
      include: [
        {
          model: UserRole,
          as: 'userRoles',
          include: [
            {
              model: Role,
              as: 'role',
            },
          ],
        },
        {
          model: Cart,
          as: 'carts',
          required: false,
        }
      ],
    });

    const token = generateToken({
      id: userAuth.userId,
      username: userAuth.username,
      userRole: user?.userRoles?.[0]?.role?.roleName || '',
    });

    const refreshToken = generateRefreshToken({
      id: userAuth.userId,
      username: userAuth.username,
      userRole: user?.userRoles?.[0]?.role?.roleName || '',
    });

    return {
      token,
      refreshToken,
      user: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        statusId: user?.statusId,
        email: user?.email,
        username: userAuth.username || '',
        acceptedTerms: user?.acceptedTerms,
        lastLogin: userAuth.modifiedOn || null, // You can update this when successful login
        userRole: {
          id: user?.userRoles?.[0]?.role?.id || 0,
          roleName: user?.userRoles?.[0]?.role?.roleName || '',
        },
        userCart: {
          id: user?.carts && user.carts.length > 0 ? user.carts[0].id : null,
        },
      },
    };
  }

  /**
   * Authenticate a user based on their SSO (Single Sign-On) provider and provider user ID.
   *
   * @param provider - The name of the SSO provider (e.g., Google, Facebook).
   * @param providerUserId - The user's ID from the SSO provider.
   * @param transaction - optional sequelize transaction 
   * @returns An object containing the JWT token and user information if authentication is successful, otherwise null.
   */
  async authenticateSsoUser(
    provider: string,
    providerUserId: string,
    transaction?: Transaction
  ): Promise<{
    token: string;
    refreshToken: string;
    user: Partial<User> & {
      username: string;
      lastLogin: Date | null;
      userRole: {
        id: number;
        roleName: string;
      };
      userCart?: {
        id: number | null;
      } | null;
    };
  } | null> {
    const userAuth = await this.authBaseService.findOne(
      {
        where: { provider: provider, providerUserId: providerUserId },
      },
      transaction
    );

    if (!userAuth) {
      return null;
    }

    //before generating the token update last login
    this.authBaseService.update(
      userAuth.id,
      { lastLogin: new Date() },
      undefined,
      transaction
    );

    const user = await this.baseUserService.findById(
      userAuth.userId,
      {
        include: [
          {
            model: UserRole,
            as: 'userRoles',
            include: [
              {
                model: Role,
                as: 'role',
              },
            ],
          },
          {
            model: Cart,
            as: 'carts',
            required: false,
          }
        ],
      },
      transaction
    );

    const token = generateToken({
      id: userAuth.userId,
      username: userAuth.providerUserId,
      userRole: user?.userRoles?.[0]?.role?.roleName || '',
    });

    const refreshToken = generateRefreshToken({
      id: userAuth.userId,
      username: userAuth.username,
      userRole: user?.userRoles?.[0]?.role?.roleName || '',
    });

    return {
      token,
      refreshToken,
      user: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        username: userAuth.username || '',
        lastLogin: userAuth.modifiedOn || null, // You can update this when successful login
        userRole: {
          id: user?.userRoles?.[0]?.role?.id || 0,
          roleName: user?.userRoles?.[0]?.role?.roleName || '',
        },
        userCart: {
          id: user?.carts && user.carts.length > 0 ? user.carts[0].id : null,
        },
      },
    };
  }

  /**
   * Verify  Refresh Token and Generate new access token 
   * @param refreshToken 
   * @returns 
   */
   refreshTokenGenerator = async (refreshToken: string) => {
    try {
      const decoded = await verifyRefreshToken(refreshToken);
      const newAccessToken = generateToken({
        id: decoded.id,
        username: decoded.username,
        userRole: decoded.userRole,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      return { error };
    }
  }
}