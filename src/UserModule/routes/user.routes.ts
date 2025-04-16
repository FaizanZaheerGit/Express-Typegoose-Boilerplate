import { Router } from 'express';
import { authenticate } from '@middlewares/authentication.middleware';
import * as userController from '@user/controllers/user.controller';
import { validate } from '@middlewares/validate.middleware';
import {
  createUserSchema,
  getUsersSchema,
  idParamSchema,
  updateUserSchema,
} from '@user/validators/user.validator';

const userRouter: Router = Router();

userRouter.post('/', [validate({ body: createUserSchema })], userController.createUser);

userRouter.get('/', [authenticate, validate({ query: getUsersSchema })], userController.readUsers);

userRouter.get('/me', authenticate, userController.readCurrentUserDetails);

userRouter.get(
  '/:id',
  [authenticate, validate({ params: idParamSchema })],
  userController.readUserById,
);

userRouter.put(
  '/:id',
  [authenticate, validate({ params: idParamSchema, body: updateUserSchema })],
  userController.updateUser,
);

userRouter.delete(
  '/:id',
  [authenticate, validate({ params: idParamSchema })],
  userController.deleteUser,
);

export default userRouter;
