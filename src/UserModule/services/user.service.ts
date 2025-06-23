/* eslint-disable @typescript-eslint/restrict-plus-operands,@typescript-eslint/restrict-template-expressions */
import { FilterQuery } from 'mongoose';
import { User } from '@user/models/user.model';
import { UserRepository } from '@user/repositories/user.repository';
import { StatusEnums } from '@enums/status.enums';
import { UserTypeEnum } from '@enums/userType.enum';
import { AppError } from '@utils/apperror';
import { IUserRepository } from '@user/interfaces/user.repository.interface';
import { PaginationMetaType } from '@utils/paginatedRepsonse.type';
import logger from '@utils/logger';
import * as roleService from '@roles/services/role.service';
import { comparePassword, generateHash } from '@utils/bcrypt';

const userRepository: IUserRepository = new UserRepository();

export async function getUserByEmailWithPassword(email: string): Promise<User | null> {
  try {
    return await userRepository.getUserByEmailWithPassword(email);
  } catch (error) {
    logger.error({ body: { email } }, `Error in get user by email service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await userRepository.getUserById(id);
  } catch (error) {
    logger.error({ body: { id } }, `Error in get user by id service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function updateUserPasswordById(id: string, password: string) {
  try {
    return await userRepository.updateUserById(id, { password: password });
  } catch (error) {
    logger.error({ body: { id } }, `Error in update user password by id service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function createUser(body: {
  email: string;
  password: string;
  name?: string;
  phoneNumber?: string;
  roleIds?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roles?: any[];
}): Promise<User> {
  try {
    if (body?.roleIds && body?.roleIds.length) {
      const existingRoles = await roleService.getRoleByIds(body?.roleIds);
      if (!existingRoles || !existingRoles.length || existingRoles.length < body?.roleIds.length) {
        throw new AppError(`Role not found`, 400);
      } else {
        body['roles'] = existingRoles;
      }
    }
    const existingUser: User | null = await userRepository.getUserByEmail(body.email);
    if (existingUser) {
      throw new AppError('User with email already exists', 409);
    }
    return await userRepository.create({ ...body, status: StatusEnums.PENDING });
  } catch (error) {
    logger.error({ body: body }, `Error in create user service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function getAllUsers(filterQuery: FilterQuery<User> = {}): Promise<User[]> {
  try {
    return await userRepository.getUsers(filterQuery);
  } catch (error) {
    logger.error({ body: filterQuery }, `Error in get users service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function getCursorBasedUsers(
  filterQuery: FilterQuery<User> = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cursor: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  limit: any,
): Promise<{ users: User[]; hasNext: boolean; nextCursor: unknown }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const limitInt = parseInt(limit, 10);
    const users = await userRepository.getCursorBasedUsers(filterQuery, cursor, limitInt);
    const hasNext = users.length > limit;
    if (hasNext) {
      users.pop();
    }
    const nextCursor = hasNext ? users[users.length - 1]._id : null;
    return { users, hasNext, nextCursor };
  } catch (error) {
    logger.error({ body: filterQuery }, `Error in get cursor based users service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function getPaginatedUser(
  page: string = '1',
  limit: string = '10',
  filterQuery: FilterQuery<User> = {},
): Promise<{ users: User[]; meta: PaginationMetaType }> {
  try {
    const pageInt: number = parseInt(page, 10);
    const limitInt: number = parseInt(limit, 10);
    const [users, totalCount] = await Promise.all([
      userRepository.getPaginatedUsers(pageInt, limitInt, filterQuery),
      userRepository.countDocuments(filterQuery),
    ]);
    const totalPages = Math.ceil(totalCount / limitInt);
    const hasNext: boolean = pageInt < totalPages;
    return {
      users,
      meta: {
        currentPage: pageInt,
        hasNext,
        pageSize: limitInt,
        totalCount,
        totalPages,
      },
    };
  } catch (error) {
    logger.error(
      { body: { page, limit, ...filterQuery } },
      `Error in get paginated users:  =>  ${error}`,
    );
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
    logger.error({ body: filterQuery }, `Error in get user service:  =>  ${error}`);
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
    logger.error({ body: { id, ...body } }, `Error in update user service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function deleteUser(id: string): Promise<User | null> {
  try {
    return await userRepository.updateUserById(id, { status: StatusEnums.DELETED });
  } catch (error) {
    logger.error({ body: { id } }, `Error in delete user service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}

export async function changePassword(
  body: {
    id: string;
    oldPassword: string;
    newPassword: string;
  },
  currentUser: User,
): Promise<User | null> {
  try {
    const existingUser = await userRepository.getUserById(body.id);
    if (!existingUser) {
      throw new AppError(`User does not exist!`, 400);
    }
    if (!currentUser || body.id !== String(currentUser['_id'])) {
      throw new AppError(`Unauthorized Access!`, 401);
    }
    const validatePassword: boolean = await comparePassword(
      body.oldPassword,
      existingUser?.password || '',
    );
    if (!validatePassword) {
      throw new AppError('Old password does not match!', 400);
    }
    const newPasswordHash: string = await generateHash(body.newPassword);
    return await userRepository.updateUserById(body.id, { password: newPasswordHash });
  } catch (error) {
    logger.error({ body }, `Error in change password service:  =>  ${error}`);
    throw new AppError('' + error, 400);
  }
}
