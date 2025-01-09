import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignInAuthDto } from './dto/signIn-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInAuthDto: SignInAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: signInAuthDto.username },
      omit: { createdAt: true, updatedAt: true },
    });
    if (!user)
      throw new UnauthorizedException('Username or password is incorrect');
    await bcrypt.compare(signInAuthDto.password, user.password).then((res) => {
      if (!res)
        throw new UnauthorizedException('Username or password is incorrect');
    });
    const { password: _password, ...rest } = user;
    const tokenPayload = {
      sub: rest.id,
      name: rest.displayName,
      role: rest.role,
    };
    const token = this.jwtService.sign(tokenPayload);
    return { token, user: rest };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, _updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
