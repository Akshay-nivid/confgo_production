
/**
 * @description: Validate email address
 * @param {message} message - The message to display if the email is invalid (default: Invalid email address)
 * 
 */
export const validateEmail = ({message}:{message?: string}) => {
    return {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: message || 'Invalid email address',
    }
};


/**
 * @description: Validate required field
 * @param {message} message - The message to display if the field is required (default: Field is required)
 * @param {fieldName} fieldName - The name of the field to display if the field is required (default: Field is required)
 */
export const validateRequiredField = ({message,fieldName}:{message?: string,fieldName?: string}) => {
    return {
        value: true,
        message: message || fieldName ? `${fieldName} is required` : 'Field is required',
    }
};

/**
 * @description: Validate password
 * @param {message} message - The message to display if the password is invalid (default: Password must be at least 8 characters long and contain at least 1 special character)
 * 
 */
export const validatePassword = ({message}:{message?: string}) => {
    return {
        value:  /[!@#$%^&*(),.?":{}|<>]/,
        message: message || 'Password must be at least 8 characters long and contain at least 1 special character',
    }
};

/**
 * @description: Validate confirm password
 * @param {message} message - The message to display if the password is invalid (default: Passwords do not match)
 * @param {password} password - The password to validate
 * @param {confirmPassword} confirmPassword - The confirm password to validate
 * 
 */
export const validateConfirmPassword = ({message,password,confirmPassword}:{message?: string, password?: string,confirmPassword?: string}) => {
    return password === confirmPassword || message || 'Passwords do not match';
};


/**
 * @description: Validate minimum length
 * @param {message} message - The message to display if the field is too short (default: Field must be at least ${length} characters long)
 * @param {length} length - The minimum length of the field
 * 
 */
export const validateMinLength = ({message,length}:{message?: string,length?: number}) => {
    return {
        value: length,
        message: message || `Field must be at least ${length} characters long`,
    }
};

