import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import {UsersModule} from './modules/users/users.module';
import {SessionsModule} from './modules/sessions/sessions.module';
import {AuthMiddleware} from './middlewares/auth.middleware';
import {JwtModule} from '@nestjs/jwt';
import {PrismaModule} from './modules/prisma/prisma.module';
import {AuthorsModule} from "./modules/authors/authors.module";
import {PublishersModule} from "./modules/publishers/publishers.module";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
        PrismaModule,
        AuthorsModule,
        PublishersModule,
        UsersModule,
        SessionsModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                {path: 'sessions/login', method: RequestMethod.POST},
                {path: 'users/register', method: RequestMethod.POST},
            )
            .forRoutes('*');
    }
}
