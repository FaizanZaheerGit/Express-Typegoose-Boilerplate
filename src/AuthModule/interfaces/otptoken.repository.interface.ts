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
import { OtpToken } from '@auth/models/otptoken.model';
import { User } from '@user/models/user.model';

export abstract class IOtpTokenRepository {
  abstract create(data: Partial<OtpToken>): Promise<OtpToken>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract insertMany(data: Partial<OtpToken>[]): Promise<any>;
  abstract findAll(
    filterQuery: FilterQuery<OtpToken>,
    queryOptions: QueryOptions<OtpToken>,
    isDeleted?: boolean,
  ): Promise<OtpToken[]>;
  abstract findPaginated(
    page: number,
    limit: number,
    filterQuery: FilterQuery<OtpToken>,
    queryOptions: QueryOptions<OtpToken>,
    isDeleted?: boolean,
  ): Promise<OtpToken[]>;
  abstract findOne(
    filterQuery: FilterQuery<OtpToken>,
    queryOptions: QueryOptions<OtpToken>,
  ): Promise<OtpToken | null>;
  abstract countDocuments(filterQuery: FilterQuery<OtpToken>, isDeleted?: boolean): Promise<number>;
  abstract findOneAndUpdate(
    filterQuery: FilterQuery<OtpToken>,
    updateQuery: UpdateQuery<OtpToken>,
    queryOptions: QueryOptions<OtpToken>,
  ): Promise<OtpToken | null>;
  abstract updateMany(
    filterQuery: FilterQuery<OtpToken>,
    updateQuery: UpdateQuery<OtpToken>,
    updateOptions?: UpdateOptions,
  ): Promise<UpdateWriteOpResult>;
  abstract deleteOne(
    filterQuery: FilterQuery<OtpToken>,
    deleteOptions?: DeleteOptions,
  ): Promise<DeleteResult>;
  abstract deleteMany(
    filterQuery: FilterQuery<OtpToken>,
    deleteOptions?: DeleteOptions,
  ): Promise<DeleteResult>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract aggregate(stages: PipelineStage[], options?: AggregateOptions): Promise<Aggregate<any>>;
  abstract createToken(user: User, token: string): Promise<OtpToken>;
  abstract getByTokenAndUser(user: User, token: string): Promise<OtpToken | null>;
  abstract updateTokenExpiryByUserIdAndToken(
    userId: string,
    token: string,
    isExpired: boolean,
  ): Promise<OtpToken | null>;
}
