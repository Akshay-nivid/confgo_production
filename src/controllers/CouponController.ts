import { Request, Response, NextFunction } from 'express';
import { CouponService } from '../services/CouponService';
import {
  applyCouponSchema,
  createCouponSchema,
  removeCouponSchema,
  updateCouponSchema,
} from '../validators/couponValidator';
import { handleError } from '../utils/error_util';
import {
  extractUpdateCouponData,
  extractCreateCouponData,
  extractApplyCouponData,
  extractRemoveCouponData,
} from '../handlers/coupon/couponRequestHandler';
import {
  createCouponResponse,
  CouponResponseDTO,
  updateCouponResponse,
  getCouponResponse,
  CouponFilterDTO,
} from '../dtos/coupon/CouponDTO';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { Coupon } from '../models/Coupon';
import { enumCouponStatus, enumRoll } from '../utils/enum';
import { Logger } from '../utils/logger';
import { CouponStatus } from '../models/CouponStatus';
import { UserService } from '../services/UserService';
import { JwtPayload } from 'jsonwebtoken';

export class CouponController {
  private couponService = new CouponService();
  private userService = new UserService();
  /**
   * Handles the request to create a new coupon.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      if (!userId) {
        throw new Error('User authentication failed.');
      }
      const companyId = await this.userService.getCompanyId(userId);
      if (!companyId) {
        throw new Error('Company information could not be verified');
      }
      const couponData = extractCreateCouponData(req, createCouponSchema);

      // check if coupon code name exist
      const couponExist = await this.couponService.getCouponByName(
        couponData.code
      );
      if (couponExist) {
        throw new Error('Coupon code already exist');
      }
      const coupon = await this.couponService.createCoupon(
        couponData,
        companyId,
        userId
      );
      const response = createCouponResponse(coupon);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error createCoupon:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to get all coupons.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      if (!userId) {
        throw new Error('User authentication failed.');
      }
      const userRole = (req.user as JwtPayload)?.userRole;
      const baseFilter: CouponFilterDTO = { statusId: enumCouponStatus.ACTIVE };
      if (userRole === enumRoll.COMPANYADMIN) {
        const companyId = await this.userService.getCompanyId(userId);
        if (!companyId) {
          throw new Error('Company information could not be verified');
        }
        baseFilter.companyId = companyId;
      }
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const finalFilters = { ...baseFilter, ...filters };
      const { rows: coupons, count: total } =
        await this.couponService.getAllCoupons(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );
      const filteredCoupons = coupons.map((coupon: Coupon) =>
        this.filterCouponFields(coupon)
      );
      const response = createPaginatedResponse(
        filteredCoupons,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error getAllCoupons:', error);
      handleError(next, error);
    }
  }

  /**
   * Filters the coupon fields based on the requested fields.
   * @param coupon - The coupon object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered coupon object.
   */
  private filterCouponFields(coupon: Coupon) {
    return coupon;
  }

  /**
   * Handles the request to update an existing coupon by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const couponData = extractUpdateCouponData(req, updateCouponSchema);
      const couponId = req.params?.id;

      const [updatedCount] = await this.couponService.updateCoupon(
        Number(couponId),
        couponData
      );

      if (updatedCount > 0) {
        const updatedCoupon = await this.couponService.getCouponOrThrow(
          Number(couponId)
        );

        const response = updateCouponResponse(
          updatedCoupon as CouponResponseDTO
        );

        res.status(200).json(response);
      } else {
        res
          .status(422)
          .json({ status: 'error', message: 'No changes were made to the coupon' });
      }
    } catch (err) {
      Logger.error('Error updateCoupon:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to get a user by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getCouponById(req: Request, res: Response, next: NextFunction) {
    try {
      const couponId = req.params?.id;
      const coupon = await this.couponService.getCouponById(Number(couponId));
      if (coupon) {
        const response = getCouponResponse(coupon as CouponResponseDTO); // Convert to DTO for consistent response
        res.status(200).json(response);
      } else {
        res.status(404).json({ status: 'error', message: 'Coupon not found' });
      }
    } catch (error) {
      Logger.error('Error getCouponById:', error);
      handleError(next, error);
    }
  }

  /**
   * Handles the request to delete a coupon by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const couponId = req.params?.id;
      const deleted = await this.couponService.deleteCoupon(Number(couponId));
      if (deleted) {
        const response = {
          status: 'success',
          data: null,
          message: 'Coupon deleted.',
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({ status: 'error', message: 'Coupon not found' });
      }
    } catch (err) {
      Logger.error('Error deleteCoupon:', err);
      handleError(next, err);
    }
  }
  /**
   * Handles the request to retrieve coupon status list.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllCouponStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const { rows: couponStatus, count: total } =
        await this.couponService.getAllCouponStatus(
          limit,
          offset,
          sortBy,
          sortDirection
        );
      const filteredCouponStatus = couponStatus.map(
        (couponStatus: CouponStatus) =>
          this.filterCouponStatusFields(couponStatus)
      );
      const response = createPaginatedResponse(
        filteredCouponStatus,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error getAllCouponStatus:', error);
      handleError(next, error);
    }
  }
  private filterCouponStatusFields(couponStatus: CouponStatus) {
    return couponStatus;
  }

  /**
   * Handles the request to apply a coupon.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async applyCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const UserId = (req.user as JwtPayload)?.id;
      // Extract coupon data from the request body
      const couponData = extractApplyCouponData(req, applyCouponSchema);

      // Apply the coupon using the coupon service
      const appliedCoupon = await this.couponService.applyCoupon(
        couponData,
        Number(UserId)
      );

      // Respond with the applied coupon details
      res.status(200).json(appliedCoupon);
    } catch (error) {
      // Log error and pass it to the error handling middleware
      Logger.error('Error applying coupon:', error);
      handleError(next, error);
    }
  }

  /**
   * Handles the request to remove a coupon.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async removeCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const data = extractRemoveCouponData(req, removeCouponSchema);

      // remove the coupon using the coupon service
      const removedCoupon = await this.couponService.removeCoupon(data.cartId);
      res.status(200).json(removedCoupon);
    } catch (error) {
      // Log error and pass it to the error handling middleware
      Logger.error('Error applying coupon:', error);
      handleError(next, error);
    }
  }
}
