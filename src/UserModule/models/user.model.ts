import { getModelForClass, modelOptions, pre, prop } from '@typegoose/typegoose';
import { BaseClass } from '@database/models/base.model';
import { generateHash } from '@utils/bcrypt';
import { UserTypeEnum } from '@enums/userType.enum';

@pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await generateHash(String(this.password));
  next();
})
@modelOptions({
  schemaOptions: { timestamps: true, versionKey: false },
})
export class User extends BaseClass {
  @prop({ type: String, default: null })
  name?: string;

  @prop({ type: String, required: true, lowercase: true, unique: true })
  email?: string;

  @prop({ type: String, required: true })
  password?: string;

  @prop({ type: String, default: null })
  phoneNumber?: string;

  @prop({ type: String, enum: UserTypeEnum, default: UserTypeEnum.USER })
  userType?: UserTypeEnum;
}

export const UserModel = getModelForClass(User);
