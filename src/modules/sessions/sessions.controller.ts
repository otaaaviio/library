import {
  Controller,
  Post,
  Body,
  Logger,
  Headers,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionDto } from './sessions.validation';

@Controller('sessions')
export class SessionsController {
  private logger = new Logger(SessionsController.name);

  constructor(private readonly sessionsService: SessionsService) {}

  @Post('/login')
  async login(
    @Body() data: SessionDto,
    @Headers('x-real-ip') ip: string,
    @Headers('user-agent') user_agent: string,
    @Res() res,
  ) {
    try {
      const token = await this.sessionsService.create(data, ip, user_agent);
      res.cookie('token', token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: true,
        httpOnly: true,
      });
      return res.status(200).json({ message: 'Successfully logged in' });
    } catch (err) {
      this.logger.error(`Failed to login:\n ${err}`);
      throw err;
    }
  }

  @Get('/logout')
  async logout(@Req() req, @Res() res) {
    try {
      await this.sessionsService.delete(
        Number(req.user.id),
        req.cookies?.['token'],
      );
      res.clearCookie('token', {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: true,
        httpOnly: true,
      });
      return res.status(200).send({ message: 'Logged out successfully' });
    } catch (err) {
      this.logger.error(`Failed to logout:\n ${err}`);
      throw err;
    }
  }
}
