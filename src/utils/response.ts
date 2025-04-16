import { Response } from 'express';

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  data: any = {},
  message: string,
  error: any = null,
) => {
  res.status(statusCode).json({
    statusCode,
    data,
    message,
    success,
    ...(error ? { error } : {}),
  });
};
