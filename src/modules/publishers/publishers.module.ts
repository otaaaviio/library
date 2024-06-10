import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [PublishersController],
  providers: [PublishersService],
})
export class PublishersModule {}
