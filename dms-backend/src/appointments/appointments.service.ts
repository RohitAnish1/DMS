import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.appointment.findMany({ include: { doctor: true, patient: true } });
  }

  async findOne(id: number) {
    return this.prisma.appointment.findUnique({ where: { id }, include: { doctor: true, patient: true } });
  }
}
