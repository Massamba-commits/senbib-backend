import { Module } from '@nestjs/common';
import { EmpruntsController } from './emprunts.controller';
import { EmpruntsService } from './emprunts.service';

@Module({
  controllers: [EmpruntsController],
  providers: [EmpruntsService]
})
export class EmpruntsModule {}
