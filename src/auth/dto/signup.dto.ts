import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsEmail, Length, IsEnum } from "class-validator"

export class SignupDto {
	@ApiProperty({ default: "" })
	@IsEmail()
	email: string

	@ApiProperty({ default: "" })
	@IsString()
	@Length(6, 20)
	password: string

}
