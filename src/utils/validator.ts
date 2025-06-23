import { PermissionEnums } from '@enums/permissions.enum';
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

export const oldPasswordValidation = z.string({
  required_error: 'old password is required',
  invalid_type_error: 'old password must be a string',
});

export const uuidValidation = z
  .string({ required_error: 'token is required', invalid_type_error: 'token must be a string' })
  .uuid({ message: 'token must be valid UUID' });

export const mongoIdValidation = z
  .string({ required_error: 'id is required', invalid_type_error: 'id must be a string' })
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'id must be a valid MongoDB ObjectId' });

export const cursorIdValidation = z
  .string({ invalid_type_error: 'id must be a string' })
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'id must be a valid MongoDB ObjectId' })
  .optional();

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

export const pageValidation = z.string({
  required_error: 'page is required',
  invalid_type_error: 'page must be a string',
});

export const limitValidation = z.string({
  required_error: 'limit is required',
  invalid_type_error: 'limit must be a string',
});

export const titleValidation = z.string({
  required_error: 'title is required',
  invalid_type_error: 'title must be a string',
});

export const optionalTitleValidation = z
  .string({
    invalid_type_error: 'title must be a string',
  })
  .optional();

export const rightsValidation = z.array(
  z.nativeEnum(PermissionEnums, {
    required_error: 'rights array must not be empty',
    invalid_type_error: 'Invalid value inside rights array',
  }),
  { required_error: 'rights are required', invalid_type_error: 'rights must be an array' },
);

export const optionalRightsValidation = z
  .array(
    z.nativeEnum(PermissionEnums, {
      invalid_type_error: 'Invalid value inside rights array',
    }),
    { invalid_type_error: 'rights must be an array' },
  )
  .optional();

export const arrayOfRoleIdsValidation = z
  .array(mongoIdValidation.optional(), { invalid_type_error: 'roles must be an array' })
  .optional();
