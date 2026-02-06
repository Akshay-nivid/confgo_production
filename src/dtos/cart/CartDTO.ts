import {
  Addon,
  Cart,
  Event,
  EventAddonProperty,
} from '../../models/init-models';
import { ResponseDTO, createResponse } from '../ResponseDTO';

/**
 * Represents the DTO for creating an cart.
 * @interface CreateCartDTO
 */
export interface CreateCartDTO {
  eventId: number;
  participantTypeId?: number;
  programIds?: number[];
  addons?: {
    addonId: number;
    propertyIds: number[];
  }[];
}

/**
 * Represents the response DTO for create cart.
 * @interface createCartResponseDTO
 */
export interface createCartResponseDTO {
  id: number;
  parentEventId?: number;
  companyId: number;
  userId?: number;
  participantTypeId?: number;
  statusId: number;
  finalPrice?: number;
  createdOn?: Date;
  modifiedOn?: Date;
}
/**
 * Represents the response DTO for cart.
 * @interface CartResponseDTO
 */
export interface CartResponseDTO {
  cart: Cart;
  eventAmount: number;
  programTotal: string;
  addonTotal: string;
  priceTierDiscount: number;
  event: Event;
  programs: Event[];
  addons: CartAddonsDTO[];
}

/**
 * Represents the response DTO for updated cart.
 * @interface UpdateCartResponseDTO
 */
export interface UpdateCartResponseDTO {
  cart: Cart;
  event: Event;
  programs: Event[];
  addons: CartAddonsDTO[];
}
export interface CartAddonsDTO {
  id: number;
  eventId: number;
  addonId: number;
  companyId: number;
  amount: number;
  tier?: string;
  startTime?: Date;
  endTime?: Date;
  description?: string;
  addon: Addon;
  eventAddonProperties: EventAddonProperty[];
}

/**
 * Represents the DTO for updating an cart.
 * @interface UpdateCartDTO
 */
export interface UpdateCartDTO {
  statusId: number;
  eventId: number;
  companyId: number;
  programIds: number[];
  participantTypeId?: number;
  addons?: {
    addonId: number;
    propertyIds: number[];
  }[];
}

/**
 * Creates a response DTO for cart creation.
 * @param cart - The cart object to be included in the response.
 * @returns The response DTO.
 */
export const createCartResponse = (
  cartData: Cart
): ResponseDTO<createCartResponseDTO> => {
  const response: createCartResponseDTO = {
    id: cartData.id,
    companyId: cartData.companyId,
    userId: cartData.userId,
    statusId: cartData.statusId,
    parentEventId: cartData.parentEventId,
    participantTypeId: cartData.participantTypeId,
    finalPrice: cartData.finalPrice,
    createdOn: cartData.createdOn ?? undefined,
    modifiedOn: cartData.modifiedOn ?? undefined,
  };

  return createResponse({
    status: 'success',
    message: 'Cart created successfully',
    data: response,
  });
};

export interface CartDetailResponse {
  cart?: Cart | null;
  eventAmount?: number;
  programTotal?: string;
  addonTotal?: string;
  priceTierDiscount?: number;
}
/**
 * Creates a response DTO for cart details.
 * @param {Cart} cartData - The cart data to be transformed.
 * @returns {ResponseDTO<CartResponseDTO>} The formatted response object containing cart details.
 */
