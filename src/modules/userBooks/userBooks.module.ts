import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserBooksController } from './userBooks.controller';
import { UserBooksService } from './userBooks.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [UserBooksController],
  providers: [UserBooksService],
})
export class UserBooksModule {}
