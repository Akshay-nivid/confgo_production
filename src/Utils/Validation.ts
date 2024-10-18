// src/validations/validation.ts

export const REGEX = {
  PASSWORD_REGEX: /[!@#$%^&*(),.?":{}|<>]/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX_UPP: /[A-Z]/,
};

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
    value: /^\d{10}$/,
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
/**
 * @description: Validate email address
 * @param {message} message - The message to display if the email is invalid (default: Invalid email address)
 *
 */
export const validateEmail = ({ message }: { message?: string }) => {
  return {
    value: REGEX.EMAIL_REGEX,
    message: message || 'Invalid email address',
  };
};

/**
 * @description: Validate required field
 * @param {message} message - The message to display if the field is required (default: Field is required)
 * @param {fieldName} fieldName - The name of the field to display if the field is required (default: Field is required)
 */
export const validateRequiredField = ({
  message,
  fieldName,
}: {
  message?: string;
  fieldName?: string;
}) => {
  return {
    value: true,
    message:
      message || fieldName ? `${fieldName} is required` : 'Field is required',
  };
};

/**
 * @description: Validate password
 * @param {message} message - The message to display if the password is invalid (default: Password must be at least 8 characters long and contain at least 1 special character)
 *
 */
export const validatePassword = ({ message }: { message?: string }) => {
  return {
    value: REGEX.PASSWORD_REGEX,
    message:
      message ||
      'Password must be at least 8 characters long and contain at least 1 special character',
  };
};

/**
 * @description: Validate confirm password
 * @param {message} message - The message to display if the password is invalid (default: Passwords do not match)
 * @param {password} password - The password to validate
 * @param {confirmPassword} confirmPassword - The confirm password to validate
 *
 */
export const validateConfirmPassword = ({
  message,
  password,
  confirmPassword,
}: {
  message?: string;
  password?: string;
  confirmPassword?: string;
}) => {
  return password === confirmPassword || message || 'Passwords do not match';
};

/**
 * @description: Validate minimum length
 * @param {message} message - The message to display if the field is too short (default: Field must be at least ${length} characters long)
 * @param {length} length - The minimum length of the field
 * @param {fieldName} fieldName - The name of the field to display if the field is required (default: Field)
 *
 */
export const validateMinLength = ({
  message,
  minLength,
  fieldName,
}: {
  message?: string;
  minLength: number;
  fieldName?: string;
}) => {
  return {
    value: minLength,
    message:
      message ||
      `${
        fieldName ? fieldName : 'Field'
      } must be at least ${minLength} characters long`,
  };
};
