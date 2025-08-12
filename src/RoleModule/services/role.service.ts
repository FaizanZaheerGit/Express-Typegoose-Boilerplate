/* eslint-disable @typescript-eslint/restrict-plus-operands,@typescript-eslint/restrict-template-expressions */
import { FilterQuery } from 'mongoose';
import { StatusEnums } from '@enums/status.enums';
import { AppError } from '@utils/apperror';
import { PaginationMetaType } from '@utils/paginatedRepsonse.type';
import logger from '@utils/logger';
import { IRoleRepository } from '@roles/interfaces/role.repository.interface';
import { RoleRepository } from '@roles/repositories/role.repository';
import { Role } from '@roles/models/role.model';
import { PermissionEnums } from '@enums/permissions.enum';
import { DefaultRoleEnums } from '@enums/defaultRoles.enum';

const roleRepository: IRoleRepository = new RoleRepository();

export class RoleService {
  public async getRoleByIds(ids: string[]): Promise<Role[]> {
    try {
      return await roleRepository.getRoleByIds(ids);
    } catch (error) {
      logger.error({ body: { ids } }, `Error in get role by ids service:  =>  ${error}`);
      throw new AppError('' + error, 400);
    }
  }

  public async createRole(body: { title: string; rights: PermissionEnums[] }): Promise<Role> {
    try {
      const existingRole: Role | null = await roleRepository.getRoleByTitle(body.title);
      if (existingRole) {
        throw new AppError('Role with title already exists', 409);
      }
      return await roleRepository.create(body);
    } catch (error) {
      logger.error({ body: body }, `Error in create role service:  =>  ${error}`);
      throw new AppError('' + error, 400);
    }
  }

  public async getAllRoles(filterQuery: FilterQuery<Role> = {}): Promise<Role[]> {
    try {
      return await roleRepository.getRoles(filterQuery);
    } catch (error) {
      logger.error({ body: filterQuery }, `Error in get roles service:  =>  ${error}`);
      throw new AppError('' + error, 400);
    }
  }

  public async getCursorBasedRoles(
    filterQuery: FilterQuery<Role> = {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cursor: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    limit: any,
  ): Promise<{ roles: Role[]; hasNext: boolean; nextCursor: unknown }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const limitInt = parseInt(limit, 10);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const roles = await roleRepository.getCursorBasedRoles(filterQuery, cursor, limitInt);
      const hasNext = roles.length > limit;
      if (hasNext) {
        roles.pop();
      }
      const nextCursor = hasNext ? roles[roles.length - 1]._id : null;
      return { roles, hasNext, nextCursor };
    } catch (error) {
      logger.error({ body: filterQuery }, `Error in get cursor based roles service:  =>  ${error}`);
      throw new AppError('' + error, 400);
    }
  }

  public async getPaginatedRole(
    page: string = '1',
    limit: string = '10',
    filterQuery: FilterQuery<Role> = {},
  ): Promise<{ roles: Role[]; meta: PaginationMetaType }> {
    try {
      const pageInt: number = parseInt(page, 10);
      const limitInt: number = parseInt(limit, 10);
      const [roles, totalCount] = await Promise.all([
        roleRepository.getPaginatedRoles(pageInt, limitInt, filterQuery),
        roleRepository.countDocuments(filterQuery),
      ]);
      const totalPages = Math.ceil(totalCount / limitInt);
      const hasNext: boolean = pageInt < totalPages;
      return {
        roles,
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
        `Error in get paginated roles:  =>  ${error}`,
      );
      throw new AppError('' + error, 400);
    }
  }

  public async getRole(filterQuery: FilterQuery<Role> = {}): Promise<Role | null> {
    try {
      const existingRole = await roleRepository.getSingleRole(filterQuery);
      if (!existingRole) {
        throw new AppError('Role not found', 404);
      }
      return existingRole;
    } catch (error) {
      logger.error({ body: filterQuery }, `Error in get role service:  =>  ${error}`);
      throw new AppError('' + error, 400);
    }
  }

  public async updateRole(
    id: string,
    body: { title?: string; rights?: PermissionEnums[]; status?: StatusEnums },
  ): Promise<Role | null> {
    try {
      const existingRole = await roleRepository.getRoleById(id);
      if (!existingRole) {
        throw new AppError(`Role not found!`, 400);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any
      if (Object.values(DefaultRoleEnums).includes(existingRole.title as any)) {
        throw new AppError(`Cannot update pre-defined roles`, 400);
      }
      if (body?.title) {
        const existingRoleByTitle = await roleRepository.getRoleByTitle(body.title);
        if (existingRoleByTitle) {
          throw new AppError(`Role with title already exists!`, 409);
        }
      }
      return await roleRepository.updateRoleById(id, body);
    } catch (error) {
      logger.error({ body: { id, ...body } }, `Error in update role service:  =>  ${error}`);
      throw new AppError('' + error, 400);
    }
  }

  public async deleteRole(id: string): Promise<Role | null> {
    try {
      const existingRole = await roleRepository.getRoleById(id);
      if (!existingRole) {
        throw new AppError(`Role not found!`, 400);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any
      if (Object.values(DefaultRoleEnums).includes(existingRole.title as any)) {
        throw new AppError(`Cannot delete pre-defined roles`, 400);
      }
      return await roleRepository.updateRoleById(id, { status: StatusEnums.DELETED });
    } catch (error) {
      logger.error({ body: { id } }, `Error in delete role service:  =>  ${error}`);
      throw new AppError('' + error, 400);
    }
  }
}
