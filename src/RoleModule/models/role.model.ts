import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { BaseClass } from '@database/models/base.model';

@modelOptions({
  schemaOptions: { timestamps: true, versionKey: false },
})
export class Role extends BaseClass {
  @prop({ type: String, required: true })
  title!: string;

  @prop({ type: [String], default: [] })
  rights?: string[];
}

export const RoleModel = getModelForClass(Role);
