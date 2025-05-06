import {
  limitValidation,
  mongoIdValidation,
  optionalRightsValidation,
  optionalTitleValidation,
  pageValidation,
  rightsValidation,
  statusValidation,
  titleValidation,
} from '@utils/validator';
import { z } from 'zod';

export const createRoleSchema = z
  .object({
    title: titleValidation,
    rights: rightsValidation,
  })
  .strict(`Remove any other extra keys except [title, rights]`);

export const getRolesSchema = z
  .object({
    title: optionalTitleValidation,
    status: statusValidation,
  })
  .strict(`Remove any extra keys except [title, status]`);

export const getPaginatedRolesSchema = z
  .object({
    title: optionalTitleValidation,
    status: statusValidation,
    page: pageValidation,
    limit: limitValidation,
  })
  .strict(`Remove any extra keys except [title, status, page, limit]`);

export const updateRoleSchema = z
  .object({
    title: optionalTitleValidation,
    rights: optionalRightsValidation,
    status: statusValidation,
  })
  .strict(`Remove any extra keys except [id, title, rights, status]`);

export const idParamSchema = z
  .object({
    id: mongoIdValidation,
  })
  .strict(`Remove any extra keys except [id]`);

export const deleteRoleSchema = z
  .object({
    id: mongoIdValidation,
  })
  .strict(`Remove any extra keys except [id]`);
