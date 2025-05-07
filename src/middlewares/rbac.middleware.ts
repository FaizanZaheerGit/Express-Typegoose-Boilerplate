/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { PermissionEnums } from '@enums/permissions.enum';
import { NextFunction, Request, Response } from 'express';
import { UserTypeEnum } from '@enums/userType.enum';
import { AppError } from '@utils/apperror';
import { Role } from '@roles/models/role.model';

export const rbacGuard = (allowedPermissions: PermissionEnums[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = req?.user;
      if (currentUser?.userType == UserTypeEnum.ADMIN) {
        return next();
      } else {
        if (!currentUser?.roles || !currentUser?.roles.length) {
          throw new AppError(`You are not authorized for this action!`, 403);
        }
        const currentUserRights = currentUser?.roles?.flatMap((role: Role) => role.rights);
        if (!currentUserRights || !currentUserRights?.length) {
          throw new AppError(`You are not authorized for this action!`, 403);
        }
        const hasPermission = allowedPermissions.some((permission) =>
          currentUserRights.includes(permission),
        );
        if (!hasPermission) {
          throw new AppError(`You are not authorized this action!`, 403);
        }
      }
      return next();
    } catch (error) {
      next(error);
    }
  };
};
