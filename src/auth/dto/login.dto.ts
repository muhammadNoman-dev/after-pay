import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail, Length } from "class-validator"

export class LoginDto {
	@ApiProperty({ default: "" })
	@IsEmail()
	email: string

	@ApiProperty({ default: "" })
	@IsString()
	@Length(6, 20)
	password: string
}
