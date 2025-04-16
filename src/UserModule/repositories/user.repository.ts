import { BaseRespository } from '@database/repositories/base.repository';
import { FilterQuery, Types } from 'mongoose';
import { User, UserModel } from '@user/models/user.model';
import { UserTypeEnum } from '@enums/userType.enum';
import { IUserRepository } from '@user/interfaces/user.repository.interface';

export class UserRepository extends BaseRespository<User> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email });
  }

  async getSingleActiveAdmin(): Promise<User | null> {
    return await this.findOne({ userType: UserTypeEnum.ADMIN });
  }

  async getUsers(filterQuery: FilterQuery<User>): Promise<User[]> {
    return await this.findAll(filterQuery, { projection: { password: 0 } });
  }

  async getSingleUser(filterQuery: FilterQuery<User>): Promise<User | null> {
    return await this.findOne(filterQuery, { projection: { password: 0 } });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.findOne({ _id: new Types.ObjectId(id) });
  }

  async updateUserById(id: string, updateQuery: Partial<User>) {
    return await this.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $set: updateQuery });
  }
}
