import { BaseRespository } from '@database/repositories/base.repository';
import { PermissionEnums } from '@enums/permissions.enum';
import { IRoleRepository } from '@roles/interfaces/role.repository.interface';
import { Role, RoleModel } from '@roles/models/role.model';
import { FilterQuery, Types } from 'mongoose';

export class RoleRepository extends BaseRespository<Role> implements IRoleRepository {
  constructor() {
    super(RoleModel);
  }

  async getRoleByTitle(title: string): Promise<Role | null> {
    return await this.findOne({ title });
  }

  async getRolesByRights(rights: PermissionEnums[]): Promise<Role[] | null> {
    return await this.findAll({ rights: { $in: rights } });
  }

  async getPaginatedRoles(
    page: number,
    limit: number,
    filterQuery: FilterQuery<Role>,
  ): Promise<Role[]> {
    return await this.findPaginated(page, limit, filterQuery);
  }

  async getRoles(filterQuery: FilterQuery<Role>): Promise<Role[]> {
    return await this.findAll(filterQuery);
  }

  async getSingleRole(filterQuery: FilterQuery<Role>): Promise<Role | null> {
    return await this.findOne(filterQuery);
  }

  async getRoleById(id: string): Promise<Role | null> {
    return await this.findOne({ _id: new Types.ObjectId(id) });
  }

  async getRoleByIds(ids: string[]): Promise<Role[]> {
    return await this.findAll({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
    });
  }

  async updateRoleById(id: string, updateQuery: Partial<Role>) {
    return await this.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $set: updateQuery });
  }
}
