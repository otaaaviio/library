import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
  constructor() {
    super({
      host: 'redis',
      port: 6379,
    } as RedisOptions);

    this.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
    });
  }

  async onModuleInit() {
    try {
      await this.connect();
    } catch (err) {
      Logger.error('Failed to connect to Redis:', err);
      throw err;
    }
  }
}
