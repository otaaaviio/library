import {Controller, Post, Body, Logger, HttpException, Param, Headers} from '@nestjs/common';
import {SessionsService} from "./sessions.service";
import {SessionDto, TokenPayload} from "./sessions.validation";

@Controller('users')
export class SessionsController {
    private logger = new Logger(SessionsController.name);

    constructor(private readonly sessionsService: SessionsService) {
    }

    @Post()
    login(
        @Body() data: SessionDto,
        @Headers('x-real-ip') ip: string,
        @Headers('user-agent') user_agent: string
    ) {
        try {
            return this.sessionsService.create(data, ip, user_agent);
        } catch (err) {
            this.logger.error(`Failed to login: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }

    @Post()
    logout(@Param('token') token: TokenPayload) {
        try {
            return this.sessionsService.delete(token);
        } catch (err) {
            this.logger.error(`Failed to logout: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }
}
