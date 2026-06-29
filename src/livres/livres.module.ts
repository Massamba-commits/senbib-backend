import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livre } from './livre.entity';
import { LivresService } from './livres.service';
import { LivresController } from './livres.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Livre])],
  providers: [LivresService],
  controllers: [LivresController],
  exports: [LivresService],
})
export class LivresModule {}