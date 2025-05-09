/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@utils/response';
import { ZodError } from 'zod';
import { AppError } from '@utils/apperror';
import logger from '@utils/logger';

export const globalErrorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    const errorMessageStrings: string[] = err.errors.flatMap((err) => `${err.message}`);
    logger.error(
      {},
      `Validation error:  =>  ${JSON.stringify(errorMessageStrings)} \non  path:  =>  ${req.path}`,
    );
    return sendResponse(res, 400, false, {}, 'Validation Failed', null, errorMessageStrings);
  }
  if (err instanceof AppError) {
    logger.error({}, `Error:  =>  ${err.message} \non path:  =>  ${req.path}`);
    return sendResponse(res, err.status, false, {}, err.message, null, err.errors || null);
  }
  logger.error({}, `Error:  =>  ${err.message} \non path:  =>  ${req.path}`);
  return sendResponse(
    res,
    err.status || 500,
    false,
    {},
    err.message || 'Something went wrong',
    null,
    null,
  );
};
