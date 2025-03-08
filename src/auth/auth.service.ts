import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = { id: user.id, email: user.email, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  // async login(email: string, password: string) {
  //   const user = await this.validateUser(email, password);
  //   if (!user) throw new UnauthorizedException('Invalid credentials');

  //   const payload = { id: user.id, email: user.email, username: user.username };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     user,
  //   };
  // }
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { username, email, password } = registerDto;
    await this.userService.createUser(username, email, password);
    return { message: 'User registered successfully' };
  }
}
