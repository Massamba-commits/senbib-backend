import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpruntDto {
  @ApiProperty()
  @IsNumber()
  livreId: number;
}