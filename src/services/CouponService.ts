import { Coupon } from '../models/Coupon';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { CouponUsage } from '../models/CouponUsage';
import {
  ApplyCouponDTO,
  CouponResponse,
  CouponUsageFilterDTO,
  CreateCouponDTO,
  UpdateCouponDTO,
} from './../dtos/coupon/CouponDTO';
import { CouponFilterDTO } from './../dtos/coupon/CouponDTO';
import { CouponStatus } from '../models/CouponStatus';
import { enumCouponStatus } from '../utils/enum';
import { Cart } from '../models/Cart';
export class CouponService {
  private couponService: BaseService<Coupon>;
  private couponUsageService: BaseService<CouponUsage>;
  private couponStatusService: BaseService<CouponStatus>;
  private cartBaseService: BaseService<Cart>;

  constructor() {
    this.couponService = new BaseService(
      Coupon as unknown as { new (): Coupon } & typeof Coupon
    );
    this.couponUsageService = new BaseService(
      CouponUsage as unknown as { new (): CouponUsage } & typeof CouponUsage
    );
    this.couponStatusService = new BaseService(
      CouponStatus as unknown as { new (): CouponStatus } & typeof CouponStatus
    );
    this.cartBaseService = new BaseService(
      Cart as unknown as { new (): Cart } & typeof Cart
    );
  }

  /**
   * Fetches all coupons with optional filters, pagination, sorting, and limit.
   * @param filters - Object containing filters to apply to the query.
   * @param limit - Number of coupons to return.
   * @param offset - Number of coupons to skip for pagination.
   * @param sortBy - Field to sort by.
   * @param sortDirection - Direction to sort (ASC or DESC).
   * @returns A list of coupons and the total count of coupons matching the criteria.
   */
  async getAllCoupons(
    filters: CouponFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Coupon[]; count: number }> {
    try {
      const where: WhereOptions<Coupon> = {}; // Use WhereOptions for proper typing

      if (filters?.startTime && filters?.endTime) {
        where.startDate = {
          [Op.lte]: new Date(filters.endTime).setHours(23, 59, 59, 999),
        };
        where.endDate = {
          [Op.gte]: new Date(filters.startTime),
        };
      } else if (filters?.startTime) {
        where.endDate = { [Op.gte]: new Date(filters.startTime) };
      } else if (filters?.endTime) {
        where.startDate = {
          [Op.lte]: new Date(filters.endTime).setHours(23, 59, 59, 999),
        };
      }

      if (filters?.name) {
        where.name = { [Op.like]: `%${filters.name}%` };
      }
      if (filters?.id !== undefined) {
        where.id = filters.id;
      }

      if (filters?.statusId !== undefined) {
        where.statusId = filters.statusId;
      } else {
        where.statusId = enumCouponStatus.ACTIVE;
      }

      if (filters?.discountType) {
        where.discountType = filters.discountType;
      }

      if (filters?.maxUses) {
        where.maxUses = filters.maxUses;
      }

      if (filters?.companyId) {
        where.companyId = filters.companyId;
      }

      const { count, rows } = await this.couponService.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });

