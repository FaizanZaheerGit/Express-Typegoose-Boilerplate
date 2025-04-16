import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@utils/response';
import * as userService from '@user/services/user.service';

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const newUser = await userService.createUser(req.body);
    return sendResponse(res, 201, true, { entity: { _id: newUser['_id'] } }, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function readUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getUsers(req.query);
    return sendResponse(res, 200, true, { entities: users }, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function readUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const existingUser = await userService.getUser({ _id: req.params.id });
    return sendResponse(res, 200, true, { entity: existingUser }, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function readCurrentUserDetails(req: Request, res: Response, next: NextFunction) {
  try {
    return sendResponse(res, 200, true, { entity: req?.user }, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    return sendResponse(
      res,
      200,
      true,
      { entity: { _id: updatedUser ? updatedUser['_id'] : null } },
      'SUCCESS',
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.deleteUser(req.params.id);
    return sendResponse(res, 200, true, {}, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}
