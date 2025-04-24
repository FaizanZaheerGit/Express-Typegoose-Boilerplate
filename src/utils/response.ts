/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { Response } from 'express';

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  data: any = {},
  message: string,
  meta: any = null,
  error: any = null,
) => {
  res.status(statusCode).json({
    statusCode,
    data,
    message,
    success,
    ...(meta ? { meta } : {}),
    ...(error ? { error } : {}),
  });
};