export const cartDetailsResponse = (
  cartData: Cart,
  totalAmounts: CartDetailResponse
): ResponseDTO<CartResponseDTO> => {
  // Extract relevant cart details
  const cart = {
    id: cartData.id,
    parentEventId: cartData.parentEventId,
    companyId: cartData.companyId,
    userId: cartData.userId,
    statusId: cartData.statusId,
    finalPrice: cartData.finalPrice,
    createdBy: cartData.createdBy,
    modifiedBy: cartData.modifiedBy,
  } as Cart;
  const eventAmount = totalAmounts.eventAmount ?? 0;
  const programTotal = totalAmounts.programTotal ?? '0.0';
  const addonTotal = totalAmounts.addonTotal ?? '0.0';
  const priceTierDiscount = totalAmounts.priceTierDiscount ?? 0;

  // Extract the parent event associated with the cart
  const event = cartData.parentEvent;
  // Extract programs from the cart items related to the parent event
  const programs = cartData.cartItems
    .filter(
      (cartItem) => cartItem.event && cartItem.event.parentId === event.id
    )
    .map((cartItem) => cartItem.event);
  // Extract addons from the cart items that have an associated eventAddon
  const groupedAddons = cartData.cartItems
    .filter((cartItem) => cartItem.eventAddon)
    .map((cartItem) => {
      const eventAddon = cartItem.eventAddon;
      const properties = cartItem.eventAddonProperty;
      return {
        id: eventAddon.id,
        eventId: eventAddon.eventId,
        addonId: eventAddon.addonId,
        companyId: eventAddon.companyId,
        amount: eventAddon.amount,
        tier: eventAddon.tier,
        startTime: eventAddon.startTime,
        endTime: eventAddon.endTime,
        description: eventAddon.description,
        addon: eventAddon.addon,
        eventAddonProperties: properties,
      };
    });

  const addonMap = new Map<number, CartAddonsDTO>();

  groupedAddons.forEach((addon) => {
    const existingAddon = addonMap.get(addon.id);

    if (existingAddon) {
      // If the addon with this id already exists in the map, add the properties to eventAddonProperties
      existingAddon.eventAddonProperties.push(addon.eventAddonProperties);
    } else {
      // If it doesn't exist, add a new entry to the map
      addonMap.set(addon.id, {
        ...addon,
        eventAddonProperties: Array.isArray(addon.eventAddonProperties)
          ? [...addon.eventAddonProperties]
          : [addon.eventAddonProperties],
      });
    }
  });

  const response: CartResponseDTO = {
    cart,
    eventAmount,
    programTotal,
    addonTotal,
    priceTierDiscount,
    event,
    programs,
    addons: Array.from(addonMap.values()),
  };

  return {
    status: 'success',
    message: 'success',
    data: response,
  };
};

/**
 * Creates a response DTO for cart updation.
 * @param cart - The cart object to be included in the response.
 * @returns The response DTO.
 */
export const updateCartResponse = (
  cartData: Cart
): ResponseDTO<UpdateCartResponseDTO> => {
  // Extract relevant cart details
  const cart = {
    id: cartData.id,
    parentEventId: cartData.parentEventId,
    companyId: cartData.companyId,
    userId: cartData.userId,
    statusId: cartData.statusId,
    finalPrice: cartData.finalPrice,
    createdBy: cartData.createdBy,
    modifiedBy: cartData.modifiedBy,
  } as Cart;

  // Extract the parent event associated with the cart
  const event = cartData.parentEvent;
  // Extract programs from the cart items related to the parent event
  const programs = cartData.cartItems
    .filter(
      (cartItem) => cartItem.event && cartItem.event.parentId === event.id
    )
    .map((cartItem) => cartItem.event); // Extract the programs related to the event
  // Extract addons from the cart items that have an associated eventAddon
  const groupedAddons = cartData.cartItems
    .filter((cartItem) => cartItem.eventAddon)
    .map((cartItem) => {
      const eventAddon = cartItem.eventAddon;
      const properties = cartItem.eventAddonProperty;
      return {
        id: eventAddon.id,
        eventId: eventAddon.eventId,
        addonId: eventAddon.addonId,
        companyId: eventAddon.companyId,
        amount: eventAddon.amount,
        tier: eventAddon.tier,
        startTime: eventAddon.startTime,
        endTime: eventAddon.endTime,
        description: eventAddon.description,
        addon: eventAddon.addon,
        eventAddonProperties: properties,
      };
    });

  const addonMap = new Map<number, CartAddonsDTO>();

  groupedAddons.forEach((addon) => {
    const existingAddon = addonMap.get(addon.id);

    if (existingAddon) {
      // If the addon with this id already exists in the map, add the properties to eventAddonProperties
      existingAddon.eventAddonProperties.push(addon.eventAddonProperties);
    } else {
      // If it doesn't exist, add a new entry to the map
      addonMap.set(addon.id, {
        ...addon,
        eventAddonProperties: Array.isArray(addon.eventAddonProperties)
          ? [...addon.eventAddonProperties]
          : [addon.eventAddonProperties],
      });
    }
  });

  const response: UpdateCartResponseDTO = {
    cart,
    event,
    programs,
    addons: Array.from(addonMap.values()),
  };

  return createResponse({
    status: 'success',
    message: 'Cart updation successfully',
    data: response,
  });
};
