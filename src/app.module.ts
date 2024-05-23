import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {UsersModule} from './modules/users/users.module';
import {SessionsModule} from "./modules/sessions/sessions.module";
import {AuthMiddleware} from "./middlewares/auth.middleware";
import {JwtModule} from "@nestjs/jwt";
import {AdminMiddleware} from "./middlewares/admin.middleware";
import {PrismaModule} from "./prisma/prisma.module";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
        PrismaModule,
        UsersModule,
        SessionsModule
    ],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                {path: 'sessions/logout/:id', method: RequestMethod.POST},
                {path: 'sessions/login', method: RequestMethod.POST},
                {path: 'users/register', method: RequestMethod.POST},
            )
            .forRoutes('*');
    }

}
