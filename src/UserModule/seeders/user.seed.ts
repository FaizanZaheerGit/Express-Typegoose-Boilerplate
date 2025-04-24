/* eslint-disable no-console, @typescript-eslint/restrict-plus-operands */
import { adminEmail, adminName, adminPassword } from '@config/index';
import { UserTypeEnum } from '@enums/userType.enum';
import { IUserRepository } from '@user/interfaces/user.repository.interface';
import { UserRepository } from '@user/repositories/user.repository';
const userRepository: IUserRepository = new UserRepository();

export const createInitialUser = async () => {
  try {
    const existingAdmin = await userRepository.getSingleActiveAdmin();
    if (existingAdmin) {
      console.log('An admin already exists');
      return true;
    }
    await userRepository.create({
      email: adminEmail,
      password: adminPassword,
      name: adminName,
      userType: UserTypeEnum.ADMIN,
    });
    console.log('First Admin created');
    return true;
  } catch (error) {
    console.error('Error in creating initial admin user:  =>  ' + error);
    throw new Error('' + error);
  }
};
