import { Router } from 'express';
import * as authController from '@auth/controllers/auth.controller';
import { validate } from '@middlewares/validate.middleware';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from '@auth/validators/auth.validator';
import { authenticate } from '@middlewares/authentication.middleware';

const authRouter: Router = Router();

authRouter.post('/login', validate({ body: loginSchema }), authController.login);

authRouter.get('/logout', authenticate, authController.logout);

authRouter.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword,
);

authRouter.patch(
  '/reset-password',
  validate({ body: resetPasswordSchema }),
  authController.resetPassword,
);

authRouter.post('/send-otp', validate({ body: sendOtpSchema }), authController.sendOtp);

authRouter.patch('/verify-otp', validate({ body: verifyOtpSchema }), authController.verifyOtp);

export default authRouter;
