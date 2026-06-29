import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { EmpruntsModule } from '../emprunts/emprunts.module';
import { LivresModule } from '../livres/livres.module';

@Module({
  imports: [UsersModule, EmpruntsModule, LivresModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}