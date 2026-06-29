import { Controller, Get } from '@nestjs/common';
import { MeteoService } from './meteo.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Meteo')
@Controller('meteo')
export class MeteoController {
  constructor(private meteoService: MeteoService) {}

  @Get('dakar')
  @ApiOperation({ summary: 'Météo actuelle de Dakar' })
  getMeteo() {
    return this.meteoService.getMeteo();
  }
}