/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @author sarathavs
 * @class UserService
 * @description Service class for handling CRUD operations related to the User model.
 */
import { Op, Sequelize, Transaction, WhereOptions } from 'sequelize';
import { BaseService } from './BaseService';
import bcrypt from 'bcrypt';
import { Logger } from '../utils/logger';
import { enumEventSpeakerStatus, enumRoll, enumStatus, enumUserAbstractStatus, enumUserStatus, enumVolunteerEventStatus, enumVolunteerStatus } from '../utils/enum';
import {
  Company,
  EventSpeaker,
  Role,
  User,
  UserAbstract,
  UserAuth,
  UserCompany,
  UserRole,
  UserStatus,
  VolunteerEvent
} from '../models/init-models';
import {
  AssignEventToUserDTO,
  AssignEventVolunteerDTO,

  CreateSsoUserDTO,
  CreateUserDTO,
  CreateUserRoleDTO,
  PasswordDataDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
  UserListFiltersDTO,
  UserRoleFilterDTO,
} from '../dtos/user/UserDTO';
import { Utils } from '../utils/Utils';
import { CreateEventSpeakerDTO } from '../dtos/event/EventProgramDTO';

export class UserService {
  private baseService: BaseService<User>;
  private authBaseService: BaseService<UserAuth>;
  private userCompanyService: BaseService<UserCompany>;
  private userStatusService: BaseService<UserStatus>;
  private userRoleBaseService: BaseService<UserRole>;
  private volunteerEventBaseService: BaseService<VolunteerEvent>;
  private roleBaseService: BaseService<Role>;
  private eventSpeakerBaseService: BaseService<EventSpeaker>;
  private userAbstractBaseService: BaseService<UserAbstract>;
  constructor() {
    // Cast the User model explicitly to match the expected constructor signature
    this.baseService = new BaseService(
      User as unknown as { new(): User } & typeof User
    );
    this.authBaseService = new BaseService(
      UserAuth as unknown as { new(): UserAuth } & typeof UserAuth
    );
    this.userCompanyService = new BaseService(
      UserCompany as unknown as { new(): UserCompany } & typeof UserCompany
    );
    this.userStatusService = new BaseService(
      UserStatus as unknown as { new(): UserStatus } & typeof UserStatus
    );
    this.userRoleBaseService = new BaseService(
      UserRole as unknown as { new(): UserRole } & typeof UserRole
    );
    this.volunteerEventBaseService = new BaseService(
      VolunteerEvent as unknown as { new(): VolunteerEvent } & typeof VolunteerEvent
    );
    this.roleBaseService = new BaseService(
      Role as unknown as { new(): Role } & typeof Role
    );
    this.eventSpeakerBaseService = new BaseService(
      EventSpeaker as unknown as { new(): EventSpeaker } & typeof EventSpeaker
    );
    this.userAbstractBaseService = new BaseService(
      UserAbstract as unknown as { new(): UserAbstract } & typeof UserAbstract
    );
  }

