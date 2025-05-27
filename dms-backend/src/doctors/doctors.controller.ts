import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(Number(id));
  }

  @Post('complete-onboarding')
  async completeOnboarding(@Body() body: any) {
    // You can add logic to mark onboarding as complete for the doctor
    return this.doctorsService.completeOnboarding(body);
  }

  @Post('register')
  async register(@Body() body: any) {
    // Validate required fields
    const requiredFields = ['email', 'password', 'fullName', 'phone', 'medicalRegistrationNumber'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return { success: false, message: `${field} is required` };
      }
    }
    return this.doctorsService.register(body);
  }
}
