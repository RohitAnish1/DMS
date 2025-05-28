import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth.module';
@Module({
  imports: [AuthModule], // Add AuthModule to imports
  controllers: [PatientsController],
  providers: [PatientsService, PrismaService],
  exports: [PatientsService],
})
export class PatientsModule {}
