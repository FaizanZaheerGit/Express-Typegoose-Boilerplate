import { Router } from 'express';
import { authenticate } from '@middlewares/authentication.middleware';
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
  [authenticate, rbacGuard([PermissionEnums.CREATE_ROLES]), validate({ body: createRoleSchema })],
  roleController.createRole,
);

roleRouter.get(
  '/',
  [
    authenticate,
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
    authenticate,
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
    authenticate,
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
    authenticate,
    rbacGuard([PermissionEnums.EDIT_ROLES]),
    validate({ params: idParamSchema, body: updateRoleSchema }),
  ],
  roleController.updateRole,
);

roleRouter.delete(
  '/:id',
  [authenticate, rbacGuard([PermissionEnums.DELETE_ROLES]), validate({ params: idParamSchema })],
  roleController.deleteRole,
);

export default roleRouter;
