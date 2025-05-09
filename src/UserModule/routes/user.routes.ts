import { Router } from 'express';
import { authGuard } from '@middlewares/authentication.middleware';
import * as userController from '@user/controllers/user.controller';
import { validate } from '@middlewares/validate.middleware';
import {
  changePasswordSchema,
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
  [authGuard, rbacGuard([PermissionEnums.CREATE_USERS]), validate({ body: createUserSchema })],
  userController.createUser,
);

userRouter.get(
  '/',
  [
    authGuard,
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
    authGuard,
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

userRouter.get('/me', authGuard, userController.readCurrentUserDetails);

userRouter.get(
  '/:id',
  [
    authGuard,
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
    authGuard,
    rbacGuard([PermissionEnums.EDIT_USERS]),
    validate({ params: idParamSchema, body: updateUserSchema }),
  ],
  userController.updateUser,
);

userRouter.delete(
  '/:id',
  rbacGuard([PermissionEnums.DELETE_USERS]),
  [authGuard, validate({ params: idParamSchema })],
  userController.deleteUser,
);

userRouter.patch(
  '/change-password',
  [authGuard, validate({ body: changePasswordSchema })],
  userController.changePassword,
);

export default userRouter;
