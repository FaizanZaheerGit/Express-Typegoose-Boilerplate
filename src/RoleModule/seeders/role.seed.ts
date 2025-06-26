/* eslint-disable @typescript-eslint/restrict-plus-operands,@typescript-eslint/restrict-template-expressions */
import { roleDefaultValues } from '@roles/defaults/role.defaultValues';
import { IRoleRepository } from '@roles/interfaces/role.repository.interface';
import { RoleRepository } from '@roles/repositories/role.repository';
import logger from '@utils/logger';

const roleRepository: IRoleRepository = new RoleRepository();

// TODO: call this function inside cli prompt solution, and remove from calling on app run

export const createInitialRoles = async () => {
  try {
    const existingRole = await roleRepository.findOne({}, {});
    if (existingRole) {
      logger.info({}, `Roles already exists`);
      return false;
    } else {
      await roleRepository.insertMany(roleDefaultValues);
      logger.info({}, `Roles have been seeded`);
    }
    return true;
  } catch (error) {
    logger.error({}, `Error in creating initial roles:  =>  ${error}`);
    throw new Error('' + error);
  }
};
