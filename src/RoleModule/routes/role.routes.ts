import { Router } from 'express';
import { authGuard } from '@middlewares/authentication.middleware';
import { validate } from '@middlewares/validate.middleware';
import {
  createRoleSchema,
  getRolesSchema,
  getPaginatedRolesSchema,
  idParamSchema,
  updateRoleSchema,
} from '@roles/validators/role.validator';
import * as roleController from '@roles/controllers/role.controller';
import { rbacGuard } from '@middlewares/rbac.middleware';
import { PermissionEnums } from '@enums/permissions.enum';

const roleRouter: Router = Router();

roleRouter.post(
  '/',
  [authGuard, rbacGuard([PermissionEnums.CREATE_ROLES]), validate({ body: createRoleSchema })],
  roleController.createRole,
);

roleRouter.get(
  '/',
  [
    authGuard,
    rbacGuard([
      PermissionEnums.CREATE_ROLES,
      PermissionEnums.READ_ROLES,
      PermissionEnums.EDIT_ROLES,
      PermissionEnums.DELETE_ROLES,
    ]),
    validate({ query: getRolesSchema }),
  ],
  roleController.readRoles,
);

roleRouter.get(
  '/paginated',
  [
    authGuard,
    rbacGuard([
      PermissionEnums.CREATE_ROLES,
      PermissionEnums.READ_ROLES,
      PermissionEnums.EDIT_ROLES,
      PermissionEnums.DELETE_ROLES,
    ]),
    validate({ query: getPaginatedRolesSchema }),
  ],
  roleController.readPaginatedRoles,
);

roleRouter.get(
  '/:id',
  [
    authGuard,
    rbacGuard([
      PermissionEnums.CREATE_ROLES,
      PermissionEnums.READ_ROLES,
      PermissionEnums.EDIT_ROLES,
      PermissionEnums.DELETE_ROLES,
    ]),
    validate({ params: idParamSchema }),
  ],
  roleController.readRoleById,
);

roleRouter.put(
  '/:id',
  [
    authGuard,
    rbacGuard([PermissionEnums.EDIT_ROLES]),
    validate({ params: idParamSchema, body: updateRoleSchema }),
  ],
  roleController.updateRole,
);

roleRouter.delete(
  '/:id',
  [authGuard, rbacGuard([PermissionEnums.DELETE_ROLES]), validate({ params: idParamSchema })],
  roleController.deleteRole,
);

export default roleRouter;
