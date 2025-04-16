import {
  emailValidation,
  mongoIdValidation,
  otpTokenValidation,
  strongPasswordValidation,
  uuidValidation,
} from '@utils/validator';
import { z } from 'zod';

export const loginSchema = z
  .object({
    email: emailValidation,
    password: z.string({
      required_error: 'password is required',
      invalid_type_error: 'password must be a string',
    }),
  })
  .strict('Remove any extra keys other than [email, password]');

export const forgotPasswordSchema = z
  .object({
    email: emailValidation,
  })
  .strict('Remove any extra keys other than [email]');

export const resetPasswordSchema = z
  .object({
    id: mongoIdValidation,
    newPassword: strongPasswordValidation,
    token: uuidValidation,
  })
  .strict('Remove any extra keys other than [id, token]');

export const sendOtpSchema = z
  .object({
    id: mongoIdValidation,
  })
  .strict('Remove any extra keys other than [id]');

export const verifyOtpSchema = z
  .object({
    id: mongoIdValidation,
    token: otpTokenValidation,
  })
  .strict('Remove any extra keys other than [id, token]');
