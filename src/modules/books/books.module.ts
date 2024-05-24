import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import {BooksController} from "./books.controller";
import {BooksService} from "./books.service";

@Module({
    imports: [PrismaModule, RedisModule],
    controllers: [BooksController],
    providers: [BooksService],
})
export class BooksModule {}
