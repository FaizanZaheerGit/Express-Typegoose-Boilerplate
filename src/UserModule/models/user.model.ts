import { getModelForClass, modelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { BaseClass } from '@database/models/base.model';
import { generateHash } from '@utils/bcrypt';
import { UserTypeEnum } from '@enums/userType.enum';
import { Role } from '@src/RoleModule/models/role.model';
import { Types } from 'mongoose';

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

  @prop({ ref: () => Role, default: [], type: [Types.ObjectId] })
  roles?: Ref<Role>[];
}

export const UserModel = getModelForClass(User);
