/**
 * @author saneeshiv
 * @class OrderService
 * @description Service class for handling CRUD operations related to the Order model.
 */

import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  Cart,
  CartItem,
  CompanyTax,
  Coupon,
  CouponUsage,
  Event,
  EventParticipantEntry,
  Order,
  OrderItem,
  OrderStatus,
  UserCompany,
} from '../models/init-models';
import { Op, Transaction, WhereOptions } from 'sequelize';
import {
  CreateOrderDTO,
  OrderDataDTO,
  OrderFilterDTO,
  UpdateOrderCondition,
  UpdateOrderDTO,
} from '../dtos/order/OrderDTO';
import { enumOrderStatus } from '../utils/enum';
import { AppliedCouponDTO } from '../dtos/coupon/CouponDTO';
import { Utils } from '../utils/Utils';

export class OrderService {
  private eventBaseService: BaseService<Event>;
  private userCompanyBaseService: BaseService<UserCompany>;
  private orderBaseService: BaseService<Order>;
  private OrderItemBaseService: BaseService<OrderItem>;
  private cartBaseService: BaseService<Cart>;
  private cartItemsBaseService: BaseService<CartItem>;
  private couponUsageBaseService: BaseService<CouponUsage>;
  private couponBaseService: BaseService<Coupon>;
  private eventParticipantEntryBaseService: BaseService<EventParticipantEntry>;
  private orderStatusBaseService: BaseService<OrderStatus>;
  private taxBaseService: BaseService<CompanyTax>;
  constructor() {
    this.orderBaseService = new BaseService(
      Order as unknown as { new (): Order } & typeof Order
    );
    this.OrderItemBaseService = new BaseService(
      OrderItem as unknown as {
        new (): OrderItem;
      } & typeof OrderItem
    );
    this.eventBaseService = new BaseService(
      Event as unknown as {
        new (): Event;
      } & typeof Event
    );
    this.cartBaseService = new BaseService(
      Cart as unknown as { new (): Cart } & typeof Cart
    );
    this.userCompanyBaseService = new BaseService(
      UserCompany as unknown as { new (): UserCompany } & typeof UserCompany
    );
    this.cartItemsBaseService = new BaseService(
      CartItem as unknown as {
        new (): CartItem;
      } & typeof CartItem
    );
    this.couponUsageBaseService = new BaseService(
      CouponUsage as unknown as { new (): CouponUsage } & typeof CouponUsage
    );
    this.couponBaseService = new BaseService(
      Coupon as unknown as { new (): Coupon } & typeof Coupon
    );
    this.eventParticipantEntryBaseService = new BaseService(
      EventParticipantEntry as unknown as {
        new (): EventParticipantEntry;
      } & typeof EventParticipantEntry
    );
    this.orderStatusBaseService = new BaseService(
      OrderStatus as unknown as { new (): OrderStatus } & typeof OrderStatus
    );
    this.taxBaseService = new BaseService(
      CompanyTax as unknown as { new (): CompanyTax } & typeof CompanyTax
    );
  }

  /**
   * Retrieves an order by its ID.
   * @param id - The ID of the order to retrieve.
   * @param userId - Optional user ID to filter orders by.
   * @param transaction - Optional transaction object for database operations.
   * @returns A promise that resolves to the Order record, or null if not found.
   */
  async getOrderById(
    id: number,
    userId?: number,
    transaction?: Transaction
  ): Promise<Order | null> {
    try {
      return this.orderBaseService.findById(
        id,
        {
          where: {
            userId,
          },
          include: [
            {
              model: OrderItem,
              as: 'orderItems',
            },
          ],
        },
        transaction
      );
    } catch (error) {
      Logger.error('Error getOrderById:', error);
      throw error;
    }
  }

