import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.doctor.findMany({ include: { user: true, locations: true } });
  }

  async findOne(id: number) {
    return this.prisma.doctor.findUnique({ where: { id }, include: { user: true, locations: true } });
  }

  async completeOnboarding(body: any) {
    // Stub: mark onboarding as complete for the doctor (implement logic as needed)
    return { success: true, message: 'Onboarding completed (stub)' };
  }
}
