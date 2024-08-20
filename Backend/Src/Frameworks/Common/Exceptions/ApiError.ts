class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
  
    constructor(
      statusCode: number,
      message: string,
      isOperational: boolean = true,
      stack?: string
    ) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      // Maintain proper stack trace
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export { ApiError };
  