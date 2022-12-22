import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../../../gurads/roles/enum/role.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
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
}

const UserSchema = SchemaFactory.createForClass(User);
export { UserSchema };
