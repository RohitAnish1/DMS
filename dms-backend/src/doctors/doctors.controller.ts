import { Controller, Get, Param, Post, Body, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DoctorsService } from './doctors.service';
import type { File as MulterFile } from 'multer';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get('available')
  async getAvailableDoctors(@Query('specialization') specialization?: string) {
    return this.doctorsService.getAvailableDoctors(specialization);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const doctorId = Number(id);
    if (!doctorId || isNaN(doctorId)) {
      return { success: false, message: 'Invalid doctor id' };
    }
    return this.doctorsService.findOne(doctorId);
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

  @Post('profile')
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async setupProfile(@UploadedFile() profilePhoto: MulterFile, @Body() body: any) {
    // Now you can access profilePhoto and other fields in body
    return this.doctorsService.setupProfile({ ...body, profilePhoto });
  }

  @Post('locations')
  async addPracticeLocation(@Body() body: any) {
    // Stub: implement add practice location logic here
    return this.doctorsService.addPracticeLocation(body);
  }

  @Post('locations/:locationId/availability')
  async setAvailability(@Param('locationId') locationId: string, @Body() body: any) {
    // Stub: implement set availability logic here
    return this.doctorsService.setAvailability(locationId, body);
  }
}
