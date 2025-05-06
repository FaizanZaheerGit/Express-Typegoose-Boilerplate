import {
  emailValidation,
  limitValidation,
  mongoIdValidation,
  nameValidation,
  optionalEmailValidation,
  pageValidation,
  phoneNumberValidation,
  statusValidation,
  strongPasswordValidation,
  userTypeValidation,
} from '@utils/validator';
import { z } from 'zod';

export const createUserSchema = z
  .object({
    email: emailValidation,
    password: strongPasswordValidation,
    name: nameValidation,
    phoneNumber: phoneNumberValidation,
  })
  .strict('Remove any extra keys other than [email, password, name, phoneNumber]');

export const getUsersSchema = z
  .object({
    email: optionalEmailValidation,
    userType: userTypeValidation,
    status: statusValidation,
  })
  .strict('Remove any extra keys other than [email, userType, status]');

export const getPaginatedUsersSchema = z
  .object({
    email: optionalEmailValidation,
    userType: userTypeValidation,
    status: statusValidation,
    page: pageValidation,
    limit: limitValidation,
  })
  .strict('Remove any extra keys other than [email, userType, status, page, limit]');

export const updateUserSchema = z
  .object({
    name: nameValidation,
    userType: userTypeValidation,
    status: statusValidation,
    phoneNumber: phoneNumberValidation,
  })
  .strict('Remove any extra keys other than [name, userType, status, phoneNumber]');

export const idParamSchema = z.object({
  id: mongoIdValidation,
});
