/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@utils/response';
import { AuthService } from '@auth/services/auth.service';

const authService: AuthService = new AuthService();

export class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.login(req.body);
      return sendResponse(res, 200, true, { entity: user, token: token }, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public logout(req: Request, res: Response, next: NextFunction) {
    try {
      return sendResponse(res, 200, true, {}, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body);
      return sendResponse(res, 200, true, {}, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body);
      return sendResponse(res, 200, true, {}, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.sendOtp(req.body);
      return sendResponse(res, 200, true, {}, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }
  public async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.verifyOtp(req.body);
      return sendResponse(res, 200, true, {}, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }
}
