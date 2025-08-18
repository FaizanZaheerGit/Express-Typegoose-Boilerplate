import { Router } from 'express';
import { authGuard } from '@middlewares/authentication.middleware';
import { UserController } from '@user/controllers/user.controller';
import { validate } from '@middlewares/validate.middleware';
import {
  changePasswordSchema,
  createUserSchema,
  getPaginatedUsersSchema,
  getUsersSchema,
  idParamSchema,
  updateUserAdminSchema,
  updateUserSchema,
} from '@user/validators/user.validator';
import { rbacGuard } from '@middlewares/rbac.middleware';
import { PermissionEnums } from '@enums/permissions.enum';
import { onlyAdminGuard } from '@middlewares/admin.middleware';
import { UserService } from '@user/services/user.service';
import { UserRepository } from '@user/repositories/user.repository';
import { IUserRepository } from '@user/interfaces/user.repository.interface';
import { RoleService } from '@roles/services/role.service';
import { RoleRepository } from '@roles/repositories/role.repository';
import { IRoleRepository } from '@roles/interfaces/role.repository.interface';

const userRouter: Router = Router();
const userRepository: IUserRepository = new UserRepository();
const roleRepository: IRoleRepository = new RoleRepository();
const roleService: RoleService = new RoleService(roleRepository);
const userService: UserService = new UserService(userRepository, roleService);
const userController: UserController = new UserController(userService);

userRouter.post(
  '/',
  [authGuard, rbacGuard([PermissionEnums.CREATE_USERS]), validate({ body: createUserSchema })],
  userController.createUser.bind(userController),
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
  userController.readUsers.bind(userController),
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
  userController.readPaginatedUsers.bind(userController),
);

userRouter.get('/me', authGuard, userController.readCurrentUserDetails.bind(userController));

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
  userController.readUserById.bind(userController),
);

userRouter.put(
  '/:id',
  [
    authGuard,
    rbacGuard([PermissionEnums.EDIT_USERS]),
    validate({ params: idParamSchema, body: updateUserSchema }),
  ],
  userController.updateUser.bind(userController),
);

userRouter.put(
  '/admin/:id',
  [authGuard, onlyAdminGuard, validate({ params: idParamSchema, body: updateUserAdminSchema })],
  userController.updateUser.bind(userController),
);

userRouter.delete(
  '/:id',
  rbacGuard([PermissionEnums.DELETE_USERS]),
  [authGuard, validate({ params: idParamSchema })],
  userController.deleteUser.bind(userController),
);

userRouter.patch(
  '/change-password',
  [authGuard, validate({ body: changePasswordSchema })],
  userController.changePassword.bind(userController),
);

export default userRouter;
