import { Router } from 'express';
import { validate } from '@middlewares/validate.middleware';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from '@auth/validators/auth.validator';
import { authGuard } from '@middlewares/authentication.middleware';
import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { UserService } from '@user/services/user.service';
import { OtpTokenRepository } from '@auth/repositories/otptokens.repository';
import { IOtpTokenRepository } from '@auth/interfaces/otptoken.repository.interface';
import { ResetTokenRepository } from '@auth/repositories/resettokens.repository';
import { IResetTokenRepository } from '@auth/interfaces/resettoken.repository.interface';
import { UserRepository } from '@user/repositories/user.repository';
import { IUserRepository } from '@user/interfaces/user.repository.interface';
import { RoleService } from '@roles/services/role.service';
import { RoleRepository } from '@roles/repositories/role.repository';
import { IRoleRepository } from '@roles/interfaces/role.repository.interface';

const authRouter: Router = Router();
const otpTokenRepository: IOtpTokenRepository = new OtpTokenRepository();
const resetTokenRepository: IResetTokenRepository = new ResetTokenRepository();
const userRepository: IUserRepository = new UserRepository();
const roleRepository: IRoleRepository = new RoleRepository();
const roleService: RoleService = new RoleService(roleRepository);
const userService: UserService = new UserService(userRepository, roleService);
const authService: AuthService = new AuthService(otpTokenRepository, resetTokenRepository, userService);
const authController: AuthController = new AuthController(authService);

authRouter.post(
  '/login',
  validate({ body: loginSchema }),
  authController.login.bind(authController),
);

authRouter.get('/logout', authGuard, authController.logout.bind(authController));

authRouter.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword.bind(authController),
);

authRouter.patch(
  '/reset-password',
  validate({ body: resetPasswordSchema }),
  authController.resetPassword.bind(authController),
);

authRouter.post(
  '/send-otp',
  validate({ body: sendOtpSchema }),
  authController.sendOtp.bind(authController),
);

authRouter.patch(
  '/verify-otp',
  validate({ body: verifyOtpSchema }),
  authController.verifyOtp.bind(authController),
);

// TODO: Work on accessToken and refreshToken functionality
// authRouter.get('/refresh-token')

export default authRouter;
