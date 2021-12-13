import { IsNotEmpty, IsNumber } from 'class-validator';
import { Optional } from '@nestjs/common';

export class SensorData {
  @IsNotEmpty()
  @IsNumber()
  temperature: number;

  @Optional()
  id: number;
}
