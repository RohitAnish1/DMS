import { Controller, Post, Body, Get, Put, Req, UseGuards, Delete, Param } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService, private readonly jwtService: JwtService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.patientsService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.patientsService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return this.patientsService.getProfile(req.user.userId || req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req, @Body() body: any) {
    return this.patientsService.updateProfile(req.user.userId || req.user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('appointments')
  async listAppointments(@Req() req) {
    return this.patientsService.listAppointments(req.user.userId || req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('appointments')
  async bookAppointment(@Req() req, @Body() body: any) {
    return this.patientsService.bookAppointment(req.user.userId || req.user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('appointments/:id')
  async cancelAppointment(@Req() req, @Param('id') id: string) {
    return this.patientsService.cancelAppointment(req.user.userId || req.user.sub, Number(id));
  }
}
