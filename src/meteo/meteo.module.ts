import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MeteoService } from './meteo.service';
import { MeteoController } from './meteo.controller';

@Module({
  imports: [HttpModule],
  providers: [MeteoService],
  controllers: [MeteoController],
})
export class MeteoModule {}