  /**
   * Fetches all users with optional filters, pagination, sorting, and limit.
   * @param filters - Object containing filters to apply to the query.
   * @param limit - Number of users to return.
   * @param offset - Number of users to skip for pagination.
   * @param sortBy - Field to sort by.
   * @param sortDirection - Direction to sort (ASC or DESC).
   * @returns A list of users and the total count of users matching the criteria.
   */
  async getAllUsers(
    filters: any,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: User[]; count: number }> {
    const { count, rows } = await this.baseService.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [[sortBy, sortDirection.toUpperCase()]], // Adding sorting to the query
    });

    return { rows, count };
  }
  /**
   * Fetches all userslist with role details, optional filters, pagination, sorting, and limit.
   * @param filters - Object containing filters to apply to the query.
   * @param limit - Number of users to return.
   * @param offset - Number of users to skip for pagination.
   * @param sortBy - Field to sort by.
   * @param sortDirection - Direction to sort (ASC or DESC).
   * @returns A list of users and the total count of users matching the criteria.
   */
  async getAllUserWithRoles(
    filters: UserListFiltersDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    userId: number,
    userRole: string,
  ): Promise<{ rows: User[]; count: number }> {

    let userCondition: WhereOptions = {};
    let companyCondition: WhereOptions = {};
    let userRoleFilters: WhereOptions = {};
    
    // Apply event filters based on provided filters object
    if (Utils.isNotUndefined(filters?.roleId)) {
      userRoleFilters.roleId= filters.roleId;
    }
    if(Utils.isNotUndefined(filters?.statusId)) {
      userCondition.statusId= filters.statusId;
    }
    if (Utils.isNotUndefined(filters?.userId)) {
      if(userRole === enumRoll.USER){
        userCondition.id = userId;
      }else{
        userCondition.id = filters.userId;
      }
    }
    if (Array.isArray(filters?.roleEnums) && filters.roleEnums.length > 0) {
      const roleIds = [];
      for (const role of filters.roleEnums) {
        const foundRole = await this.roleBaseService.findOne({
          where: { roleName: { [Op.like]: `%${role}%` } },
        });
    
        if (foundRole) {
          roleIds.push(foundRole.id);
        }
      }
    
      if (roleIds.length > 0) {
        userRoleFilters.roleId = { [Op.in]: roleIds };
      }
    }
    
    if (filters?.name) {
      userCondition = {
        [Op.or]: [
          { email: { [Op.like]: `%${filters.name}%` } },
          { firstName: { [Op.like]: `%${filters.name}%` } },
        ],
      };
    }    
    if (Utils.isNotUndefined(filters?.companyId)) {
      // checking the log in use is admin or not
      if (userRole === enumRoll.COMPANYADMIN) {
        // if the user is admin, giving companyId Filter as default.
        const company = await this.userCompanyService.findOne({
          where: { userId: userId },
          include: [{ model: Company, as: 'company', required: true }],
        });
        companyCondition.companyId = company?.company.dataValues.id;
      } else {
        companyCondition.companyId = filters.companyId;
      }
    }

    const { rows, count } = await this.baseService.findAndCountAll({
      where: userCondition,
      include: [
          {
            model: UserRole,
            as: 'userRoles',
            required: true,
            where: userRoleFilters,
            include: [
              {
                model: Role,
                as: 'role',
              }
            ]
          },
        {
          model: UserCompany,
          as: 'userCompanies',
          where: companyCondition,
          required: companyCondition ? true : false,
        },
      ],
      limit,
      offset,
      order: [[sortBy, sortDirection.toUpperCase()]]
    });

    // No need for additional filtering as it's handled in the query
    return { rows, count };
  }

  /**
   * Retrieves a single user by their primary key (ID).
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the User record, or null if not found.
   */
  async getUserById(id: number): Promise<User | null> {
    return this.baseService.findById(id);
  }

  /**
   * Retrieves a single user by their email.
   * @param email - The Email of the user to retrieve.
   * @returns A promise that resolves to the User record, or null if not found.
   */
  async getUserByEmail(email: string,userStatus:UserStatus): Promise<User | null> {
    return this.baseService.findOne({ where: { email: email ,statusId:userStatus.dataValues.id} });
  }

  /**
   * Creates a new user and its corresponding authentication record in a transaction.
   * @param userData - The user data for the new user.
   * @param authData - The authentication data for the new user.
   * @returns A promise that resolves to the created User record.
   */
  async createUser(
    userData: CreateUserDTO,
    roleName:string,
    transaction?: Transaction
  ): Promise<User> {
    try {
      let userStatus;
      /*
      Moving COMPANYADMIN to INACTIVE on Initial stage --After payment ,moved to ACTIVE 
      Other Users Directly to ACTIVE Status
      */
      if(roleName=="COMPANYADMIN"){
        userStatus = await this.getUserStatus(enumStatus.INACTIVE);
      }
      else 
        userStatus = await this.getUserStatus(enumStatus.ACTIVE);

      if (!userStatus) {
        throw new Error('User status not found');
      }
      userData.statusId = userStatus.dataValues.id;
      userData.createdBy = 0;
      userData.modifiedBy = 0;

      // Checking the given email is already exist or not
      const existingEmail = await this.getUserByEmail(userData.email,userStatus);
      if (existingEmail) {
        const errorMessage = `The provided email address is already in use.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Step 1: Create User without password
      const newUser = await this.baseService.create(userData, transaction);

      // Step 3: Create the user authentication entry using UserAuth
      await this.authBaseService.create(
        {
          userId: newUser.dataValues.id,
          username: userData.email, // Using email as username
          createdBy: 0,
          modifiedBy: 0,
        },
        transaction
      );

      return newUser;
    } catch (error) {
      Logger.error('Transaction Error, rolling back:', error);
      throw error; // Rethrow to ensure rollback
    }
  }

  async createSsoUser(
    userData: CreateSsoUserDTO,
    transaction?: Transaction
  ): Promise<User> {
    try {
      const userStatus = await this.getUserStatus(
        enumStatus.INACTIVE,
        transaction
      );
      if (!userStatus) {
        throw new Error('User status not found');
      }
      userData.statusId = userStatus.dataValues.id;
      userData.createdBy = 0;
      userData.modifiedBy = 0;

      // Step 1: Create User
      const newUser = await this.baseService.create(userData, transaction);

      // Step 3: Create the user authentication entry using UserAuth
      await this.authBaseService.create(
        {
          userId: newUser.dataValues.id,
          provider: userData.provider,
          providerUserId: userData.providerUserId,
          createdBy: 0,
          modifiedBy: 0,
        },
        transaction
      );

      return newUser;
    } catch (error) {
      Logger.error('Transaction Error, rolling back:', error);
      throw error; // Rethrow to ensure rollback
    }
  }

  /**
   * Updates an existing user in the database.
   * @param id - The ID of the user to update.
   * @param updateData - The data to update.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to a tuple containing the number of affected rows and an array of the updated User records (if { returning: true } is set).
   */
  async updateUser(
    id: number,
    updateData: UpdateUserDTO,
    transaction?: Transaction
  ): Promise<[number, User[] | undefined]> {

    //Fetch status ID for INACTIVE
    let condition={id:id}
    const user = await this.baseService.findOne({
      where: condition,
      include: [{ model: UserRole, as: 'userRoles' }],
    });

    if (!user) {
      throw new Error(`User not found.`);
    }

    if (
      updateData.statusId &&
      user.userRoles[0]?.dataValues.roleId &&
      updateData.statusId === enumUserStatus.INACTIVE
    ) {
      const role = await this.roleBaseService.findById(
        user.userRoles[0].dataValues.roleId
      );

      if (role) {
        const roleName = role.dataValues.roleName;

        // Call the helper function to check role assignment
        await this.checkUserRoleAssignment(roleName, user);
      }
    }

    return this.baseService.update(id, updateData, undefined, transaction);
  }

  /**
   * Deletes a user from the database.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to the number of rows affected (1 if successful, 0 if no rows were deleted).
   */
  async deleteUser(id: number): Promise<number> {
    return this.baseService.delete(id);
  }

  /**
   * Retrieves a user by ID. If the user is not found, throws an error.
   * @param id - The ID of the user to retrieve.
   * @returns The user record if found.
   * @throws Error if the user is not found.
   */
  async getUserOrThrow(id: number): Promise<User> {
    const user = await this.baseService.findById(id);
    if (!user) {
      throw new Error('User not found'); // You can customize the error message or use a custom error class
    }
    return user;
  }

  /**
   * Retrieves all active users from the database.
   * @returns A promise that resolves to an array of active User records.
   */
  async getActiveUsers(): Promise<User[]> {
    const sql = 'SELECT * FROM user WHERE status = :status';
    const replacements = { status: enumStatus.ACTIVE };
    return this.baseService.executeCustomQuery(sql, replacements);
  }

  /**
   * Creates a new company user.
   *
   * This function attempts to create a new user associated with a company .
   * It delegates the creation process to the userCompanyService.
   *
   * @param {UserCompanyData} userData - An object containing the user ID and company ID.
   * @param {Transaction} [transaction] - Optional transaction object for database operations.
   * @returns {Promise<UserCompany>} A promise that resolves to the created UserCompany object.
   * @throws {Error} If there's an error during the user creation process.
   */
  async createCompanyUser(
    UserCompanyData: any,
    transaction?: Transaction
  ): Promise<UserCompany> {
    try {
      return this.userCompanyService.create(UserCompanyData, transaction);
    } catch (error) {
      Logger.error('Error createCompanyUser:', error);
      throw error;
    }
  }

  /**
   * Gets user status.
   * @param statusName
   * @param transaction optional
   * @returns A promise that resolves to  user status.
   */
  async getUserStatus(
    statusName: string,
    transaction?: Transaction
  ): Promise<UserStatus | null> {
    try {
      return this.userStatusService.findOne(
        {
          where: { statusName: statusName },
        },
        transaction
      );
    } catch (error) {
      Logger.error('Error getUserStatus:', error);
      throw error;
    }
  }

  /**
   * setting the user password
   * @param id -The ID of the user .
   * @param data
   * @returns -return a message
   */
  async updatePassword(id: number, data: UpdatePasswordDTO, transaction?: Transaction): Promise<string> {
    try {
      const { password } = data;
      const hashedPassword = await bcrypt.hash(password, 10);

      const updateData = { password: hashedPassword };
      const whereOption = {
        userId: id,
      };
      //updating the password in UserAuth
      await this.authBaseService.updateCustom(updateData, whereOption,undefined,transaction);

      return 'Password updated successfully, and token expired.';
    } catch (error) {
      Logger.error('Error updtaePassword', error);
      throw error;
    }
  }

  /**
   * Creates a new user role entry in the database.
   *
   * This function assigns a role to a user by saving the provided `userId` and `roleId`
   * from the `CreateUserRoleDTO` data transfer object to the `UserRole` table. It can
   * optionally handle the operation within a provided Sequelize transaction.
   *
   * @param {CreateUserRoleDTO} userRollData - The data required to assign a role to a user
   * @param {Transaction} [transaction] - (Optional) A Sequelize transaction object for executing the role assignment within a transactional context.
   *
   * @returns {Promise<UserRole>} - A promise that resolves to the newly created `UserRole` object.
   */
  async createUserRoll(
    userRollData: CreateUserRoleDTO,
    transaction?: Transaction
  ): Promise<UserRole> {
    try {
      return await this.userRoleBaseService.create(userRollData, transaction);
    } catch (error) {
      Logger.error('Error createUserRoll:', error);
      throw error;
    }
  }

  /**
   * Retrieves the role information for a specific user by their ID.
   *
   * @param {number} id - The ID of the user whose role is to be retrieved.
   * @returns {Promise<UserRole | null>} - A promise that resolves to the user's role if found, or null if no role is associated with the user.
   */
  async getUserRole(id: number): Promise<UserRole | null> {
    const userRole = await this.userRoleBaseService.findOne({
      where: { userId: id },
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
    });
    return userRole;
  }

  /**
   * Get the company id from usercompany model
   * @param userId
   * @returns -retrived companyId
   */
  async getCompanyId(userId: any, transaction?: Transaction): Promise<number | undefined> {
    try {
      const data = await this.userCompanyService.findAll({
        where: { userId: userId },
      });
      if (data.length === 0) {
        // Handle the case where no data is found
        Logger.info('No company found for userId:', userId);
        return undefined; // or throw an error if appropriate
      }
      const companyId = data[0].dataValues.companyId;
      return companyId;
    } catch (error) {
      Logger.error('Error in getting company id:', error);
      throw error;
    }
  }

  /**
   * Retrieves detailed user information and their associated role based on the provided username.
   *
   * 1. Fetches the user authentication record using the username.
   * 2. Uses the user ID to fetch the user's full details and role information.
   * 3. Returns the user and role details if found, otherwise throws an error if the user does not exist.
   *
   * @param {string} username - The username to search for.
   * @returns {Promise<{ user: User, userRole: { id: number, roleName: string } } | null>} - The user's details and role or null if not found.
   * @throws Will throw an error if the user is invalid.
   */
  async getUserDetailFromUsername(username: string): Promise<{
    user: User;
    userRole: {
      id: number;
      roleName: string;
    };
  } | null> {
    const userAuth = await this.authBaseService.findOne({
      where: { username },
    });

    if (!userAuth) {
      throw new Error('Invalid user');
    }
    const userData = await this.baseService.findById(
      userAuth.dataValues.userId,
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
        ],
      }
    );
    if (!userData) {
      throw new Error('Invalid user');
    }
    const user = await this.baseService.findById(userAuth.userId, {
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
      ],
    });

    return {
      user: {
        id: user?.id || 0,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        isSsoUser: user?.isSsoUser || 0,
      } as User,
      userRole: {
        id: user?.userRoles?.[0]?.role?.id || 0,
        roleName: user?.userRoles?.[0]?.role?.roleName || '',
      },
    };
  }

  /**
   * service method to check if a user exists based on their phone number or email.
   * @param phone
   * @param email
   * @returns An object containing two boolean flags:
   *  `phoneExists`: true if the phone number already exists, false otherwise.
   *  `emailExists`: true if the email already exists, false otherwise.
   */
  async checkUserRegistration(
    phone?: string,
    email?: string
  ): Promise<{ phoneExists: boolean; emailExists: boolean }> {
    try {
      const whereCondition: WhereOptions = {
        [Op.or]: [...(phone ? [{ phone }] : []), ...(email ? [{ email }] : [])],
      };
      const existingUser = await this.baseService.findOne({
        where: whereCondition,
        attributes: ['phone', 'email'],
      });
      return {
        phoneExists: existingUser?.phone === phone,
        emailExists: existingUser?.email?.toLowerCase() === email?.toLowerCase(),
      };
    } catch (error) {
      Logger.error('Error checkUserRegistration:', error);
      throw error;
    }
  }
  /**
   * Assign Event to volunteer.
   * @param eventdata - data to assign.
   * @returns The newly created assign EventTo Volunteer User.
   */
  async assignEventToUsers(
    eventdata: AssignEventVolunteerDTO
  ): Promise<VolunteerEvent[]> {
    return this.volunteerEventBaseService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          const userIds = eventdata.userIds;

          const createdEntries = await Promise.all(
            userIds.map(async (userId) => {
              const req = {
                userId: userId,
                eventId: eventdata.eventId,
                statusId: eventdata.statusId || 1,
                createdBy: 0,
                modifiedBy: 0,
              };
              // Check if the user is already assigned to the event
              const existingEntry = await this.volunteerEventBaseService.findOne({
                where: {
                  userId: userId,
                  eventId: eventdata.eventId,
                  statusId:enumVolunteerEventStatus.ACTIVE
                },
                transaction,
              });

              if (existingEntry) {
                const errorMessage = `User is already assigned to event ${eventdata.eventId}. Skipping.`;
                Logger.error(errorMessage);
                throw new Error(errorMessage);
              }
              const assignEvent = await this.volunteerEventBaseService.create(
                req,
                transaction
              );

              Logger.info('Assigned user to event:', assignEvent);
              return assignEvent;
            })
          );

          return createdEntries.filter((entry) => entry !== null);
        } catch (error) {
          Logger.error('Error assigning users to event:', error);
          throw error;
        }
      }
    );
  }
  /**
   * Fetches all userslist with role details, optional filters, pagination, sorting, and limit.
   * @param filters - Object containing filters to apply to the query.
   * @param limit - Number of users to return.
   * @param offset - Number of users to skip for pagination.
   * @param sortBy - Field to sort by.
   * @param sortDirection - Direction to sort (ASC or DESC).
   * @returns A list of users and the total count of users matching the criteria.
   */
  async getAllVolunteerEvents(
    filters: UserRoleFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: VolunteerEvent[]; count: number }> {

    let userCondition: WhereOptions = {};
    let volunteerFilters: WhereOptions = {};
    
    // Apply  filters based on provided filters object
    if (Utils.isNotUndefined(filters?.userId)) {
      volunteerFilters.userId= { [Op.eq]: filters.userId };
    }
    if (Utils.isNotUndefined(filters?.eventId)) {
      volunteerFilters.eventId= { [Op.eq]: filters.eventId };
    }
    if (filters?.statusId) {
      volunteerFilters.statusId = { [Op.eq]: filters.statusId };
    }
    if (filters?.name) {
      userCondition = {
        [Op.or]: {
          firstName: { [Op.like]: `%${filters.name}%` },
          email: { [Op.like]: `%${filters.name}%` },
          phone: { [Op.like]: `%${filters.name}%` }
        },
      };
    }

    const { count, rows } = await this.volunteerEventBaseService.findAndCountAll({
      where: volunteerFilters,
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          where: userCondition
        }
      ],
      order: [[sortBy, sortDirection.toUpperCase()]], // Adding sorting to the query
    });


    return { rows, count };
  }
  /**
   * Deletes a volunteer from the event duty.
   * @param id - The ID of the volunteer to delete.
   * @returns A promise that resolves to the number of rows affected (1 if successful, 0 if no rows were deleted).
   */
  async deleteVolunteerEvent(
    id: number
  ): Promise<[number, VolunteerEvent[] | undefined]> {
    try {
      const assignEvents = await this.volunteerEventBaseService.findById(id);
      if (!assignEvents) {
        throw new Error('Data not found with id ' + id);
      }
      const deleteData = { statusId: enumVolunteerStatus.INACTIVE };
      return this.volunteerEventBaseService.update(id, deleteData);
    } catch (error) {
      Logger.error('Error delete volunteer:', error);
      throw error;
    }
  }

  /**
   * Changes the password for a user.
   *
   * @param passwordData - The new and old password data provided by the user.
   * @param userId - The ID of the user whose password needs to be changed.
   * @param transaction - Optional transaction parameter for ensuring consistency if database operations are performed as part of a larger transaction.
   * @returns - Returns `true` if the password was successfully changed.
   * @throws - Throws an error if there is an issue during the password change process.
   */
  async changePassword(
    passwordData: PasswordDataDTO,
    userId: number,
    transaction?: Transaction
  ) {
    try {
      // Fetch the user's authentication record from the database using the provided userId.
      const userAuth = await this.authBaseService.findOne(
        { where: { userId } },
        transaction
      );

      // If no user is found or the user does not have a password stored, throw an error.
      if (!userAuth || !userAuth.dataValues.password) {
        const errorMessage = `Invalid User Id ${userId} Or Password Didn't `;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Compare the provided old password (from passwordData) with the stored hash (userAuth.dataValues.password).
      const isMatch = await bcrypt.compare(
        passwordData.currentPassword,
        userAuth.dataValues.password
      );

      // If the old password doesn't match, throw an error.
      if (!isMatch) {
        const errorMessage = `Current Password is Incorrect. Please Try Again`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Hash the new password using bcrypt (10 rounds of salting).
      const convertedNewPassword = await bcrypt.hash(
        passwordData.newPassword,
        10
      );

      // Update the user's password in the database with the newly hashed password.
      await this.authBaseService.update(
        userAuth.dataValues.id,
        { password: convertedNewPassword },
        undefined,
        transaction
      );

      // Return `true` indicating that the password was successfully updated.
      return true;
    } catch (err) {
      // Log any errors that occur during the password change process for debugging purposes.
      Logger.error('Error changePassword:', err);
      throw err;
    }
  }

  /**
   * Function to check the Role has any active existing assignments
   * @param roleName - to check based on the role
   * @param user - user details
   */
  async checkUserRoleAssignment(roleName: string, user: User) {
    try {

      // Helper function to check assignment status for each role
      const getAssignedEvent = async (roleName: string) => {
        switch (roleName) {
          case enumRoll.VOLUNTEER:
            return await this.volunteerEventBaseService.findOne({
              where: {
                userId: user.dataValues.id,
                statusId: enumVolunteerEventStatus.ACTIVE,
              },
            });
          case enumRoll.SPEAKER:
            return await this.eventSpeakerBaseService.findOne({
              where: {
                userId: user.dataValues.id,
                statusId: enumEventSpeakerStatus.ACTIVE,
              },
            });
          case enumRoll.REVIEWER:
            return await this.userAbstractBaseService.findOne({
              where: {
                reviewerId: user.dataValues.id,
                statusId: enumUserAbstractStatus.ACTIVE,
              },
            });
          default:
            return null;
        }
      };

      // Find if the user is assigned to an event
      const assigned = await getAssignedEvent(roleName);

      if (assigned) {
        const errorMessage = `User cannot be deleted as they are assigned as a ${roleName} to an active event (ID: ${assigned?.dataValues.eventId}). Please unassign first.`;
        Logger.error(errorMessage); // Log the error message
        throw new Error(errorMessage); // Throw the error with the same message
      }
    } catch (err) {
      Logger.error('Error checkUserRoleAssignment:', err);
      throw err;
    }
  }
}
