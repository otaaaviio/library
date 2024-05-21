import {Controller, Post, Body, Logger, HttpException} from '@nestjs/common';
import {SessionsService} from "./sessions.service";
import {SessionDto} from "./sessions.validation";

@Controller('users')
export class SessionsController {
    private logger = new Logger(SessionsController.name);

    constructor(private readonly sessionsService: SessionsService) {
    }

    @Post()
    login(@Body() data: SessionDto) {
        try {
            return this.sessionsService.create(data);
        } catch (err) {
            this.logger.error(`Failed to login: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }

    @Post()
    logout() {
        try {
            return this.sessionsService.delete();
        } catch (err) {
            this.logger.error(`Failed to logout: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }
}
