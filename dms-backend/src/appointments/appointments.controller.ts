// Appointments Controller - HTTP API endpoints for appointment management
// This controller handles all HTTP requests related to appointments
// and routes them to the appropriate service methods

import { Controller, Get, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')  // Base route: /appointments
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // GET /appointments - Retrieve all appointments
  // Returns a list of all appointments with doctor and patient details
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  // GET /appointments/:id - Retrieve a specific appointment
  // Returns detailed information for a single appointment
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(Number(id));
  }
}
