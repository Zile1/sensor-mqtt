import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { SensorData } from './app.dto';
import { MqttValidationPipe } from './app.validation-pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('sensor/+')
  public async create(
    @Payload(new MqttValidationPipe()) sensorData: SensorData,
    @Ctx() context: MqttContext,
  ) {
    return this.appService.save(sensorData, context);
  }
}
