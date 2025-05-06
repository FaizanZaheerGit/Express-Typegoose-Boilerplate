import {
  Aggregate,
  AggregateOptions,
  DeleteResult,
  FilterQuery,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { User } from '@user/models/user.model';
import { DeleteOptions, UpdateOptions } from 'mongodb';

export abstract class IUserRepository {
  abstract create(data: Partial<User>): Promise<User>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract insertMany(data: Partial<User>[]): Promise<any>;
  abstract findAll(
    filterQuery: FilterQuery<User>,
    queryOptions: QueryOptions<User>,
    isDeleted?: boolean,
  ): Promise<User[]>;
  abstract findPaginated(
    page: number,
    limit: number,
    filterQuery: FilterQuery<User>,
    queryOptions: QueryOptions<User>,
    isDeleted?: boolean,
  ): Promise<User[]>;
  abstract findOne(
    filterQuery: FilterQuery<User>,
    queryOptions: QueryOptions<User>,
  ): Promise<User | null>;
  abstract countDocuments(filterQuery: FilterQuery<User>, isDeleted?: boolean): Promise<number>;
  abstract findOneAndUpdate(
    filterQuery: FilterQuery<User>,
    updateQuery: UpdateQuery<User>,
    queryOptions: QueryOptions<User>,
  ): Promise<User | null>;
  abstract updateMany(
    filterQuery: FilterQuery<User>,
    updateQuery: UpdateQuery<User>,
    updateOptions?: UpdateOptions,
  ): Promise<UpdateWriteOpResult>;
  abstract deleteOne(
    filterQuery: FilterQuery<User>,
    deleteOptions?: DeleteOptions,
  ): Promise<DeleteResult>;
  abstract deleteMany(
    filterQuery: FilterQuery<User>,
    deleteOptions?: DeleteOptions,
  ): Promise<DeleteResult>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract aggregate(stages: PipelineStage[], options?: AggregateOptions): Promise<Aggregate<any>>;
  abstract getUserByEmail(email: string): Promise<User | null>;
  abstract getUserByEmailWithPassword(email: string): Promise<User | null>;
  abstract getUserById(id: string): Promise<User | null>;
  abstract getSingleActiveAdmin(): Promise<User | null>;
  abstract getPaginatedUsers(
    page: number,
    limit: number,
    filterQuery: FilterQuery<User>,
  ): Promise<User[]>;
  abstract getUsers(filterQuery: FilterQuery<User>): Promise<User[]>;
  abstract getSingleUser(filterQuery: FilterQuery<User>): Promise<User | null>;
  abstract updateUserById(id: string, updateQuery: Partial<User>): Promise<User | null>;
}
