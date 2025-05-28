import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async register(data: any) {
    const { email, password, fullName, phone, dateOfBirth, gender, address, profilePhoto } = data;
    if (!email || !password || !fullName || !phone || !dateOfBirth || !gender || !address) {
      throw new BadRequestException('All fields are required');
    }
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        role: 'patient',
        phone,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        profilePhoto: profilePhoto || '',
        medicalRegistrationNumber: '', // patients don't have this
      },
    });
    return { id: user.id, email: user.email, name: user.name };
  }

  async login(data: any) {
    const { email, password } = data;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== 'patient') {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token, patient: { id: user.id, fullName: user.name, email: user.email } };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        profilePhoto: true,
        role: true,
      },
    });
    if (!user || user.role !== 'patient') throw new NotFoundException('Patient not found');
    return {
      id: user.id,
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      profilePhoto: user.profilePhoto,
    };
  }

  async updateProfile(userId: number, data: any) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.fullName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        address: data.address,
        profilePhoto: data.profilePhoto || undefined,
      },
    });
    return {
      id: user.id,
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      profilePhoto: user.profilePhoto,
    };
  }

  async listAppointments(userId: number) {
    return this.prisma.appointment.findMany({
      where: { patientId: userId },
      include: { doctor: { include: { user: true } }, },
      orderBy: { date: 'desc' },
    });
  }

  async bookAppointment(userId: number, data: any) {
    const { doctorId, date } = data;
    if (!doctorId || !date) throw new BadRequestException('doctorId and date are required');
    // Optionally: check doctor exists, check slot availability, etc.
    const appointment = await this.prisma.appointment.create({
      data: {
        doctorId: Number(doctorId),
        patientId: userId,
        date: new Date(date),
        status: 'booked',
      },
    });
    return appointment;
  }

  async cancelAppointment(userId: number, appointmentId: number) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment || appointment.patientId !== userId) {
      throw new NotFoundException('Appointment not found');
    }
    await this.prisma.appointment.delete({ where: { id: appointmentId } });
    return { success: true };
  }
}
