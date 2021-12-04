import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  const mqtt = await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://localhost:1883',
      username: 'mosquitto',
      password: 'mosquitto',
    },
  });

  await app.startAllMicroservices();
  await app.listen(8088);
}
bootstrap();
