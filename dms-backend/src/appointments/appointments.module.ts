// Appointments Module - Module configuration for appointment functionality
// This module bundles all appointment-related components (controllers, services, providers)
// and makes them available to the rest of the application

import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AppointmentsController],  // HTTP request handlers for appointments
  providers: [
    AppointmentsService,  // Business logic for appointment operations
    PrismaService,        // Database service for data persistence
  ],
  exports: [AppointmentsService],  // Make service available to other modules
})
export class AppointmentsModule {}
