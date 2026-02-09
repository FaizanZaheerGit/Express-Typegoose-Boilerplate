/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@utils/response';
import { RoleService } from '@roles/services/role.service';

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  public async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const newRole = await this.roleService.createRole(req.body);
      return sendResponse(res, 201, true, { entity: { _id: newRole['_id'] } }, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async readRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const { cursor, limit, ...filterQuery } = req.query;
      const { roles, hasNext, nextCursor } = await this.roleService.getCursorBasedRoles(
        filterQuery,
        cursor,
        limit,
      );
      return sendResponse(res, 200, true, { entities: roles, hasNext, nextCursor }, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async readPaginatedRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, ...filterQuery } = req.query;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { roles, meta } = await this.roleService.getPaginatedRole(page, limit, filterQuery);
      return sendResponse(res, 200, true, { entites: roles }, 'SUCCESS', meta);
    } catch (error) {
      next(error);
    }
  }

  public async readRoleById(req: Request, res: Response, next: NextFunction) {
    try {
      const existingRole = await this.roleService.getRole({ _id: req.params.id });
      return sendResponse(res, 200, true, { entity: existingRole }, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }

  public async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedRole = await this.roleService.updateRole(req.params.id as string, req.body);
      return sendResponse(
        res,
        200,
        true,
        { entity: { _id: updatedRole ? updatedRole['_id'] : null } },
        'SUCCESS',
      );
    } catch (error) {
      next(error);
    }
  }

  public async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      await this.roleService.deleteRole(req.params.id as string);
      return sendResponse(res, 200, true, {}, 'SUCCESS');
    } catch (error) {
      next(error);
    }
  }
}
