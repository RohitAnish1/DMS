// Appointments Service - Business logic for appointment management
// This service handles all appointment-related operations including CRUD operations
// and business rules for appointment scheduling

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // Retrieve all appointments with related doctor and patient information
  // Used for admin views and reporting
  async findAll() {
    return this.prisma.appointment.findMany({ 
      include: { 
        doctor: true,   // Include doctor details
        patient: true   // Include patient details
      } 
    });
  }

  // Retrieve a specific appointment by ID with related information
  // Used for appointment details and updates
  async findOne(id: number) {
    return this.prisma.appointment.findUnique({ 
      where: { id }, 
      include: { 
        doctor: true,   // Include doctor details
        patient: true   // Include patient details
      } 
    });
  }
}
