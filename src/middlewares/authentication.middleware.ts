/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '@utils/response';
import logger from '@utils/logger';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) {
      logger.error({}, `Unauthorized Access from Auth Guard on PATH:  ${req.path}`);
      return sendResponse(res, 401, false, {}, 'Unauthorized', null, [
        info?.message || 'Authentication failed',
      ]);
    }
    req.user = user;
    next();
  })(req, res, next);
};
