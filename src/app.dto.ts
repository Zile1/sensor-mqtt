import { IsNotEmpty, IsNumber } from 'class-validator';

export class SensorData {
  @IsNotEmpty()
  @IsNumber()
  temperature: number;
}
