import { Router } from 'express';
import { authenticate } from '@middlewares/authentication.middleware';
import * as userController from '@user/controllers/user.controller';
import { validate } from '@middlewares/validate.middleware';
import {
  createUserSchema,
  getPaginatedUsersSchema,
  getUsersSchema,
  idParamSchema,
  updateUserSchema,
} from '@user/validators/user.validator';
import { rbacGuard } from '@middlewares/rbac.middleware';
import { PermissionEnums } from '@enums/permissions.enum';

const userRouter: Router = Router();

userRouter.post(
  '/',
  [authenticate, rbacGuard([PermissionEnums.CREATE_USERS]), validate({ body: createUserSchema })],
  userController.createUser,
);

userRouter.get(
  '/',
  [
    authenticate,
    rbacGuard([
      PermissionEnums.CREATE_USERS,
      PermissionEnums.READ_USERS,
      PermissionEnums.EDIT_USERS,
      PermissionEnums.DELETE_USERS,
    ]),
    validate({ query: getUsersSchema }),
  ],
  userController.readUsers,
);

userRouter.get(
  '/paginated',
  [
    authenticate,
    rbacGuard([
      PermissionEnums.CREATE_USERS,
      PermissionEnums.READ_USERS,
      PermissionEnums.EDIT_USERS,
      PermissionEnums.DELETE_USERS,
    ]),
    validate({ query: getPaginatedUsersSchema }),
  ],
  userController.readPaginatedUsers,
);

userRouter.get('/me', authenticate, userController.readCurrentUserDetails);

userRouter.get(
  '/:id',
  [
    authenticate,
    rbacGuard([
      PermissionEnums.CREATE_USERS,
      PermissionEnums.READ_USERS,
      PermissionEnums.EDIT_USERS,
      PermissionEnums.DELETE_USERS,
    ]),
    validate({ params: idParamSchema }),
  ],
  userController.readUserById,
);

userRouter.put(
  '/:id',
  [
    authenticate,
    rbacGuard([PermissionEnums.EDIT_USERS]),
    validate({ params: idParamSchema, body: updateUserSchema }),
  ],
  userController.updateUser,
);

userRouter.delete(
  '/:id',
  rbacGuard([PermissionEnums.DELETE_USERS]),
  [authenticate, validate({ params: idParamSchema })],
  userController.deleteUser,
);

export default userRouter;
