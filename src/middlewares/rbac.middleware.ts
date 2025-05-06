import { NextFunction, Request, Response } from 'express';

export const rbacGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    return '';
  } catch (error) {
    next(error);
  }
};
