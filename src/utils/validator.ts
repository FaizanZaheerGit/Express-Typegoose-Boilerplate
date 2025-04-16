import { StatusEnums } from '@enums/status.enums';
import { UserTypeEnum } from '@enums/userType.enum';
import { z } from 'zod';

export const emailValidation = z
  .string({ required_error: 'email is required', invalid_type_error: 'email must be a string' })
  .email({ message: 'Invalid Email Format' });
export const optionalEmailValidation = z
  .string({ invalid_type_error: 'email must be a string' })
  .email({ message: 'Invalid Email Format' })
  .optional();
export const phoneNumberValidation = z
  .string({ invalid_type_error: 'phone number must be a string' })
  .optional();
export const nameValidation = z.string({ invalid_type_error: 'name must be a string' }).optional();
export const strongPasswordValidation = z
  .string({
    required_error: 'password is required',
    invalid_type_error: 'password must be a string',
  })
  .min(8, { message: 'password must be atleast 8 characters' })
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[@$!%*?&#]/, 'Password must contain at least one special character');
export const uuidValidation = z
  .string({ required_error: 'token is required', invalid_type_error: 'token must be a string' })
  .uuid({ message: 'token must be valid UUID' });
export const mongoIdValidation = z
  .string({ required_error: 'id is required', invalid_type_error: 'id must be a string' })
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'id must be a valid MongoDB ObjectId' });
export const otpTokenValidation = z
  .string({
    required_error: '6-digit token is required',
    invalid_type_error: 'token must be a string',
  })
  .regex(/^\d{6}/, { message: 'token must be 6 digits' });
export const statusValidation = z
  .nativeEnum(StatusEnums, { invalid_type_error: 'Invalid Status' })
  .optional();
export const userTypeValidation = z
  .nativeEnum(UserTypeEnum, { invalid_type_error: 'Invalid User Type' })
  .optional();
export const createdAtValidation = z
  .string({ invalid_type_error: 'created at must be a string' })
  .date('created at must be a valid date')
  .optional();
export const searchKeywordValidation = z
  .string({ invalid_type_error: 'search must be a string' })
  .optional();
