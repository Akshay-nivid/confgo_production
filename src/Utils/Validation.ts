// src/validations/validation.ts

export const AUTH_STRINGS = {
    ERRORS: {
        PPI_INVALID_LENGTH: 'Phone number must not exceed 10 characters',
        PPI_INVALID_REGEXP: 'Invalid phone number format',
        PPI_REQUIRED: 'Phone number is required',
        EMAIL_INVALID: 'Email format is invalid',
        // Add more error messages as needed
    },
};

// Phone validation rules
export const phoneRules = {
    required: {
        value: true,
        message: AUTH_STRINGS.ERRORS.PPI_REQUIRED,
    },
    maxLength: {
        value: 10,
        message: AUTH_STRINGS.ERRORS.PPI_INVALID_LENGTH,
    },
    pattern: {
        value: /^\+?[1-9]\d{1,14}$/, // A simple regex for international phone numbers
        message: AUTH_STRINGS.ERRORS.PPI_INVALID_REGEXP,
    },
};

// Email validation rules (example)
export const emailRules = {
    required: {
        value: true,
        message: AUTH_STRINGS.ERRORS.EMAIL_INVALID,
    },
    pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
        message: AUTH_STRINGS.ERRORS.EMAIL_INVALID,
    },
};

// Add more validation rules as needed
