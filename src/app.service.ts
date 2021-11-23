import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { SensorData } from './app.dto';
import { Cache } from 'cache-manager';
import { MqttContext } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async save(sensorData: SensorData, context: MqttContext) {
    return await this.cacheManager.set(context.getTopic(), sensorData, {
      ttl: 1000,
    });
  }
}
