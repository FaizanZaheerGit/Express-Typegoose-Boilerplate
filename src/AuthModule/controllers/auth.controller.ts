/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@utils/response';
import * as authService from '@auth/services/auth.service';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, token } = await authService.login(req.body);
    return sendResponse(res, 200, true, { entity: user, token: token }, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export function logout(_req: Request, res: Response, next: NextFunction) {
  try {
    return sendResponse(res, 200, true, {}, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.forgotPassword(req.body);
    return sendResponse(res, 200, true, {}, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.resetPassword(req.body);
    return sendResponse(res, 200, true, {}, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.sendOtp(req.body);
    return sendResponse(res, 200, true, {}, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.verifyOtp(req.body);
    return sendResponse(res, 200, true, {}, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}
