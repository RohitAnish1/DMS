// Main Application Module for DMS Backend (NestJS)
// This is the root module that imports and configures all other modules in the application
// It serves as the entry point for the NestJS dependency injection system

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { LocationsModule } from './locations/locations.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [
    AuthModule,          // Handles authentication and authorization
    UsersModule,         // Manages user accounts (both doctors and patients)
    DoctorsModule,       // Manages doctor-specific functionality
    AppointmentsModule,  // Handles appointment scheduling and management
    LocationsModule,     // Manages clinic/office locations
    PatientsModule,      // Manages patient-specific functionality
  ],
  controllers: [AppController],  // Root controller for basic app routes
  providers: [AppService],       // Root service for basic app functionality
})
export class AppModule {}
