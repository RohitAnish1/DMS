import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.doctor.findMany({ include: { user: true, locations: true } });
  }

  async findOne(id: number) {
    if (!id) {
      throw new Error('Doctor id is required');
    }
    return this.prisma.doctor.findUnique({ where: { id }, include: { user: true, locations: true } });
  }

  async completeOnboarding(body: any) {
    // Stub: mark onboarding as complete for the doctor (implement logic as needed)
    return { success: true, message: 'Onboarding completed (stub)' };
  }

  async register(data: any) {
    // Validate required fields
    const requiredFields = ['email', 'password', 'fullName', 'phone', 'medicalRegistrationNumber'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return { success: false, message: `${field} is required` };
      }
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.fullName,
        role: 'doctor',
        phone: data.phone,
        medicalRegistrationNumber: data.medicalRegistrationNumber,
      },
    });

    // Create doctor profile
    const doctor = await this.prisma.doctor.create({
      data: {
        userId: user.id,
        specialty: data.specialization || '',
        // Add more fields if your schema supports them
      },
    });

    // Optionally, update user or doctor with phone and medicalRegistrationNumber if your schema supports it

    return {
      success: true,
      message: 'Doctor registered successfully',
      data: { user, doctor },
    };
  }

  async setupProfile(data: any) {
    // Stub: implement doctor profile setup logic here
    return { success: true, message: 'Doctor profile setup (stub)' };
  }

  async addPracticeLocation(data: any) {
    // Stub: implement add practice location logic here
    return { success: true, message: 'Practice location added (stub)' };
  }

  async setAvailability(locationId: string, data: any) {
    // Stub: implement set availability logic here
    return { success: true, message: 'Availability set (stub)' };
  }

  async getAvailableDoctors(specialization?: string) {
    try {
      const where: any = {};
      if (specialization) {
        where.specialty = { contains: specialization, mode: 'insensitive' };
      }
      const doctors = await this.prisma.doctor.findMany({
        where,
        include: {
          user: true,
          locations: true,
        },
      });
      // Format doctors for frontend
      const formatted = doctors.map((doc) => ({
        id: String(doc.id),
        name: doc.user?.name || '',
        specialization: doc.specialty || '',
        locations: (doc.locations || []).map((loc) => ({
          id: String(loc.id),
          address: loc.address || '',
        })),
      }));
      return { success: true, data: formatted };
    } catch (error) {
      return { success: false, message: error.message || 'Failed to fetch doctors' };
    }
  }
}
