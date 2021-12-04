import type { ClientOpts as RedisClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketIoGateway } from './socket-io.gateway';

@Module({
  imports: [
    CacheModule.register<RedisClientOpts>({
      isGlobal: true,
      store: redisStore,
      // Store-specific configuration:
      host: 'localhost',
      port: 6379,
      ttl: 1000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, SocketIoGateway],
})
export class AppModule {}
