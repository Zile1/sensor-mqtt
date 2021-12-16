import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { SensorData } from './app.dto';
import { Cache } from 'cache-manager';
import { MqttContext } from '@nestjs/microservices';
import { SocketIoGateway } from './socket-io.gateway';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly socket: SocketIoGateway,
  ) {}

  public async save(sensorData: SensorData, context: MqttContext) {
    const topic = context.getTopic();
    sensorData.id = await AppService.getIdFromTopic(topic);
    await this.saveKey(context);
    // await this.socket.emitInRoom(topic, sensorData);
    await this.socket.emit(sensorData);
    return await this.cacheManager.set(topic, sensorData);
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

  public static async getIdFromTopic(topic: string): Promise<number> {
    const splitTopic = topic.split('/');
    return parseInt(splitTopic[1]) ?? null;
  }
}
