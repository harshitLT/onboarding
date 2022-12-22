import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TokenType } from '../enum/tokenTypes'

export type TokenDocument = Token & Document;

@Schema({
	timestamps: {
		updatedAt: 'updated_at',
		createdAt: 'created_at',
	},
})
export class Token {
	@Prop({default: TokenType.REFRESH, enum: TokenType})
	type?: string;

	@Prop({required: true})
	token: string;

	@Prop({type: MongooseSchema.Types.ObjectId, ref: 'users', unique: true})
	userId: MongooseSchema.Types.ObjectId;
}

const TokenSchema = SchemaFactory.createForClass(Token);
export { TokenSchema };