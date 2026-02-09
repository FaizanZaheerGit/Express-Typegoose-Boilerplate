/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@utils/response';
import { UserService } from '@user/services/user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await this.userService.createUser(req.body);
      return sendResponse(res, 201, true, { entity: { _id: newUser['_id'] } }, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async readUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit, ...filterQuery } = req.query;
      const { users, hasNext, nextCursor } = await this.userService.getCursorBasedUsers(
        filterQuery,
        cursor,
        limit,
      );
      return sendResponse(res, 200, true, { entities: users, hasNext, nextCursor }, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async readPaginatedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, ...filterQuery } = req.query;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { users, meta } = await this.userService.getPaginatedUser(page, limit, filterQuery);
      return sendResponse(res, 200, true, { entites: users }, 'SUCCESS', meta);
    } catch (error) {
      next(error);
    }
  }

  public async readUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const existingUser = await this.userService.getUser({ _id: req.params.id });
      return sendResponse(res, 200, true, { entity: existingUser }, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public readCurrentUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      return sendResponse(res, 200, true, { entity: req?.user }, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await this.userService.updateUser(req.params.id as string, req.body);
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

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.deleteUser(req.params.id as string);
      return sendResponse(res, 200, true, {}, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.changePassword(req.body, req.user);
      return sendResponse(res, 200, true, {}, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }
}
