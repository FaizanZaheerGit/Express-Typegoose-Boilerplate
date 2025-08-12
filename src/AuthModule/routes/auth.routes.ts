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

const authRouter: Router = Router();
const authController: AuthController = new AuthController();

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

// TODO: Remove extra encryption layer, and work on accessToken and refreshToken functionality
// authRouter.get('/refresh-token')

export default authRouter;
