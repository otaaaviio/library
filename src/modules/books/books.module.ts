import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import {CloudinaryModule} from "../cloudinary/cloudinary.module";

@Module({
  imports: [PrismaModule, RedisModule, CloudinaryModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
