import Joi from 'joi';
import {
  AddProgramDTO,
  CreateEventDTO,
  UpdateEventDTO,
  UpdateEventIsPublishedDTO,
  UpdateEventSlugDTO,
} from '../../dtos/event/EventDTO';
import { AppError } from '../../utils/AppError';
import { Logger } from '../../utils/logger';

/**
 * Event Validations
 * @description Joi schema for validating event data.
 */
export const createEventSchema = Joi.object({
  name: Joi.string().max(255).required().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is a required field.',
    'string.max': 'Event name is too long. Maximum length is 100 characters.',
  }),
  title: Joi.string().optional().messages({
    'string.base': 'Title must be a string.',
  }),
  eventClass: Joi.string().optional().messages({
    'string.base': 'Event class must be string',
  }),
  specialtyId: Joi.number().optional().messages({
    'string.base': 'Specialty Id must be a number.',
  }),
meetingUniqueId: Joi.string().optional(),
  isAbstract: Joi.number().optional().messages({
    'string.base': 'Is Abstract must be a number.'
  }),
  abstractDate: Joi.date().optional().messages({
    'string.base': 'Abstract date must be a date.',
  }),
  amount: Joi.number().optional().messages({
    'number.base': 'Amount must be a number.',
  }),
  description: Joi.string().optional().messages({
    'string.base': 'Description must be a string.',
  }),
  startTime: Joi.date().required().messages({
    'date.empty': 'Start Time is required',
    'any.required': 'Start Time is required',
  }),
  registrationDeadline: Joi.date().optional().messages({
    'date.empty': 'Registration deadline is not be empty',
  }),
  endTime: Joi.date().required().messages({
    'date.empty': 'End Time is required',
    'any.required': 'End Time is required',
  }),
  interval: Joi.string().messages({
    'string.base': 'Interval must be a string.',
  }),
  statusId: Joi.number().required().messages({
    'number.empty': 'Status id is required',
    'any.required': 'Status id is required',
  }),
  templateId: Joi.number().optional().messages({
    'number.empty': 'Template id is not be empty',
  }),
  colorId: Joi.number().optional().messages({
    'number.empty': 'Color id is not be empty',
  }),
  url: Joi.string().optional(),
  eventStartTime: Joi.string().optional(),
  eventEndTime: Joi.string().optional(),
  assetId: Joi.string().optional(),
  draftId: Joi.number().optional(),
  contacts: Joi.array()
    .items(
      Joi.object({
        email: Joi.string().email().required().messages({
          'string.empty': 'Email is required.',
          'string.email': 'Email must be a valid email address.',
          'any.required': 'Email is a required field.',
        }),
        phone: Joi.string()
          // .pattern(
          //   /^((\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+1[\-\s]?)?\(?[2-9][0-9]{2}\)?[\-\s]?[2-9][0-9]{2}[\-\s]?[0-9]{4}$)/
          // )
          .required()
          .messages({
            'string.empty': 'Phone is required.',
          //  'string.pattern.base': 'Phone must be a valid phone number.',
            'any.required': 'Phone is a required field.',
          }),
      })
    )
    .optional(),
  venue: Joi.object({
    name: Joi.string().messages({
      'string.base': 'Venue name must be a string.',
    }),
    address: Joi.string().optional().messages({
      'string.base': 'Venue address must be a string.',
    }),
    city: Joi.string().optional().messages({
      'string.base': 'City must be a string.',
    }),
    state: Joi.string().optional().messages({
      'string.base': 'State must be a string.',
    }),
    country: Joi.string().optional().messages({
      'string.base': 'Country must be a string.',
    }),
    postalCode: Joi.string()
      // .pattern(/^.{1,10}$/)
      .optional()
      .messages({
        'string.base': 'Postal code must be a string.',
        'string.pattern.base': 'Postal code must be valid.',
      }),
    totalCapacity: Joi.number().integer().optional().messages({
      'number.base': 'Total capacity must be an integer.',
    }),
    mapUrl: Joi.string().optional().messages({
      'string.base': 'Map URL must be a string.',
    }),
  })
    .optional()
    .messages({
      'object.empty': 'Venue Details is required',
    }),
  programs: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          'string.empty': 'Program name is required.',
          'any.required': 'Program name is a required field.',
        }),
        title: Joi.string().optional().messages({
          'string.base': 'Program title must be a string.',
        }),
        amount: Joi.number().required().messages({
          'number.empty': 'Program amount is required.',
          'any.required': 'Program amount is a required field.',
        }),
        description: Joi.string().optional().messages({
          'string.base': 'Program description must be a string.',
        }),
        startTime: Joi.date().required().messages({
          'date.empty': 'Program start Time is required',
          'any.required': 'Program start Time is required',
        }),
        endTime: Joi.date().required().messages({
          'date.empty': 'Program end Time is required',
          'any.required': 'Program end Time is required',
        }),
        interval: Joi.string().messages({
          'string.base': 'Program interval must be a string.',
        }),
        statusId: Joi.number().required().messages({
          'number.empty': 'Program status id is required',
          'any.required': 'Program status id is required',
        }),
        url: Joi.string().optional(),
        eventClass: Joi.string().optional().messages({
          'string.base': 'Event class must be a string',
        }),
        assetId: Joi.string().optional(),
        totalSeat: Joi.number().optional(),
        seatAllocated: Joi.number().optional(),
        hall: Joi.string().optional(),
        speaker: Joi.array()
          .items(
            Joi.object({
              speakerId: Joi.number().required().messages({
                'number.empty': 'Speaker Id is a required field.',
                'any.required': 'Speaker Id is a required field.',
              }),
              speakerFileId: Joi.number().optional(),
              isModerator: Joi.boolean().optional(),
            })
          )
          .optional(),
          sponsors: Joi.array()
          .items(
            Joi.object({
              sponsorId: Joi.number().required().messages({
                'number.base': 'Sponsor ID must be a number.',
                'any.required': 'Sponsor ID is a required field.',
              }),
              parentEventId: Joi.number().optional(),
              eventId: Joi.number().optional(),
              reservedSeats: Joi.number().optional(),
              sponsorTypeId: Joi.number().optional(),
              createdBy: Joi.number().optional()
            })
          )
          .optional()
      })
    )
    .optional(),
  addons: Joi.array()
    .items(
      Joi.object({
        addonId: Joi.number().required().messages({
          'number.empty': 'Addon Id is required',
          'any.required': 'Addon Id is required',
        }),
        description: Joi.string().optional(),
        amount: Joi.number().optional().messages({
          'number.empty': 'Addon amount must be number',
        }),
        startTime: Joi.date().optional().messages({
          'date.empty': 'Addon start Time for is required',
          'any.required': 'Addon start Time is required',
        }),
        endTime: Joi.date().optional().messages({
          'date.empty': 'Addon end Time is required',
          'any.required': 'Addon end Time is required',
        }),
        tier: Joi.string().optional().messages({
          'string.base': 'Addon tier must be a string.',
        }),
        properties: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required().messages({
                'string.empty': 'Addon Property Name is required',
                'any.required': 'Addon Property Name is required',
              }),
              amount: Joi.number().required().messages({
                'number.empty': 'Addon Property Amount is required',
                'any.required': 'Addon Property Amount is required',
              }),
              description: Joi.string().optional().messages({
                'string.base':
                  'Property description must be a string if provided.',
              }),
              enabled: Joi.number().optional().messages({
                'number.base': 'Enabled status must be a number if provided.',
              }),
              assetId: Joi.string().optional().messages({
                'string.base': 'Asset ID must be a string.',
                'any.required': 'Asset ID is required.',
              }),
            })
          )
          .optional(),
        sponsors: Joi.array()
          .items(
            Joi.object({
              sponsorId: Joi.number().required().messages({
                'number.base': 'Sponsor ID must be a number.',
                'any.required': 'Sponsor ID is a required field.',
              }),
              eventId: Joi.number().optional(),
              parentEventId: Joi.number().optional(),
              eventAddonId: Joi.number().optional(),
              sponsorTypeId: Joi.number().optional(),
              eventAddonPropertyId: Joi.number().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export const listEventSchema = Joi.object({
  name: Joi.string().optional(),
  title: Joi.string().optional(),
  amount: Joi.number().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  eventClass: Joi.string().optional(),
});
/**
 * @function validateEvent
 * @description Validates Event data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateEvent = (
  data: CreateEventDTO,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateUser
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validation::', err); // Log any unexpected errors during validation
    throw new AppError('An unexpected error occurred during validation', 500); // Handle the error appropriately
  }
};

/**
 * Joi schema for validating the event creation form.
 * This schema enforces required fields and data structure for creating a new event.
 */
export const createEventFormSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id is required',
    'any.required': 'Event id is required',
  }),
  formData: Joi.array()
    .items(
      Joi.object({
        participantTypeId: Joi.number().optional().messages({
          'number.empty': 'Participant Type id is required',
          'any.required': 'Participant Type id is required',
        }),
        data: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().optional(),
              metadata: Joi.string().required().messages({
                'string.empty': 'Metadata is required',
                'any.required': 'Metadata is required',
              }),
            })
          )
          .required()
          .messages({
            'array.base': 'Data must be an array',
            'any.required': 'Data is required',
          }),
      })
    )
    .required()
    .messages({
      'array.base': 'FormData must be an array',
      'any.required': 'FormData is required',
    }),
});

