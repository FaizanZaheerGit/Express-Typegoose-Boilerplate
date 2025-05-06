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

const roleRouter: Router = Router();

roleRouter.post('/', [validate({ body: createRoleSchema })], roleController.createRole);

roleRouter.get('/', [authenticate, validate({ query: getRolesSchema })], roleController.readRoles);

roleRouter.get(
  '/paginated',
  [authenticate, validate({ query: getPaginatedRolesSchema })],
  roleController.readPaginatedRoles,
);

roleRouter.get(
  '/:id',
  [authenticate, validate({ params: idParamSchema })],
  roleController.readRoleById,
);

roleRouter.put(
  '/:id',
  [authenticate, validate({ params: idParamSchema, body: updateRoleSchema })],
  roleController.updateRole,
);

roleRouter.delete(
  '/:id',
  [authenticate, validate({ params: idParamSchema })],
  roleController.deleteRole,
);

export default roleRouter;
