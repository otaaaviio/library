import {Module} from '@nestjs/common';
import {PrismaModule} from "../../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";
import {SessionsController} from "./sessions.controller";
import {SessionsService} from "./sessions.service";

@Module({
    imports: [PrismaModule, JwtModule],
    controllers: [SessionsController],
    providers: [SessionsService],
})
export class SessionsModule {
}
