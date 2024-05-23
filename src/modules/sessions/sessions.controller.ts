import {Controller, Post, Body, Logger, HttpException, Headers, Res, Req, Param} from '@nestjs/common';
import {SessionsService} from "./sessions.service";
import {SessionDto} from "./sessions.validation";
import {Response, Request} from "express";

@Controller('sessions')
export class SessionsController {
    private logger = new Logger(SessionsController.name);

    constructor(private readonly sessionsService: SessionsService) {
    }

    @Post('/login')
    async login(
        @Body() data: SessionDto,
        @Headers('x-real-ip') ip: string,
        @Headers('user-agent') user_agent: string,
        @Req() req: Request,
        @Res() res: Response
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
            return res.status(200).json({message: 'Successfully logged in'});
        } catch (err) {
            this.logger.error(`Failed to login: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }

    @Post('/logout/:id')
    async logout(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        try {
            await this.sessionsService.delete(Number(id), req.cookies['token']);
            res.clearCookie('token', {
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: true,
                httpOnly: true,
            });
            return res.status(200).send('Logged out successfully');
        } catch (err) {
            this.logger.error(`Failed to logout: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }
}
