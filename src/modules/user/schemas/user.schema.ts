import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../../../gurads/roles/enum/role.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: {
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
  },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ default: Roles.DRIVER, enum: Roles })
  role: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  active?: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

const UserSchema = SchemaFactory.createForClass(User);
export { UserSchema };
