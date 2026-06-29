import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLivreDto {
  @ApiProperty()
  @IsString()
  titre: string;

  @ApiProperty()
  @IsString()
  auteur: string;

  @ApiProperty()
  @IsString()
  genre: string;

  @ApiProperty()
  @IsNumber()
  annee: number;

  @ApiProperty({ default: 3 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;
}