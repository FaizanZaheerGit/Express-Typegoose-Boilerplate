import { FilterQuery } from 'mongoose';
import { User } from '@user/models/user.model';
import { UserRepository } from '@user/repositories/user.repository';
import { StatusEnums } from '@enums/status.enums';
import { UserTypeEnum } from '@enums/userType.enum';
import { AppError } from '@utils/apperror';
import { IUserRepository } from '@user/interfaces/user.repository.interface';

const userRepository: IUserRepository = new UserRepository();

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await userRepository.getUserByEmail(email);
  } catch (error) {
    console.error('Error in get user by email service:  =>  ' + error);
    throw new AppError('' + error, 400);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await userRepository.getUserById(id);
  } catch (error) {
    console.error('Error in get user by id service:  =>  ' + error);
    throw new AppError('' + error, 400);
  }
}

export async function updateUserPasswordById(id: string, password: string) {
  try {
    return await userRepository.updateUserById(id, { password: password });
  } catch (error) {
    console.error('Error in update user password by id service:  =>  ' + error);
    throw new AppError('' + error, 400);
  }
}

export async function createUser(body: {
  email: string;
  password: string;
  name?: string;
  phoneNumber?: string;
}): Promise<User> {
  try {
    const existingUser: User | null = await userRepository.getUserByEmail(body.email);
    if (existingUser) {
      throw new AppError('User with email already exists', 409);
    }
    return await userRepository.create({ ...body, status: StatusEnums.PENDING });
  } catch (error) {
    console.error('Error in create user service:  =>  ' + error);
    throw new AppError('Error:  =>  ' + error, 400);
  }
}

export async function getUsers(filterQuery: FilterQuery<User> = {}): Promise<User[]> {
  try {
    return await userRepository.getUsers(filterQuery);
  } catch (error) {
    console.error('Error in get users service:  =>  ' + error);
    throw new AppError('' + error, 400);
  }
}

export async function getUser(filterQuery: FilterQuery<User> = {}): Promise<User | null> {
  try {
    const existingUser = await userRepository.getSingleUser(filterQuery);
    if (!existingUser) {
      throw new AppError('User not found', 404);
    }
    return existingUser;
  } catch (error) {
    console.error('Error in get user service:  =>  ' + error);
    throw new AppError('' + error, 400);
  }
}

export async function updateUser(
  id: string,
  body: { name?: string; status?: StatusEnums; userType?: UserTypeEnum },
): Promise<User | null> {
  try {
    return await userRepository.updateUserById(id, body);
  } catch (error) {
    console.error('Error in update user service:  =>  ' + error);
    throw new AppError('' + error, 400);
  }
}

export async function deleteUser(id: string): Promise<User | null> {
  try {
    return await userRepository.updateUserById(id, { status: StatusEnums.DELETED });
  } catch (error) {
    console.error('Error in delete user service:  =>  ' + error);
    throw new AppError('' + error, 400);
  }
}
