/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
export class AppError extends Error {
  status: number;
  errors?: any;
  data?: any;

  constructor(message: string, statusCode = 500, errors?: any) {
    super(message);
    this.status = statusCode;
    this.errors = errors;
    if (this.data) {
      this.data = JSON.parse(this.data);
    }
    Error.captureStackTrace(this, this.constructor);
  }
}