export const updateEventIsPublishedSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'eventId cannot be empty.',
    'any.required': 'eventId is required.',
  }),
});

export const validateisPublished = (
  data: UpdateEventIsPublishedDTO,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateUser
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validation::', err); // Log any unexpected errors during validation
    throw new AppError('An unexpected error occurred during validation', 500); // Handle the error appropriately
  }
};

export const updateEventSlugSchema = Joi.object({
  slugName: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .required()
    .messages({
      'string.pattern.base':
        'slugName must only contain letters, numbers, hyphens, and underscores.',
      'any.required': 'slugName is required.',
    }),
  eventId: Joi.number().required().messages({
    'number.empty': 'eventId cannot be empty.',
    'any.required': 'eventId is required.',
  }),
});

export const validateSlug = (
  data: UpdateEventSlugDTO,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateUser
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validation::', err); // Log any unexpected errors during validation
    throw new AppError('An unexpected error occurred during validation', 500); // Handle the error appropriately
  }
};

/**
 * Joi schema for validating the slug name availability.
 */
export const checkSlugnameAvailableSchema = Joi.object({
  slugName: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .required()
    .messages({
      'string.pattern.base':
        'slugName must only contain letters, numbers, hyphens, and underscores.',
      'any.required': 'slugName is required.',
    }),
  eventId: Joi.number().optional(),
});

