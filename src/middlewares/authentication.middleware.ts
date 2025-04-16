import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '@utils/response';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) {
      return sendResponse(res, 401, false, {}, 'Unauthorized', [
        info?.message || 'Authentication failed',
      ]);
    }
    req.user = user;
    next();
  })(req, res, next);
};
