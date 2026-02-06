/**
 * @author saneeshiv
 * @class CartService
 * @description Service class for handling CRUD operations related to the Cart model.
 */

import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  EventAddonProperty,
  Cart,
  CartItem,
  Event,
  EventAddon,
  CartCreationAttributes,
  Addon,
  EventPriceTier,
} from '../models/init-models';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { enumCartStatus, enumEventStatus } from '../utils/enum';
import {
  CartDetailResponse,
  CreateCartDTO,
  UpdateCartDTO,
} from '../dtos/cart/CartDTO';

export class CartService {
  private eventBaseService: BaseService<Event>;
  private eventAddonBaseService: BaseService<EventAddon>;
  private cartBaseService: BaseService<Cart>;
  private cartItemBaseService: BaseService<CartItem>;
  private addonPropertyBaseService: BaseService<EventAddonProperty>;
  private priceTierBaseService: BaseService<EventPriceTier>;

  constructor() {
    this.cartBaseService = new BaseService(
      Cart as unknown as { new (): Cart } & typeof Cart
    );
    this.cartItemBaseService = new BaseService(
      CartItem as unknown as {
        new (): CartItem;
      } & typeof CartItem
    );
    this.eventBaseService = new BaseService(
      Event as unknown as {
        new (): Event;
      } & typeof Event
    );
    this.eventAddonBaseService = new BaseService(
      EventAddon as unknown as {
        new (): EventAddon;
      } & typeof EventAddon
    );
    this.addonPropertyBaseService = new BaseService(
      EventAddonProperty as unknown as {
        new (): EventAddonProperty;
      } & typeof EventAddonProperty
    );
    this.priceTierBaseService = new BaseService(
      EventPriceTier as unknown as {
        new (): EventPriceTier;
      } & typeof EventPriceTier
    );
  }

  /**
   * Retrieves an cart by its ID.
   * @param id - The ID of the cart to retrieve.
   * @param userId - Optional user ID to filter carts by.
   * @param {string} sessionId - The session ID of the guest cart.
   * @param transaction - Optional transaction object for database operations.
   * @returns A promise that resolves to the Cart record, or null if not found.
   */
  async getCartById(
    id: number,
    userId?: number,
    sessionId?: string,
    transaction?: Transaction
  ): Promise<CartDetailResponse | null> {
    try {
      const exclude = ['modifiedOn', 'modifiedBy', 'createdBy', 'createdOn'];
      const whereCondition: WhereOptions = {
        id,
      };

      if (userId) {
        whereCondition.userId = userId;
      } else if (sessionId) {
        whereCondition.sessionId = sessionId;
      }
      if (!userId && !sessionId) {
        return null;
      }
      const cart = await this.cartBaseService.findOne(
        {
          where: whereCondition,
          include: [
            {
              model: Event,
              as: 'parentEvent',
              attributes: {
                exclude,
              },
            },
            {
              model: CartItem,
              as: 'cartItems',
              attributes: {
                exclude,
              },
              include: [
                {
                  model: Event,
                  as: 'event',
                  attributes: {
                    exclude,
                  },
                },
                {
                  model: EventAddon,
                  as: 'eventAddon',
                  attributes: {
                    exclude,
                  },
                  include: [
                    {
                      model: Addon,
                      as: 'addon',
                      attributes: {
                        exclude,
                      },
                    },
                  ],
                },
                {
                  model: EventAddonProperty,
                  as: 'eventAddonProperty',
                  attributes: {
                    exclude,
                  },
                },
              ],
            },
          ],
        },
        transaction
      );

      // Initialize totals
      let programTotal: number = 0.0;
      let addonTotal: number = 0.0;

      // Calculate totals
      if (cart?.cartItems) {
        cart.cartItems.forEach((item: CartItem) => {
          const hasEvent = !!item.eventId;
          const hasAddon = !!item.eventAddonId;

          if (hasEvent && !hasAddon) {
            // Add amount to programTotal
            programTotal += Number(item.dataValues.totalPrice);
          }
          if (!hasEvent && hasAddon) {
            // Add amount to addonTotal
            addonTotal += Number(item.dataValues.totalPrice);
          }
        });
      }
      const response = {
        cart: cart,
        eventAmount: cart?.parentEvent.amount ?? 0,
        programTotal: programTotal.toFixed(2),
        addonTotal: addonTotal.toFixed(2),
        priceTierDiscount: cart?.dataValues.priceTierDiscount ?? 0,
      };
      return response;
    } catch (error) {
      Logger.error('Error getCartById:', error);
      throw error;
    }
  }