/**
 * Joi schema for validating the slug name generate.
 */
export const generateEventSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'eventId cannot be empty.',
    'any.required': 'eventId is required.',
  }),
});

/**
 * Event Validations
 * @description Joi schema for validating event data.
 */
export const updateEventSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  startTime: Joi.date().optional(),
  endTime: Joi.date().optional(),
  eventStartTime: Joi.string().optional(),
  eventEndTime: Joi.string().optional(),
  slugName: Joi.string().optional(),
  eventClass: Joi.string().optional(),
  amount: Joi.number().optional(),
  assetId: Joi.string().optional(),
  url: Joi.string().optional(),
  hall: Joi.string().optional(),
  specialtyId: Joi.number().optional(),
  isAbstract: Joi.number().optional(),
  abstractDate: Joi.date().optional(),
  totalSeat: Joi.number().optional(),
  seatAllocated: Joi.number().optional(),
  participantTypeId: Joi.number().optional(),
  venue: Joi.object({
    name: Joi.string().optional().messages({
      'string.base': 'Venue name must be a string.',
    }),
    address: Joi.string().optional().messages({
      'string.base': 'Venue address must be a string.',
    }),
    city: Joi.string().optional().messages({
      'string.base': 'City must be a string.',
    }),
    state: Joi.string().optional().messages({
      'string.base': 'State must be a string.',
    }),
    country: Joi.string().optional().messages({
      'string.base': 'Country must be a string.',
    }),
    postalCode: Joi.string()
      // .pattern(/^.{1,10}$/)
      .optional()
      .messages({
        'string.base': 'Postal code must be a string.',
        'string.pattern.base': 'Postal code must be valid.',
      }),
    totalCapacity: Joi.number().integer().optional().messages({
      'number.base': 'Total capacity must be an integer.',
    }),
    mapUrl: Joi.string().optional().messages({
      'string.base': 'Map URL must be a string.',
    }),
  })
    .optional()
    .messages({
      'object.empty': 'Venue Details is required',
    }),
  contacts: Joi.array()
    .items(
      Joi.object({
        email: Joi.string().email().optional().messages({
          'string.email': 'Email must be a valid email address.',
        }),
        phone: Joi.string()
          // .pattern(
          //   /^((\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+1[\-\s]?)?\(?[2-9][0-9]{2}\)?[\-\s]?[2-9][0-9]{2}[\-\s]?[0-9]{4}$)/
          // )
          .optional()
          .messages({
            'string.pattern.base': 'Phone must be a valid phone number.',
          }),
      })
    )
    .optional()
    .default([]),
    speakers: Joi.array()
    .items(
      Joi.object({
        speakerId: Joi.number().required().messages({
          'number.empty': 'Speaker Id is a required field.',
          'any.required': 'Speaker Id is a required field.',
        }),
        speakerFileId: Joi.number().optional(),
        designation: Joi.string().optional(),
        isModerator: Joi.boolean().optional(),
      })
    )
    .optional(),
    sponsors: Joi.array()
    .items(
      Joi.object({
        sponsorId: Joi.number().required().messages({
          'number.base': 'Sponsor ID must be a number.',
          'any.required': 'Sponsor ID is a required field.',
        }),
        parentEventId: Joi.number().optional(),
        eventId: Joi.number().optional(),
        reservedSeats: Joi.number().optional(),
        sponsorTypeId: Joi.number().optional(),
        createdBy: Joi.number().optional()
      })
    )
    .optional()
});
/**
 * @function validateUpdateEvent
 * @description Validates Event data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateUpdateEvent = (
  data: UpdateEventDTO,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateUser
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validation::', err); // Log any unexpected errors during validation
    throw new AppError('An unexpected error occurred during validation', 500); // Handle the error appropriately
  }
};

export const addProgramSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is a required field.',
  }),
  title: Joi.string().optional(),
  amount: Joi.number().optional(),
  description: Joi.string().optional(),
  startTime: Joi.date().required().messages({
    'date.empty': 'Start Time is required',
    'any.required': 'Start Time is required',
  }),
  registrationDeadline: Joi.date().optional().messages({
    'date.empty': 'Registration deadline is not be empty',
  }),
  endTime: Joi.date().required().messages({
    'date.empty': 'End Time is required',
    'any.required': 'End Time is required',
  }),
  url: Joi.string().optional(),
  hall: Joi.string().optional(),
  interval: Joi.string(),
  statusId: Joi.number().optional().messages({
    'number.empty': 'Status id is required',
    'any.required': 'Status id is required',
  }),
  venueId: Joi.number().optional(),
  // parentId: Joi.number().required().messages({
  //   'number.empty': 'Parent id is required',
  //   'any.required': 'Parent id is required',
  // }),
  parentEventId: Joi.number().required().messages({
    'number.empty': 'Parent Event id is required',
    'any.required': 'Parent Event id is required',
  }),
  seatAllocated: Joi.number().optional(),
  totalSeat: Joi.number().optional(),
  speakers: Joi.array()
  .items(
    Joi.object({
      speakerId: Joi.number().required().messages({
        'number.empty': 'Speaker Id is a required field.',
        'any.required': 'Speaker Id is a required field.',
      }),
      speakerFileId: Joi.number().optional(),
      isModerator: Joi.optional(),
      designation: Joi.string().optional(),
    })
  )
  .optional(),
  sponsors: Joi.array()
  .items(
    Joi.object({
      sponsorId: Joi.number().required().messages({
        'number.base': 'Sponsor ID must be a number.',
        'any.required': 'Sponsor ID is a required field.',
      }),
      parentEventId: Joi.number().required().messages({
        'number.base': 'Parent Event ID must be a number.',
        'any.required': 'Parent Event ID is a required field.',
      }),
      eventId: Joi.number().optional(),
      reservedSeats: Joi.number().optional(),
      sponsorTypeId: Joi.number().optional(),
      createdBy: Joi.number().optional()
    })
  )
  .optional()
});

export const validateProgram = (
  data: AddProgramDTO,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateUser
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validation::', err); // Log any unexpected errors during validation
    throw new AppError('An unexpected error occurred during validation', 500); // Handle the error appropriately
  }
};

export const addEventAddonSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.base': 'Event ID must be a number.',
    'any.required': 'Event ID is a required field.',
  }),
  addons: Joi.array()
    .items(
      Joi.object({
        addonId: Joi.number().required().messages({
          'number.base': 'Addon ID must be a number.',
          'any.required': 'Addon ID is a required field.',
        }),
        amount: Joi.number().optional().messages({
          'number.base': 'Amount must be a number.',
        }),
        startTime: Joi.date().optional().messages({
          'date.base': 'Start Time must be a valid date.',
        }),
        endTime: Joi.date().greater(Joi.ref('startTime')).optional().messages({
          'date.base': 'End Time must be a valid date.',
          'date.greater': 'End Time must be greater than or equal to Start Time.',
        }),
        tier: Joi.string().optional().messages({
          'string.base': 'Tier must be a string if provided.',
        }),
        description: Joi.string().optional().messages({
          'string.base': 'Description must be a string if provided.',
        }),
        sponsors: Joi.array().items(
          Joi.object({
            sponsorId: Joi.number().required().messages({
              'number.empty': 'Sponsor Id is required',
              'any.required': 'Sponsor Id is required',
            }),
            sponsorTypeId: Joi.number().optional(),
          })
        ).optional(),
        properties: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required().messages({
                'string.base': 'Property name must be a string.',
                'any.required': 'Property name is required.',
              }),
              amount: Joi.number().required().messages({
                'number.base': 'Property amount must be a number.',
                'any.required': 'Property amount is required.',
              }),
              description: Joi.string().optional().messages({
                'string.base': 'Property description must be a string if provided.',
              }),
              enabled: Joi.number().optional().messages({
                'number.base': 'Enabled status must be a number if provided.',
              }),
              assetId: Joi.string().optional().messages({
                'string.base': 'Asset ID must be a string.',
              }),
            })
          )
          .optional(),
      })
    )
    .required()
    .messages({
      'array.base': 'Addons must be an array of addon objects.',
      'any.required': 'Addons are required.',
    }),
});

/**
 * Validator For Update Addon
 */
