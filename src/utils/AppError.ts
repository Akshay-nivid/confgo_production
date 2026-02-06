export class AppError extends Error {
  public statusCode: number; // HTTP status code associated with the error
  public isOperational: boolean; // Indicates whether the error is operational (expected) or not

  /**
   * @author : sarathavs
   * @constructor
   * @description Creates an instance of AppError.
   * @param message - A descriptive error message
   * @param statusCode - HTTP status code for the error (e.g., 404 for not found, 500 for internal server error)
   */
  constructor(message: string, statusCode: number) {
    super(message); // Call the parent class (Error) constructor with the message

    this.statusCode = statusCode;
    this.isOperational = true; // Marks the error as operational, meaning it was anticipated and handled

    // Captures the stack trace for debugging purposes, excluding the constructor from the trace
    Error.captureStackTrace(this, this.constructor);
  }
}