  /**
   * Creates a new order.
   * @param userId - The ID of the user creating the order.
   * @param orderData - The data for the new order.
   * @param transaction - Optional transaction object for database operations.
   * @returns A promise that resolves to the created Order record.
   */
  async createOrder(
    userId: number,
    orderData: CreateOrderDTO,
    applyCoupon?: AppliedCouponDTO,
    transaction?: Transaction
  ): Promise<OrderDataDTO> {
    try {
      //Checking the given cart id is exist or not
      const cart = await this.cartBaseService.findById(orderData.cartId);
      if (!cart) {
        const errorMessage = `The Cart with ID ${orderData.cartId} not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      //Cheecking the cart id has cart items
      const cartItemIds = await this.cartItemsBaseService.findAll({
        where: { cartId: cart?.dataValues.id },
      });

      if (cartItemIds.length <= 0) {
        const errorMessage = `Cart Items with Cart Id ${orderData.cartId} not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // fetching program ids from cart items
      const programIds = cartItemIds
        .map((cartItem) => cartItem.dataValues.eventId)
        .filter((eventId) => eventId !== undefined);

      // Checking the programs have seats
      const seatAvailabilityList =
        await this.eventParticipantEntryBaseService.findAll({
          where: {
            eventId: {
              [Op.in]: programIds,
            },
          },
        });

        // checking the selected programs already started or not
        for (const programId of programIds) {
          const program = await this.eventBaseService.findById(programId);
          {
            if (
              program?.dataValues.startTime &&
              program?.dataValues.startTime < new Date()
            ) {
              const errorMessage = `Can't Register Event: ${program.dataValues.name} , Event is already Started.`;
              Logger.error(errorMessage);
              throw new Error(errorMessage);
            }
          }
        }
  
        // Checking each program for available seats
        for (const seatAvailability of seatAvailabilityList) {
        if (
          seatAvailability.dataValues.totalSeat <=
          seatAvailability.dataValues.seatAllocated
        ) {
          const errorMessage = `Sorry, This event is fully booked. Please check other upcoming events`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
      }
      const existingOrder = await this.orderBaseService.findOne({
        where: { parentEventId: cart.dataValues.parentEventId, userId: userId },
      });

      let programTotalPrice: number = 0;
      let addonTotalPrice: number = 0;

      // Ensure cartItemIds is an array and iterate over it
      for (const cartItem of cartItemIds) {
        const totalPrice = Number(cartItem.dataValues.totalPrice);
        // Check if eventId exists and is not null
        if (cartItem.eventId) {
          programTotalPrice += totalPrice || 0;
        } else {
          addonTotalPrice += totalPrice || 0;
        }
      } 
      //Company tax calculation
      let tax=await this.taxCalculation(cart?.dataValues.companyId,cart?.dataValues.finalPrice,transaction );

      let finalPrice: number;

      // If coupon is applied, adjust the finalPrice after tax is calculated
      if (applyCoupon?.data) {
        // Subtract the coupon discount from the final price
        finalPrice = applyCoupon?.data?.total ?? Number(cart?.dataValues.finalPrice) - Number(applyCoupon?.data?.discountAmount);
      } else {
        // No coupon applied, final price includes the tax
        if(!tax.isTaxInclusive)
        finalPrice = Number(cart?.dataValues.finalPrice) + Number((tax.taxAmount).toFixed(2));
        else
        finalPrice = Number((cart?.dataValues.finalPrice).toFixed(2));
      }

      const orderReq = {
        id: existingOrder?.dataValues.id,
        parentEventId: cart?.dataValues.parentEventId,
        userId: userId,
        companyId: cart?.dataValues.companyId ?? 0,
        subTotal: cart?.dataValues.finalPrice ?? 0,
        tax: tax.taxAmount,
        taxInclusive:tax.isTaxInclusive,
        participantTypeId: cart?.dataValues?.participantTypeId,
        couponDeduction: applyCoupon?.data ? 1 : 0,
        paymentStatus: '',
        statusId: enumOrderStatus.PENDING,
        orderDate: new Date(),
        discountAmount: applyCoupon?.data?.discountAmount ?? 0,
        finalPrice: finalPrice,
        addonTotalAmount: addonTotalPrice,
        programTotalAmount: programTotalPrice,
        priceTierDiscount: cart?.dataValues?.priceTierDiscount,
        createdBy: userId,
        modifiedBy: 0,
      };

      // Creating or updating the order
      const orderDetails = await this.orderBaseService.upsert(
        orderReq,
        transaction
      );
      const order = orderDetails[0];

      // Fetch all order items for the given order ID
      const orderItems = await this.OrderItemBaseService.findAll({
        where: { orderId: order.dataValues.id },
      });

      // Delete each order item
      for (const orderItem of orderItems) {
        await this.OrderItemBaseService.delete(orderItem.id);
      }

      // Ensure `cartItemIds` has data before mapping
      if (cartItemIds && cartItemIds.length > 0) {
        const orderItemReqs = cartItemIds.map((cartItem) => ({
          orderId: order.dataValues.id,
          quantity: 1,
          unitPrice: cartItem.dataValues.unitPrice,
          totalPrice: cartItem.dataValues.totalPrice,
          discountAmount: 0,
          finalPrice: 0,
          eventId: cartItem.dataValues.eventId,
          eventAddonId: cartItem.dataValues.eventAddonId,
          eventAddonPropertyId: cartItem.dataValues.eventAddonPropertyId,
          createdBy: userId,
          modifiedBy: 0,
        }));

        // Creating order items in bulk
        await this.OrderItemBaseService.bulkCreate(orderItemReqs, transaction);
      }

      if (existingOrder?.couponDeduction === 0 && applyCoupon?.data) {
        const couponId = applyCoupon.data.coupon.dataValues.id;
        const couponUpdate = {
          timesUsed: applyCoupon.data.coupon.dataValues.timesUsed + 1,
        };
        await this.couponBaseService.update(couponId, couponUpdate);

        // Create entry in coupon usage table
        const couponUsageReq = {
          couponId: applyCoupon.data.coupon.dataValues.id,
          userId: userId,
          eventId: cart?.dataValues.parentEventId ?? 0,
          createdBy: userId,
          modifiedBy: userId,
        };
        await this.couponUsageBaseService.create(couponUsageReq);
      }
      const response = {
        order: order,
        taxPercentage:tax.taxPercentage,
      };
      return response;
    } catch (error) {
      Logger.error('Error createOrder:', error);
      throw error;
    }
  }
  //Method to calculate tax amount 
  async taxCalculation(
    companyId: number,
    totalAmount: number,
    transaction?: Transaction
  ): Promise<{ baseAmount: number; taxAmount: number,isTaxInclusive:number,taxPercentage:number }> {
    try {
      // Fetch the company information, assuming the tax rate is based on the company
      const company = await this.userCompanyBaseService.findOne({
        where: { companyId },
        transaction,
      });
      const companyUserID = company?.dataValues.userId;
  
      let isTaxInclusive = 0; // Flag to indicate if the amount is tax inclusive
      let taxPercentage = 0;
      
      const taxData = await this.taxBaseService.findAll({
        where: { companyId: companyUserID },
        transaction,
      });
      
      if (taxData && taxData.length > 0) {
        isTaxInclusive = taxData[0]?.dataValues.taxInclusive;
        taxPercentage = Number(taxData[0]?.dataValues.taxPercentage);
      }
      
      // Convert taxPercentage to a tax rate (e.g., 10% becomes 0.10)
      const taxRate = taxPercentage / 100;
  
      let baseAmount: number=0;
      let taxAmount: number=0;
  
      if (isNaN(totalAmount) || isNaN(taxRate)) {
        throw new Error("Invalid input: totalAmount or taxRate is not a valid number.");
      }

      if (isTaxInclusive) {
        // Inclusive Calculation: totalAmount includes tax
        baseAmount = Number((totalAmount / (1 + taxRate)).toFixed(2));
        taxAmount = totalAmount - baseAmount;
      } else {
        // Exclusive Calculation: totalAmount is the base amount
        baseAmount = totalAmount;
        taxAmount =   Number((baseAmount * taxRate).toFixed(2));
      }
  
      return { baseAmount, taxAmount,isTaxInclusive,taxPercentage };
    } catch (error) {
      Logger.error('Error in taxCalculation:', error);
      throw error;
    }
  }
  
  

  /**
   * Updates the status of an order in the database.
   *
   * @param {number} orderId - The ID of the order to be updated.
   * @param {UpdateOrderDTO} orderValues - An object containing the new order values, specifically the status.
   * @param {Transaction} [transaction] - Optional Sequelize transaction object for ensuring atomic updates.
   * @returns {Promise<any>} - Returns the updated order data.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  async updateOrder(
    orderId: number,
    orderValues: UpdateOrderDTO,
    transaction?: Transaction
  ): Promise<[number, Order[]]> {
    try {
      const order = await this.getOrderById(orderId);
      if (!order) {
        const errorMessage = `Order with id ${orderId} not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage); // Consider custom error handling
      }

      // Get the status if available
      const status = orderValues.status
        ? await this.orderStatusBaseService.findOne({
            where: { statusName: orderValues.status },
          })
        : null;

      const updateData: UpdateOrderCondition = {};

      // Check and update statusId if the status is provided
      if (orderValues.status) {
        updateData.statusId =
          status?.dataValues.id ?? order.dataValues.statusId; // fallback to current status if not found
      }

      // Check and update paymentStatus if provided
      if (orderValues.paymentStatus) {
        updateData.paymentStatus =
          orderValues.paymentStatus ?? order.dataValues.paymentStatus;
      }

      // Specify the condition for updating the order
      const whereOption = {
        statusId: enumOrderStatus.PENDING, // Ensure this is a valid enum or constant
        id: orderId,
      };

      // Update the order with the data
      const orderData = await this.orderBaseService.updateCustom(
        updateData,
        whereOption,
        undefined,
        transaction
      );

      // Return the updated order data
      return orderData;
    } catch (error) {
      Logger.error('Error updateOrder:', error);
      throw error;
    }
  }

  /**
   * Retrieves a list of orders based on the provided filters, pagination, and sorting options.
   * @param filters - Filters for querying order (e.g., companyId,userId ... )
   * @param limit - Maximum number of results to return (pagination limit)
   * @param offset - Number of results to skip before returning (pagination offset)
   * @param sortBy - Field to sort by
   * @param sortDirection - Direction to sort
   * @returns An object containing the rows of add-ons and the total count of matching records
   */
  async orderList(
    filters: OrderFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Order[]; count: number }> {
    try {
      const orderCondition: WhereOptions<Order> = {};
      if (filters?.startDate && filters?.endDate) {
        orderCondition.orderDate = {
          [Op.gte]: new Date(filters.startDate),
          [Op.lte]: new Date(filters.endDate).setHours(23, 59, 59, 999),
        };
      } else if (filters?.startDate) {
        // Only startDate is provided
        orderCondition.orderDate = { [Op.gte]: new Date(filters.startDate) };
      } else if (filters?.endDate) {
        // Only endDate is provided
        orderCondition.orderDate = {
          [Op.lte]: new Date(filters.endDate).setHours(23, 59, 59, 999),
        };
      }
      if (filters?.orderDate) {
        const startOfDay = new Date(filters.orderDate);
        startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const endOfDay = new Date(filters.orderDate);
        endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

        // Apply the date range filter
        orderCondition.orderDate = {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay,
        };
      }
      if (Utils.isNotUndefined(filters?.companyId)) {
        orderCondition.companyId = filters.companyId;
      }
      if (filters?.userId) {
        orderCondition.userId = filters.userId;
      }
      if (filters?.eventId) {
        orderCondition.parentEventId = filters.eventId;
      }
      if (filters?.couponDeduction) {
        orderCondition.couponDeduction = filters.couponDeduction;
      }
      if (filters?.paymentStatus) {
        orderCondition.paymentStatus = filters.paymentStatus;
      }
      const { count, rows } = await this.orderBaseService.findAndCountAll({
        where: { ...orderCondition },
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });

      return { rows, count };
    } catch (error) {
      Logger.error('Error to list orders:', error);
      throw error;
    }
  }

  /**
   * Retrieves a order by ID. If the order is not found, throws an error.
   * @param id - The ID of the order to retrieve.
   * @returns The order record if found.
   * @throws Error if the order is not found.
   */
  async getOrderOrThrow(id: number): Promise<Order> {
    const order = await this.orderBaseService.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }
}
