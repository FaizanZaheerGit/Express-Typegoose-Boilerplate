/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { NextFunction, Request, Response } from 'express';
import { UserTypeEnum } from '@enums/userType.enum';
import { AppError } from '@utils/apperror';
import logger from '@utils/logger';

export const onlyAdminGuard = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const currentUser = req?.user;
    if (currentUser?.userType == UserTypeEnum.ADMIN) {
      return next();
    } else {
      logger.error({}, `Unauthorized Access from only admin guard on PATH:  ${req.path}`);
      throw new AppError(`You are not authorized this action!`, 403);
    }
  } catch (error) {
    next(error);
  }
};