export const updateEventAddonSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.base': 'Event ID must be a number.',
    'any.required': 'Event ID is a required field.',
  }),
  addonId: Joi.number().required().messages({
    'number.base': 'Addon ID must be a number.',
    'any.required': 'Addon ID is a required field.',
  }),
  amount: Joi.number().optional().messages({
    'number.base': 'Amount must be a number.',
    'any.required': 'Amount is required.',
  }),
  startTime: Joi.date().optional().messages({
    'date.base': 'Start Time must be a valid date.',
    'any.required': 'Start Time is required.',
  }),
  endTime: Joi.date().greater(Joi.ref('startTime')).optional().messages({
    'date.base': 'End Time must be a valid date.',
    'date.greater': 'End Time must be greater than or equal to Start Time.',
  }),
  tier: Joi.string().optional().messages({
    'string.base': 'Tier must be a string if provided.',
  }),
  description: Joi.string().optional().messages({
    'string.base': 'Description must be a string if provided.',
  }),
  sponsors: Joi.array().items(
    Joi.object({
      sponsorId: Joi.number().required().messages({
        'number.empty': 'Sponsor Id is required',
        'any.required': 'Sponsor Id is required',
      }),
      sponsorTypeId: Joi.number().optional(),
    })
  ).optional(),
  properties: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          'string.base': 'Property name must be a string.',
          'any.required': 'Property name is required.',
        }),
        amount: Joi.number().required().messages({
          'number.base': 'Property amount must be a number.',
          'any.required': 'Property amount is required.',
        }),
        description: Joi.string().optional().messages({
          'string.base': 'Property description must be a string if provided.',
        }),
        enabled: Joi.number().optional().messages({
          'number.base': 'Enabled status must be a number if provided.',
        }),
        assetId: Joi.string().optional().messages({
          'string.base': 'Asset ID must be a string.',
          'any.required': 'Asset ID is required.',
        }),
      })
    )
    .optional()
});


/**
 * Joi schema for validating event template data.
 * @description Schema to validate the template ID when adding an event template.
 */
export const addEventTemplateSchema = Joi.object({
  templateId: Joi.number().required().messages({
    'number.base': 'Template ID must be a number.',
    'any.required': 'Template ID is a required field.',
  }),
  colorId: Joi.string().optional().messages({
    'number.base': 'Color ID must be a number.',
    'any.required': 'Color ID is a required field.',
  }),
});
