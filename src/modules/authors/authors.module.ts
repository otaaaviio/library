import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { AuthorsRepository } from './authors.repository';

@Module({
  imports: [RedisModule],
  controllers: [AuthorsController],
  providers: [
    {
      provide: 'AuthorsRepositoryInterface',
      useClass: AuthorsRepository,
    },
    {
      provide: 'AuthorsServiceInterface',
      useClass: AuthorsService,
    },
  ],
})
export class AuthorsModule {}
