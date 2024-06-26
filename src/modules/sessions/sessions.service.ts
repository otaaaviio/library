import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { TokenPayload } from './sessions.validation';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async checkCredentials(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        is_admin: true,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    return user;
  }

  public async authenticateUser(user: any, ip: string, user_agent: string) {
    await this.prisma.session.updateMany({
      where: {
        user_id: user.id,
        active: true,
      },
      data: {
        active: false,
      },
    });

    const session = await this.prisma.session.create({
      data: {
        user_id: user.id,
        ip,
        user_agent,
      },
    });

    const payload: TokenPayload = {
      session_id: session.id,
      user_id: user.id,
    };

    return payload;
  }

  public async create(req: any, ip: string, user_agent: string) {
    const user = await this.checkCredentials(req.email, req.password);

    const payload = await this.authenticateUser(user, ip, user_agent);

    const token = await this.jwtService.sign(payload);

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin,
    };

    return { token, user: userPayload };
  }

  public async delete(user_id: number, token: string) {
    if (!token)
      throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);

    const payload: TokenPayload = this.jwtService.verify(token);

    if (payload.user_id !== user_id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    await this.prisma.session.updateMany({
      where: {
        user_id: user_id,
        active: true,
      },
      data: {
        active: false,
      },
    });
  }
}
