import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LivresModule } from './livres/livres.module';
import { EmpruntsModule } from './emprunts/emprunts.module';
import { AdminModule } from './admin/admin.module';
import { MeteoModule } from './meteo/meteo.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get<number>('DB_PORT')!,
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    LivresModule,
    EmpruntsModule,
    AdminModule,
    MeteoModule,
    MeteoModule,
    HttpModule,
  ],
})
export class AppModule {}