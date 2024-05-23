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
import {VerifyOwnershipMiddleware} from "./middlewares/verifyOwnership.middleware";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
        PrismaModule,
        AuthorsModule,
        UsersModule,
        SessionsModule,
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

        consumer.apply(VerifyOwnershipMiddleware)
            .exclude(
                {path: 'users/:id', method: RequestMethod.GET},
            )
            .forRoutes('authors/:id', 'users/:id');
    }
}
