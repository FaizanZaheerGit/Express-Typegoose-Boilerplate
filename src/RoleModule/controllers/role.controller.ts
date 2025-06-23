/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '@utils/response';
import * as roleService from '@roles/services/role.service';

export async function createRole(req: Request, res: Response, next: NextFunction) {
  try {
    const newRole = await roleService.createRole(req.body);
    return sendResponse(res, 201, true, { entity: { _id: newRole['_id'] } }, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function readRoles(req: Request, res: Response, next: NextFunction) {
  try {
    const { cursor, limit, ...filterQuery } = req.query;
    const { roles, hasNext, nextCursor } = await roleService.getCursorBasedRoles(
      filterQuery,
      cursor,
      limit,
    );
    return sendResponse(res, 200, true, { entities: roles, hasNext, nextCursor }, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function readPaginatedRoles(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, ...filterQuery } = req.query;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { roles, meta } = await roleService.getPaginatedRole(page, limit, filterQuery);
    return sendResponse(res, 200, true, { entites: roles }, 'SUCCESS', meta);
  } catch (error) {
    next(error);
  }
}

export async function readRoleById(req: Request, res: Response, next: NextFunction) {
  try {
    const existingRole = await roleService.getRole({ _id: req.params.id });
    return sendResponse(res, 200, true, { entity: existingRole }, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}

export async function updateRole(req: Request, res: Response, next: NextFunction) {
  try {
    const updatedRole = await roleService.updateRole(req.params.id, req.body);
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

export async function deleteRole(req: Request, res: Response, next: NextFunction) {
  try {
    await roleService.deleteRole(req.params.id);
    return sendResponse(res, 200, true, {}, 'SUCCESS');
  } catch (error) {
    next(error);
  }
}
