import { BaseClass } from '@database/models/base.model';
import {
  NotificationCategories,
  NotificationChannels,
} from '@notification/enums/notification.enum';
import { modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({ schemaOptions: { versionKey: false, timestamps: true } })
export class NotifcationClass extends BaseClass {
  @prop({ type: String, required: true })
  title!: string;

  @prop({ type: String, required: true })
  body!: string;

  @prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  user!: Types.ObjectId;

  @prop({ type: String, default: null })
  redirectUrl?: string;

  @prop({ type: Boolean, default: false, index: true })
  seen?: boolean;

  @prop({ type: Boolean, default: false })
  dismissed?: boolean;

  @prop({ type: Date, default: null, index: true })
  seenTime?: Date;

  @prop({ type: Date, default: null })
  dismissedTime?: Date;

  @prop({
    type: String,
    enum: NotificationCategories,
    default: NotificationCategories.SYSTEM,
    index: true,
  })
  category?: NotificationCategories;

  @prop({
    type: NotificationChannels,
    enum: NotificationCategories,
    default: NotificationChannels.PUSH,
    index: true,
  })
  channel?: NotificationChannels;
}
