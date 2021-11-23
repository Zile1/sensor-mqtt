import { IsInt, IsNotEmpty } from 'class-validator';

export class SensorData {
  @IsNotEmpty()
  @IsInt()
  temperature: number;
}
