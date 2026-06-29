import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MeteoService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  async getMeteo() {
    const apiKey = this.config.get('OPENWEATHER_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Dakar&appid=${apiKey}&units=metric&lang=fr`;

    const { data } = await firstValueFrom(this.httpService.get(url));

    return {
      ville: data.name,
      pays: data.sys.country,
      temperature: data.main.temp,
      ressenti: data.main.feels_like,
      humidite: data.main.humidity,
      description: data.weather[0].description,
      icone: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      vent: data.wind.speed,
    };
  }
}