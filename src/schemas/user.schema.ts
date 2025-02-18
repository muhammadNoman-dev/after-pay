import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({ timestamps: true })
export class User {
	@Prop()
	firstName: string

	@Prop()
	lastName: string

	@Prop()
	email: string

	@Prop()
	password: string

}

export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User)