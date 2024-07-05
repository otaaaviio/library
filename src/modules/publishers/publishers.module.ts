import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';
import { PublishersRepository } from './publishers.repository';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [PublishersController],
  providers: [
    {
      provide: 'PublishersServiceInterface',
      useClass: PublishersService,
    },
    {
      provide: 'PublishersRepositoryInterface',
      useClass: PublishersRepository,
    },
  ],
})
export class PublishersModule {}
