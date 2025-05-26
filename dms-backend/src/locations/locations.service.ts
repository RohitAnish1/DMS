import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    // Fetch all locations with their associated doctor
    return this.prisma.location.findMany({ include: { doctor: true } });
  }

  async findOne(id: number) {
    // Fetch a single location by ID with its associated doctor
    return this.prisma.location.findUnique({ where: { id }, include: { doctor: true } });
  }
}