  /**
   * Creates a cart with associated programs and addons.
   *
   * @param {number} userId - The ID of the user creating the cart.
   * @param {string} sessionId - The session ID of the guest cart.
   * @param {CreateCartDTO} cartData - The data required to create the cart, including event ID, program IDs, and addon IDs.
   * @param {Transaction} [transaction] - The optional Sequelize transaction object.
   * @returns {Promise<Cart>} - Returns the created cart object.
   * @throws {Error} - Throws an error if any event, program, or addon is not found or if any other error occurs during the process.
   */
  async createCart(
    cartData: CreateCartDTO,
    userId?: number,
    sessionId?: string,
    transaction?: Transaction
  ): Promise<Cart | null> {
    try {
      // checking the user has existing cart before creating one.
      const whereCondition: any = {
        statusId: enumCartStatus.ACTIVE,
      };

      if (userId) {
        whereCondition[Op.or] = [{ userId }];
      }
      if (sessionId) {
        if (!whereCondition[Op.or]) {
          whereCondition[Op.or] = [];
        }
        whereCondition[Op.or].push({ sessionId });
      }

      // checking the given event id is exist and not ended.
      const event = await this.eventBaseService.findById(cartData.eventId);
      if (
        !event ||
        (event?.dataValues.endTime && event?.dataValues.endTime < new Date())
      ) {
        const errorMessage = `Event with Id ${cartData.eventId} does not found or this event is already ended.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (cartData.programIds) {
        // checking the selected programs already started or not
        for (const programId of cartData.programIds) {
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
      }

      // Check if the user has an existing cart before creating one
      const existingCart = await this.cartBaseService.findOne({
        where: whereCondition,
      });

      // if user has existing cart then it will update with new data
      if (existingCart) {
        const updateData = {
          statusId: enumCartStatus.ACTIVE,
          eventId: cartData.eventId,
          companyId: event.dataValues.companyId,
          participantTypeId: cartData.participantTypeId,
          programIds: cartData.programIds ?? [],
          addons: cartData.addons,
        };
        // updating cart
        await this.updateCart(
          existingCart.dataValues.id,
          updateData,
          userId,
          sessionId,
          transaction
        );
        return await this.cartBaseService.findById(
          existingCart.dataValues.id,
          undefined,
          transaction
        );
      } else {
        // Fetch the main event data to ensure it exists and is active
        const eventResp = await this.eventBaseService.findOne(
          {
            where: {
              id: cartData.eventId,
              statusId: enumEventStatus.ACTIVE,
            },
          },
          transaction
        );

        // If event not found, throw an error
        if (!eventResp) {
          throw new Error(`Event with ID ${cartData.eventId} not found`);
        }

        // Initialize final price with the main event amount
        let eventFinalPrice: number = Number(
          eventResp?.dataValues.amount ?? '0'
        );

        // Array to hold cart items to be created
        const cartItemsReq = [];

        if (cartData.programIds) {
          // Add selected programs to the cart
          for (const programId of cartData.programIds) {
            // Fetch each program related to the main event
            const programResp = await this.eventBaseService.findOne(
              {
                where: {
                  id: programId,
                  parentId: cartData.eventId,
                  statusId: enumEventStatus.ACTIVE,
                },
              },
              transaction
            );
            // If program not found, throw an error
            if (!programResp) {
              throw new Error(`Event program with ID ${programId} not found`);
            } else {
              // Update the final price by adding the program's amount
              eventFinalPrice =
                eventFinalPrice + Number(programResp.dataValues.amount ?? '0');

              // Prepare the cart item for the program
              cartItemsReq.push({
                cartId: 0, // Placeholder, will be updated after cart creation
                eventId: programId,
                quantity: 1,
                unitPrice: programResp.dataValues.amount,
                totalPrice: programResp.dataValues.amount,
                createdBy: userId ?? 0,
                modifiedBy: 0,
              });
            }
          }
        }

        // Add addons to the cart if provided
        if (cartData.addons && Array.isArray(cartData.addons)) {
          for (const eventAddon of cartData.addons) {
            const eventAddonValue = eventAddon;
            // Fetch addon details
            const addonResp = await this.eventAddonBaseService.findOne(
              {
                where: {
                  id: eventAddonValue.addonId,
                  eventId: cartData.eventId,
                },
              },
              transaction
            );
            // If addon not found, throw an error
            if (!addonResp) {
              throw new Error(
                `Event addon with ID ${eventAddonValue.addonId} not found`
              );
            }
            // Update the final price by adding the addon's amount
            // eventFinalPrice = eventFinalPrice + Number(addonResp.amount ?? '0'); :- Not considering addon price

            // Add addon properties to the cart
            if (
              eventAddonValue.propertyIds &&
              Array.isArray(eventAddonValue.propertyIds)
            ) {
              for (const propertiesId of eventAddonValue.propertyIds) {
                // Fetch each event addon property
                const addonProptResp =
                  await this.addonPropertyBaseService.findOne(
                    {
                      where: {
                        id: propertiesId,
                      },
                    },
                    transaction
                  );
                // If addon property not found, throw an error
                if (!addonProptResp) {
                  throw new Error(
                    `Event addon property with ID ${propertiesId} not found`
                  );
                } else {
                  // Update the final price by adding the addon property’s amount
                  eventFinalPrice =
                    eventFinalPrice + Number(addonProptResp.amount ?? '0');

                  // Prepare the cart item for the addon property
                  cartItemsReq.push({
                    cartId: 0,
                    eventAddonId: eventAddonValue.addonId,
                    eventAddonPropertyId: addonProptResp.dataValues.id,
                    quantity: 1,
                    unitPrice: addonProptResp.amount,
                    totalPrice: addonProptResp.amount,
                    createdBy: userId ?? 0,
                    modifiedBy: 0,
                  });
                }
              }
            } else {
              cartItemsReq.push({
                cartId: 0,
                eventAddonId: eventAddonValue.addonId,
                eventAddonPropertyId: undefined,
                quantity: 1,
                unitPrice: addonResp.amount,
                totalPrice: addonResp.amount,
                createdBy: userId ?? 0,
                modifiedBy: 0,
              });
            }
          }
        }
        // Storing subtotal before applying price tier
        let subTotal = eventFinalPrice;

        // Checking the event has price tier for given participant type
        if (cartData.participantTypeId) {
          const priceTier = await this.priceTierBaseService.findOne({
            where: {
              eventId: cartData.eventId,
              participantTypeId: cartData.participantTypeId,
              startDate: { [Op.lte]: new Date() },
              endDate: { [Op.gte]: new Date() },
            },
          });
          if (
            priceTier &&
            priceTier?.dataValues.percentage &&
            priceTier?.dataValues.percentage > 0
          ) {
            eventFinalPrice =
              eventFinalPrice -
              eventFinalPrice * (priceTier?.dataValues.percentage / 100);
          }
        }
        // price tier discount amount.
        subTotal -= eventFinalPrice;

        // Prepare the main cart entry with calculated final price
        const cartReq = {
          parentEventId: cartData.eventId,
          companyId: eventResp?.dataValues.companyId ?? 0,
          participantTypeId: cartData?.participantTypeId,
          userId: userId,
          sessionId: userId ? undefined : sessionId,
          statusId: enumCartStatus.ACTIVE,
          priceTierDiscount: subTotal,
          finalPrice: eventFinalPrice,
          createdBy: userId ?? 0,
          modifiedBy: 0,
        };

        // Create the cart in the database
        const newCart = await this.cartBaseService.create(cartReq, transaction);

        // Update cartId for each cart item with the newly created cart's ID
        cartItemsReq.forEach((item) => {
          item.cartId = newCart.dataValues.id;
        });

        // Bulk create the cart items in the database
        await this.cartItemBaseService.bulkCreate(cartItemsReq, transaction);
        return newCart;
      }
    } catch (error) {
      Logger.error('Error in createCart:', error);
      throw error;
    }
  }

  /**
   * Creates a cart with associated programs and addons.
   *
   * @param {string} sessionId - The session ID of the guest cart.
   * @param {CreateCartDTO} cartData - The data required to create the cart, including event ID, program IDs, and addon IDs.
   * @param {Transaction} [transaction] - The optional Sequelize transaction object.
   * @returns {Promise<Cart>} - Returns the created cart object.
   * @throws {Error} - Throws an error if any event, program, or addon is not found or if any other error occurs during the process.
   */
  async createGuestCart(
    cartData: CreateCartDTO,
    sessionId?: string,
    transaction?: Transaction
  ): Promise<Cart> {
    try {
      // Fetch the main event data to ensure it exists and is active
      const eventResp = await this.eventBaseService.findOne(
        {
          where: {
            id: cartData.eventId,
            statusId: enumEventStatus.ACTIVE,
          },
        },
        transaction
      );

      // If event not found, throw an error
      if (!eventResp) {
        throw new Error(`Event with ID ${cartData.eventId} not found`);
      }

      // Initialize final price with the main event amount
      let eventFinalPrice: number = Number(eventResp?.dataValues.amount ?? '0');

      // Array to hold cart items to be created
      const cartItemsReq = [];

      if (cartData.programIds) {
        // Add selected programs to the cart
        for (const programId of cartData.programIds) {
          // Fetch each program related to the main event
          const programResp = await this.eventBaseService.findOne(
            {
              where: {
                id: programId,
                parentId: cartData.eventId,
                statusId: enumEventStatus.ACTIVE,
              },
            },
            transaction
          );
          // If program not found, throw an error
          if (!programResp) {
            throw new Error(`Event program with ID ${programId} not found`);
          } else {
            // Update the final price by adding the program's amount
            eventFinalPrice =
              eventFinalPrice + Number(programResp.dataValues.amount ?? '0');

            // Prepare the cart item for the program
            cartItemsReq.push({
              cartId: 0, // Placeholder, will be updated after cart creation
              eventId: programId,
              quantity: 1,
              unitPrice: programResp.dataValues.amount,
              totalPrice: programResp.dataValues.amount,
              createdBy: 0,
              modifiedBy: 0,
            });
          }
        }
      }

      // Add addons to the cart if provided
      if (cartData.addons && Array.isArray(cartData.addons)) {
        const eventAddonValue = cartData.addons[0];
        // Fetch addon details
        const addonResp = await this.eventAddonBaseService.findOne(
          {
            where: {
              id: eventAddonValue.addonId,
              eventId: cartData.eventId,
            },
          },
          transaction
        );
        // If addon not found, throw an error
        if (!addonResp) {
          throw new Error(
            `Event addon with ID ${eventAddonValue.addonId} not found`
          );
        }
        // Update the final price by adding the addon's amount
        eventFinalPrice = eventFinalPrice + Number(addonResp.amount ?? '0');

        // Add addon properties to the cart
        if (
          eventAddonValue.propertyIds &&
          Array.isArray(eventAddonValue.propertyIds)
        ) {
          for (const propertiesId of eventAddonValue.propertyIds) {
            // Fetch each event addon property
            const addonProptResp = await this.addonPropertyBaseService.findOne(
              {
                where: {
                  id: propertiesId,
                },
              },
              transaction
            );
            // If addon property not found, throw an error
            if (!addonProptResp) {
              throw new Error(
                `Event addon property with ID ${propertiesId} not found`
              );
            } else {
              // Update the final price by adding the addon property’s amount
              eventFinalPrice =
                eventFinalPrice + Number(addonProptResp.amount ?? '0');

              // Prepare the cart item for the addon property
              cartItemsReq.push({
                cartId: 0,
                eventAddonId: eventAddonValue.addonId,
                eventAddonPropertyId: addonProptResp.dataValues.id,
                quantity: 1,
                unitPrice: addonProptResp.amount,
                totalPrice: addonProptResp.amount,
                createdBy: 0,
                modifiedBy: 0,
              });
            }
          }
        } else {
          cartItemsReq.push({
            cartId: 0,
            eventAddonId: eventAddonValue.addonId,
            eventAddonPropertyId: undefined,
            quantity: 1,
            unitPrice: addonResp.amount,
            totalPrice: addonResp.amount,
            createdBy: 0,
            modifiedBy: 0,
          });
        }
      }

      // Prepare the main cart entry with calculated final price
      const cartReq: CartCreationAttributes = {
        parentEventId: cartData.eventId,
        companyId: eventResp?.dataValues.companyId ?? 0,
        userId: undefined,
        sessionId: sessionId,
        statusId: enumCartStatus.ACTIVE,
        finalPrice: eventFinalPrice,
        createdBy: 0,
        modifiedBy: 0,
      };

      // Create the cart in the database
      const newCart = await this.cartBaseService.create(cartReq, transaction);

      // Update cartId for each cart item with the newly created cart's ID
      cartItemsReq.forEach((item) => {
        item.cartId = newCart.dataValues.id;
      });

      // Bulk create the cart items in the database
      await this.cartItemBaseService.bulkCreate(cartItemsReq, transaction);
      return newCart;
    } catch (error) {
      Logger.error('Error in createGuestCart:', error);
      throw error;
    }
  }

  /**
   * Assigns a guest cart to a logged-in user by updating the cart's userId.
   * @param userId - The ID of the logged-in user.
   * @param sessionId - The session ID of the guest cart.
   * @param transaction - The Sequelize transaction.
   */
  async assignGuestCartToUser(
    userId: number,
    sessionId: string,
    transaction?: Transaction
  ): Promise<Cart | null> {
    try {
      // Retrieve the guest cart associated with the session ID
      const guestCart = await this.cartBaseService.findOne({
        where: { sessionId },
        transaction,
      });

      if (guestCart) {
        // Assign the cart to the logged-in user by updating the userId
        guestCart.userId = userId;
        guestCart.sessionId = '';
        return await guestCart.save({ transaction });
      }
      return null;
    } catch (error) {
      Logger.error('Error in assignGuestCartToUser:', error);
      throw error;
    }
  }

  /**
   * Updates a user's cart with selected programs, addons, and status, recalculating the total price.
   *
   * This function ensures that the cart belongs to the user, verifies the main event’s status, and
   * validates each program and addon associated with the event before updating the cart. It calculates
   * the final price based on the selected programs and addons, deletes existing cart items, and then
   * recreates them based on the current selection.
   *
   * @param userId - The ID of the user owning the cart.
   * @param cartId - The ID of the cart to update.
   * @param cartData - An object containing the update data, including selected programs, addons, and status.
   * @param transaction - Optional transaction for maintaining atomicity in database operations.
   *
   * @returns A promise that resolves to a tuple where the first element is the number of affected rows
   *          and the second element (optional) is an array of updated cart records.
   *
   * @throws Throws an error if the cart, event, program, or addon does not exist or if the update fails.
   */
  async updateCart(
    cartId: number,
    cartData: UpdateCartDTO,
    userId?: number,
    sessionId?: string,
    transaction?: Transaction
  ): Promise<[number, Cart[] | undefined]> {
    try {
      // Fetch the cartd data to ensure it exists and belongs to the user
      const cartResp = await this.cartBaseService.findOne(
        {
          where: {
            id: cartId,
            ...(userId ? { userId } : { sessionId }),
          },
        },
        transaction
      );
      // If cart not found, throw an error
      if (!cartResp) {
        throw new Error(`Cart with ID ${cartId} not found`);
      }

      // Fetch the main event data to ensure it exists and is active
      const eventResp = await this.eventBaseService.findOne(
        {
          where: {
            id: cartData.eventId,
            statusId: enumEventStatus.ACTIVE,
          },
        },
        transaction
      );
      // If event not found, throw an error
      if (!eventResp) {
        throw new Error(`Event with ID ${cartData.eventId} not found`);
      }

      // Initialize final price with the main event amount
      let eventFinalPrice: number = Number(eventResp?.dataValues.amount ?? '0');

      // Array to hold cart items to be created
      const cartItemsReq = [];

      // Add selected programs to the cart
      for (const programId of cartData.programIds) {
        // Fetch each program related to the main event
        const programResp = await this.eventBaseService.findOne(
          {
            where: {
              id: programId,
              parentId: cartData.eventId,
              statusId: enumEventStatus.ACTIVE,
            },
          },
          transaction
        );
        // If program not found, throw an error
        if (!programResp) {
          throw new Error(`Event program with ID ${programId} not found`);
        } else {
          // Update the final price and prepare the cart item entry
          eventFinalPrice =
            eventFinalPrice + Number(programResp.dataValues.amount ?? '0');

          // Prepare the cart item for the program
          cartItemsReq.push({
            cartId: cartId,
            eventId: programId,
            quantity: 1,
            unitPrice: programResp.dataValues.amount,
            totalPrice: programResp.dataValues.amount,
            createdBy: userId ?? 0,
            modifiedBy: 0,
          });
        }
      }

      // Add addons to the cart if provided
      if (cartData.addons && Array.isArray(cartData.addons)) {
        for (const eventAddon of cartData.addons) {
          const eventAddonValue = eventAddon;
          // Fetch addon details
          const addonResp = await this.eventAddonBaseService.findOne(
            {
              where: {
                id: eventAddonValue.addonId,
                eventId: cartData.eventId,
              },
            },
            transaction
          );
          // If addon not found, throw an error
          if (!addonResp) {
            throw new Error(
              `Event addon with ID ${eventAddonValue.addonId} not found`
            );
          }
          // Update the final price by adding the addon's amount
          // eventFinalPrice = eventFinalPrice + Number(addonResp.amount ?? '0'); :- Not considering addon price

          // Add addon properties to the cart
          if (
            eventAddonValue.propertyIds &&
            Array.isArray(eventAddonValue.propertyIds)
          ) {
            for (const propertiesId of eventAddonValue.propertyIds) {
              // Fetch each addon related to the main event
              const addonProptResp =
                await this.addonPropertyBaseService.findOne(
                  {
                    where: {
                      id: propertiesId,
                    },
                  },
                  transaction
                );
              // If addon property not found, throw an error
              if (!addonProptResp) {
                throw new Error(
                  `Event addon property with ID ${propertiesId} not found`
                );
              } else {
                // Update the final price by adding the addon property’s amount
                eventFinalPrice =
                  eventFinalPrice + Number(addonProptResp.amount ?? '0');

                // Prepare the cart item for the addon property
                cartItemsReq.push({
                  cartId: cartId,
                  eventAddonId: eventAddonValue.addonId,
                  eventAddonPropertyId: addonProptResp.dataValues.id,
                  quantity: 1,
                  unitPrice: addonProptResp.amount,
                  totalPrice: addonProptResp.amount,
                  createdBy: userId ?? 0,
                  modifiedBy: 0,
                });
              }
            }
          } else {
            cartItemsReq.push({
              cartId: cartId,
              eventAddonId: eventAddonValue.addonId,
              eventAddonPropertyId: undefined,
              quantity: 1,
              unitPrice: addonResp.amount,
              totalPrice: addonResp.amount,
              createdBy: userId ?? 0,
              modifiedBy: 0,
            });
          }
        }
      }

      // Storing subtotal before applying price tier
      let subTotal = eventFinalPrice;

      // Checking the event has price tier for given participant type
      if (cartData.participantTypeId) {
        const priceTier = await this.priceTierBaseService.findOne({
          where: {
            eventId: cartData.eventId,
            participantTypeId: cartData.participantTypeId,
            startDate: { [Op.lte]: new Date() },
            endDate: { [Op.gte]: new Date() },
          },
        });
        if (
          priceTier &&
          priceTier?.dataValues.percentage &&
          priceTier?.dataValues.percentage > 0
        ) {
          eventFinalPrice =
            eventFinalPrice -
            eventFinalPrice * (priceTier?.dataValues.percentage / 100);
        }
      }
      // price tier discount amount
      subTotal -= eventFinalPrice;

      // Prepare the main cart entry with calculated final price
      const cartReq = {
        parentEventId: cartData.eventId,
        participantTypeId: cartData.participantTypeId,
        statusId: cartData.statusId,
        priceTierDiscount: subTotal,
        finalPrice: eventFinalPrice,
        modifiedBy: userId ?? 0,
        modifiedOn: new Date(),
      };

      // update the cart in the database
      const updatedCart = await this.cartBaseService.update(
        cartId,
        cartReq,
        undefined,
        transaction
      );

      // delete all the cart item from the database
      await this.cartItemBaseService.deleteCustom(
        {
          cartId: cartId,
        },
        undefined,
        transaction
      );
      // create the cart items in the database
      const updatedCartItems = await this.cartItemBaseService.bulkCreate(
        cartItemsReq,
        transaction
      );
      if (updatedCartItems) {
        updatedCart[0] = 1;
        return updatedCart;
      }
      return updatedCart;
    } catch (error) {
      Logger.error('Error updateCart:', error);
      throw error;
    }
  }
}
