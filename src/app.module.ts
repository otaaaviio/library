import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { PublishersModule } from './modules/publishers/publishers.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { BooksModule } from './modules/books/books.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { UserBooksModule } from './modules/userBooks/userBooks.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PrismaModule,
    UserBooksModule,
    CloudinaryModule,
    AuthorsModule,
    BooksModule,
    ReviewsModule,
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
        { path: 'sessions/login', method: RequestMethod.POST },
        { path: 'users/register', method: RequestMethod.POST },
        { path: 'publishers', method: RequestMethod.GET },
        { path: 'publishers/:id', method: RequestMethod.GET },
        { path: 'books', method: RequestMethod.GET },
        { path: 'books/:id', method: RequestMethod.GET },
        { path: 'authors', method: RequestMethod.GET },
        { path: 'authors/:id', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'reviews', method: RequestMethod.GET },
        { path: 'reviews/:id', method: RequestMethod.GET },
      )
      .forRoutes('*');

    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
