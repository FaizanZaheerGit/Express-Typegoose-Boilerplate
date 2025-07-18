/* eslint-disable @typescript-eslint/restrict-plus-operands,@typescript-eslint/restrict-template-expressions */
import { adminEmail, adminName, adminPassword } from '@config/index';
import { UserTypeEnum } from '@enums/userType.enum';
import { IUserRepository } from '@user/interfaces/user.repository.interface';
import { UserRepository } from '@user/repositories/user.repository';
import logger from '@utils/logger';
const userRepository: IUserRepository = new UserRepository();

// TODO: Work on creating a separate seed function, and call it through npm script on prompts basis seed

export const createInitialUser = async () => {
  try {
    const existingAdmin = await userRepository.getSingleActiveAdmin();
    if (existingAdmin) {
      logger.info({}, 'An admin already exists');
      return true;
    }
    await userRepository.create({
      email: adminEmail,
      password: adminPassword,
      name: adminName,
      userType: UserTypeEnum.ADMIN,
    });
    logger.info({}, 'First Admin created');
    return true;
  } catch (error) {
    logger.error({}, `Error in creating initial admin user:  =>  ${error}`);
    throw new Error('' + error);
  }
};