      return { rows, count };
    } catch (error) {
      Logger.error('Error getAllCoupons', error);
      throw error;
    }
  }
  /**
   * Retrieves a single coupon by their primary key (ID).
   * @param id - The ID of the coupon to retrieve.
   * @returns A promise that resolves to the coupon record, or null if not found.
   */
  async getCouponById(id: number): Promise<Coupon | null> {
    try {
      return this.couponService.findById(id);
    } catch (error) {
      Logger.error('Error getCouponById:', error);
      throw error;
    }
  }

  /**
   * Retrieves a single coupon by the coupon code.
   * @param code - The code of the coupon to retrieve.
   * @returns A promise that resolves to the coupon record, or null if not found.
   */
  async getCouponByName(code: string): Promise<Coupon | null> {
    try {
      return this.couponService.findOne({
        where: {
          code,
        },
      });
    } catch (error) {
      Logger.error('Error getCouponByName:', error);
      throw error;
    }
  }

  /**
   * Creates a new coupon.
   * @param couponData - The coupon data for the new coupon.
   * @returns A promise that resolves to the created coupon record.
   */
  async createCoupon(
    couponData: CreateCouponDTO,
    companyId: number,
    UserId: number
  ): Promise<Coupon> {
    return this.couponService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          couponData.statusId = enumCouponStatus.ACTIVE;
          couponData.companyId = companyId;
          couponData.createdBy = UserId;
          couponData.modifiedBy = UserId;
          couponData.timesUsed = 0;
          const newCoupon = await this.couponService.create(
            couponData,
            transaction
          );
          return newCoupon;
        } catch (error) {
          Logger.error('Error createCoupon', error);
          throw error;
        }
      }
    );
  }

  /**
   * Updates an existing coupon in the database.
   * @param id - The ID of the coupon to update.
   * @param updateData - The data to update.
   * @returns A promise that resolves to a tuple containing the number of affected rows and an array of the updated coupon records (if { returning: true } is set).
   */
  async updateCoupon(
    id: number,
    updateData: UpdateCouponDTO
  ): Promise<[number, Coupon[] | undefined]> {
    try {
      return this.couponService.update(id, updateData);
    } catch (error) {
      Logger.error('Error updateCoupon:', error);
      throw error;
    }
  }

  /**
   * Deletes a coupon from the database.
   * @param id - The ID of the coupon to delete.
   * @returns A promise that resolves to the number of rows affected (1 if successful, 0 if no rows were deleted).
   */
  async deleteCoupon(id: number): Promise<[number, Coupon[] | undefined]> {
    try {
      await this.getCouponOrThrow(id);
      const deleteData = { statusId: enumCouponStatus.INACTIVE };
      return this.couponService.update(id, deleteData);
    } catch (error) {
      Logger.error('Error deleteCoupon:', error);
      throw error;
    }
  }

  /**
   * Retrieves a coupon by ID. If the coupon is not found, throws an error.
   * @param id - The ID of the coupon to retrieve.
   * @returns The coupon record if found.
   * @throws Error if the coupon is not found.
   */
  async getCouponOrThrow(id: number): Promise<Coupon> {
    const coupon = await this.couponService.findById(id);
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    return coupon;
  }

  /**
   * Retrieves all active coupons from the database.
   * @returns A promise that resolves to an array of active User records or error response.
   */
  async getActiveCoupons(): Promise<Coupon[]> {
    return this.couponService.findAll({
      where: {
        statusId: enumCouponStatus.ACTIVE,
      },
    });
  }

  /**
   * Applies a coupon for a user and records usage in the CouponUsage table.
   * @param userId - The ID of the user applying the coupon.
   * @param couponId - The ID of the coupon being applied.
   * @param eventId - The ID of the event.
   * @returns - A success or error status and message .
   */
  async applyCouponToUser(
    userId: number,
    couponId: number,
    eventId: number
  ): Promise<{ status: string; message: string }> {
    try {
      const coupon = await this.couponService.findById(couponId);

      if (!coupon) {
        return { status: 'error', message: 'Invalid coupon ID.' };
      }

      const currentDate = new Date();
      if (coupon.endDate && currentDate > coupon.endDate) {
        return { status: 'error', message: 'Coupon has expired.' };
      }

      if (coupon.timesUsed >= coupon.maxUses) {
        return {
          status: 'error',
          message: 'Coupon usage limit has been reached.',
        };
      }

      const usageExists = await this.couponUsageService.findOne({
        where: { userId, couponId },
      });

      if (usageExists) {
        return {
          status: 'error',
          message: 'Coupon already used by this user.',
        };
      }

      return this.couponService.executeTransaction(
        async (transaction: Transaction) => {
          const usageData = {
            userId,
            couponId,
            eventId: eventId,
            createdBy: userId,
            modifiedBy: userId,
          };

          const response = await this.couponUsageService.create(
            usageData,
            transaction
          );

          if (response) {
            coupon.timesUsed += 1;
            await this.couponService.update(
              couponId,
              { timesUsed: coupon.timesUsed },
              { where: { id: couponId } },
              transaction
            );

            return {
              status: 'success',
              message: 'Coupon applied successfully.',
            };
          } else {
            return { status: 'error', message: 'Failed to apply the coupon.' };
          }
        }
      );
    } catch (error) {
      Logger.error('Error applyCouponToUser:', error);
      return {
        status: 'error',
        message: 'An error occurred while applying the coupon.',
      };
    }
  }

  /**
   * Method to  retrieve coupon usage record.
   * @param filters  CouponUsageFilterDTO object.
   * @param limit
   * @param offset
   * @param sortBy
   * @param sortDirection
   * @returns an array of coupon usage records and the total count of records.
   */
  async getCouponUsage(
    filters: CouponUsageFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: CouponUsage[]; count: number }> {
    try {
      const { count, rows } = await this.couponUsageService.findAndCountAll({
        where: { ...filters },
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getCouponUsage', error);
      throw error;
    }
  }

  /**
   * Retrieves all coupon statuses from the database.
   * @returns - An array of coupon statuses.
   */
  async getAllCouponStatus(
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: CouponStatus[]; count: number }> {
    try {
      const { count, rows } = await this.couponStatusService.findAndCountAll({
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getAllCouponStatus:', error);
      throw error;
    }
  }

  /**
   * Applies a coupon by validating its code, expiration date, and usage limit.
   *
   * @param couponData - The coupon data containing the code to be applied.
   * @returns - The valid coupon if successfully applied.
   * @throws - An error if the coupon code is invalid, expired, or has exceeded its usage limit.
   */
  async applyCoupon(
    couponData: ApplyCouponDTO,
    userId: number
  ): Promise<CouponResponse> {
    return this.couponService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          // Find the coupon by code and validate start and expiration dates
          const coupon = await this.couponService.findOne({
            where: {
              code: couponData.code,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() },
              statusId: enumCouponStatus.ACTIVE,
            },
            transaction,
          });

          // If no valid coupon is found, throw an error
          if (!coupon) {
            const errorMessage = 'Invalid coupon code or it has expired.';
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }

          // Check if the user has already used the coupon.
          const existingUsage = await this.couponUsageService.findOne({
            where: {
              couponId: coupon.id,
              userId: userId,
            },
            transaction,
          });

          if (existingUsage) {
            const errorMessage = 'Coupon already used by this user.';
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }

          // Check if the coupon usage limit has been reached
          if (coupon.timesUsed >= coupon.maxUses) {
            const errorMessage = 'Coupon usage limit has been reached.';
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }

          //Checking the given cart is is exist or not.
          const cart = await this.cartBaseService.findById(couponData.cartId);
          if (!cart) {
            const errorMessage = `Cart ID ${couponData.cartId} doesn't Exist.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }
          const totalAmount = cart.dataValues.finalPrice;

          // Check if totalAmount meets the minimum purchase value
          if (
            Number(totalAmount) < Number(coupon.dataValues.minPurchaseValue)
          ) {
            const errorMessage = `This coupon requires a minimum purchase amount that hasn't been met`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }

          // Calculate applied coupon amount based on discount type
          let appliedCouponAmount: number;
          if (coupon.dataValues.discountType === 'percentage') {
            appliedCouponAmount =
              totalAmount -
              totalAmount * (coupon.dataValues.discountValue / 100);
          } else {
            appliedCouponAmount =
              totalAmount - Number(coupon.dataValues.discountValue);
          }
          appliedCouponAmount = parseFloat(appliedCouponAmount.toFixed(2));

          //Checking the coupon has maximum discount value
          if (
            coupon.dataValues.maxDiscountValue > 0 &&
            coupon.dataValues.maxDiscountValue !== null
          ) {
            //Checking the discount value is greated then maximum discount value
            if (
              coupon.dataValues.maxDiscountValue <
              totalAmount - appliedCouponAmount
            ) {
              appliedCouponAmount =
                totalAmount - coupon.dataValues.maxDiscountValue;
            }
          }

          // Prepare the response with relevant information
          const response = {
            coupon: coupon,
            purchaseAmount: Number(totalAmount),
            discountAmount: totalAmount - appliedCouponAmount,
            total: appliedCouponAmount,
          };

          Logger.info('Coupon applied successfully:', coupon);

          return {
            status: 'success',
            message: 'Coupon applied successfully',
            data: response,
          };
        } catch (error) {
          // Log and propagate any errors encountered during coupon application
          Logger.error('Error applying coupon:', error);
          throw error;
        }
      }
    );
  }

  /**
   * Removes an applied coupon from a user's cart.
   * @param couponData - Data related to the applied coupon.
   * @param userId - ID of the user applying the coupon.
   * @returns - An object with status, message, and the updated cart total.
   */
  async removeCoupon(cartId: number) {
    return this.couponService.executeTransaction(async () => {
      try {
        const cart = await this.cartBaseService.findById(cartId);
        const response = {
          finalPrice: cart?.dataValues.finalPrice,
        };
        return {
          status: 'success',
          message: 'Coupon Removed successfully',
          data: response,
        };
      } catch (error) {
        Logger.error('Error removing applied coupon:', error);
        throw error;
      }
    });
  }
}
