import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { BaseClass } from '@database/models/base.model';
import { User } from '@user/models/user.model';

@modelOptions({ schemaOptions: { timestamps: true, versionKey: false } })
export class ResetToken extends BaseClass {
  @prop({ ref: () => User, required: true, type: Types.ObjectId })
  user?: Ref<User>;

  @prop({ type: String, required: true })
  token?: string;

  @prop({ type: Boolean, default: false })
  isExpired?: boolean;

  @prop({ type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), expires: 86400 })
  expiresAt?: Date;
}

export const ResetTokenModel = getModelForClass(ResetToken);
