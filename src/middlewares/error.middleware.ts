import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@utils/response';
import { ZodError } from 'zod';
import { AppError } from '@utils/apperror';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const errorMessageStrings: string[] = err.errors.flatMap((err) => `${err.message}`);
    return sendResponse(res, 400, false, {}, 'Validation Failed', errorMessageStrings);
  }
  if (err instanceof AppError) {
    return sendResponse(res, err.status, false, {}, err.message, err.errors || null);
  }
  return sendResponse(
    res,
    err.status || 500,
    false,
    {},
    err.message || 'Something went wrong',
    null,
  );
};
