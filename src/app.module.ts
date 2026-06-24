import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LivresModule } from './livres/livres.module';
import { EmpruntsModule } from './emprunts/emprunts.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, UsersModule, LivresModule, EmpruntsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
