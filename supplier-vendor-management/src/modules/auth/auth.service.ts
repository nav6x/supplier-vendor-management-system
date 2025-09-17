import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'secretKey';
  }

  async signIn(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { sub: user.id, username: user.username, roleId: user.roleId };
    return {
      access_token: this.jwtService.sign(payload, { secret: this.jwtSecret }),
    };
  }
}