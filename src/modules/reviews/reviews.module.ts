import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
