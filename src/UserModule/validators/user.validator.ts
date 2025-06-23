import {
  arrayOfRoleIdsValidation,
  cursorIdValidation,
  emailValidation,
  limitValidation,
  mongoIdValidation,
  nameValidation,
  oldPasswordValidation,
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
    roles: arrayOfRoleIdsValidation,
  })
  .strict('Remove any extra keys other than [email, password, name, phoneNumber, roles]');

export const getUsersSchema = z
  .object({
    email: optionalEmailValidation,
    userType: userTypeValidation,
    status: statusValidation,
    cursor: cursorIdValidation, // NOTE: For cursor based read
    limit: limitValidation, // NOTE: For cursor based read
  })
  .strict('Remove any extra keys other than [email, userType, status, limit, cursor]');

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
    // userType: userTypeValidation,
    // status: statusValidation,
    phoneNumber: phoneNumberValidation,
  })
  .strict('Remove any extra keys other than [name, phoneNumber]');

export const updateUserAdminSchema = z
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

export const changePasswordSchema = z.object({
  id: mongoIdValidation,
  oldPassword: oldPasswordValidation,
  newPassword: strongPasswordValidation,
});
