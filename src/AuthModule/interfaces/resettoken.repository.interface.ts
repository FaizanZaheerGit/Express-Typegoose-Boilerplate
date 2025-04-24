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
import { DeleteOptions, UpdateOptions } from 'mongodb';
import { ResetToken } from '@auth/models/resettoken.model';
import { User } from '@user/models/user.model';

export abstract class IResetTokenRepository {
  abstract create(data: Partial<ResetToken>): Promise<ResetToken>;
  abstract findAll(
    filterQuery: FilterQuery<ResetToken>,
    queryOptions: QueryOptions<ResetToken>,
    isDeleted?: boolean,
  ): Promise<ResetToken[]>;
  abstract findPaginated(
    page: number,
    limit: number,
    filterQuery: FilterQuery<ResetToken>,
    queryOptions: QueryOptions<ResetToken>,
    isDeleted?: boolean,
  ): Promise<ResetToken[]>;
  abstract findOne(
    filterQuery: FilterQuery<ResetToken>,
    queryOptions: QueryOptions<ResetToken>,
  ): Promise<ResetToken | null>;
  abstract countDocuments(
    filterQuery: FilterQuery<ResetToken>,
    isDeleted?: boolean,
  ): Promise<number>;
  abstract findOneAndUpdate(
    filterQuery: FilterQuery<ResetToken>,
    updateQuery: UpdateQuery<ResetToken>,
    queryOptions: QueryOptions<ResetToken>,
  ): Promise<ResetToken | null>;
  abstract updateMany(
    filterQuery: FilterQuery<ResetToken>,
    updateQuery: UpdateQuery<ResetToken>,
    updateOptions?: UpdateOptions,
  ): Promise<UpdateWriteOpResult>;
  abstract deleteOne(
    filterQuery: FilterQuery<ResetToken>,
    deleteOptions?: DeleteOptions,
  ): Promise<DeleteResult>;
  abstract deleteMany(
    filterQuery: FilterQuery<ResetToken>,
    deleteOptions?: DeleteOptions,
  ): Promise<DeleteResult>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract aggregate(stages: PipelineStage[], options?: AggregateOptions): Promise<Aggregate<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract createToken(user: any, token: string): Promise<ResetToken>;
  abstract getByTokenAndUser(user: User, token: string): Promise<ResetToken | null>;
}
