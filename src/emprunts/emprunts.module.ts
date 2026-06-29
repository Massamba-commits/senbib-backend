import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emprunt } from './emprunt.entity';
import { EmpruntsService } from './emprunts.service';
import { EmpruntsController } from './emprunts.controller';
import { LivresModule } from '../livres/livres.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Emprunt]),
    LivresModule,
    UsersModule,
  ],
  providers: [EmpruntsService],
  controllers: [EmpruntsController],
  exports: [EmpruntsService],
})
export class EmpruntsModule {}