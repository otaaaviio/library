import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
  constructor() {
    super({
      host: 'localhost',
      port: 6379,
    } as RedisOptions);

    this.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
    });
  }

  async onModuleInit() {
  }
}
