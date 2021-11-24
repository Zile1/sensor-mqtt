import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { SensorData } from './app.dto';
import { Cache } from 'cache-manager';
import { MqttContext } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async save(sensorData: SensorData, context: MqttContext) {
    await this.saveKey(context);
    return await this.cacheManager.set(context.getTopic(), sensorData);
  }

  private async saveKey(context: MqttContext): Promise<boolean> {
    let existingKeys =
      (await this.cacheManager.get<Array<string>>('sensor/keys')) ?? [];

    const topic = context.getTopic();
    existingKeys.push(topic);
    existingKeys = [...new Set(existingKeys)];
    await this.cacheManager.set('sensor/keys', existingKeys);
    return true;
  }
}
