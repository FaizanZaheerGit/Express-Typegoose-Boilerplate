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
import { RoleController } from '@roles/controllers/role.controller';
import { rbacGuard } from '@middlewares/rbac.middleware';
import { PermissionEnums } from '@enums/permissions.enum';
import { RoleRepository } from '@roles/repositories/role.repository';
import { IRoleRepository } from '@roles/interfaces/role.repository.interface';
import { RoleService } from '@roles/services/role.service';

const roleRouter: Router = Router();
const roleRepository: IRoleRepository = new RoleRepository();
const roleService: RoleService = new RoleService(roleRepository);
const roleController: RoleController = new RoleController(roleService);

roleRouter.post(
  '/',
  [authGuard, rbacGuard([PermissionEnums.CREATE_ROLES]), validate({ body: createRoleSchema })],
  roleController.createRole.bind(roleController),
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
  roleController.readRoles.bind(roleController),
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
  roleController.readPaginatedRoles.bind(roleController),
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
  roleController.readRoleById.bind(roleController),
);

roleRouter.put(
  '/:id',
  [
    authGuard,
    rbacGuard([PermissionEnums.EDIT_ROLES]),
    validate({ params: idParamSchema, body: updateRoleSchema }),
  ],
  roleController.updateRole.bind(roleController),
);

roleRouter.delete(
  '/:id',
  [authGuard, rbacGuard([PermissionEnums.DELETE_ROLES]), validate({ params: idParamSchema })],
  roleController.deleteRole.bind(roleController),
);

export default roleRouter;
