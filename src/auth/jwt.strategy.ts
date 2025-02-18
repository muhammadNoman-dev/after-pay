import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "src/config/config.service"
import { UsersService } from "src/users/users.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.jwtSecret,
		})
	}

	async validate(payload: any) {
		const user = await this.usersService.findById(payload.sub)
		if (!user) return null
		return user
	}
}
