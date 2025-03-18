import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
// import { EmailService } from "../emailer/emailer"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  private static HASH_ROUNDS = 10;

  async signup(user: SignupDto) {
    const existingUser = await this.usersService.findOne({ email: user.email });
    if (existingUser)
      throw new BadRequestException('User with email already exists');
    const hashedPassword = await bcrypt.hash(
      user.password,
      AuthService.HASH_ROUNDS,
    );
    const createdUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });
    return createdUser;
  }

  async validateUser({ email, password }: { email: string; password: string }) {
    const user = await this.usersService.findOne({ email });
    if (!user) return null;
    const { password: hashedPassword, ...rest } = user;
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) return null;

    return rest;
  }

  async login(user: UserDocument) {
    const payload = { username: user.email, sub: user._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
