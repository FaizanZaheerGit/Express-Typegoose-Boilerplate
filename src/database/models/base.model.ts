import { prop } from '@typegoose/typegoose';
import { StatusEnums } from '@enums/status.enums';
import { Types } from 'mongoose';

export class BaseClass {
  _id?: Types.ObjectId;

  @prop({ type: String, enum: StatusEnums, default: StatusEnums.ACTIVE })
  public status?: StatusEnums;
}
