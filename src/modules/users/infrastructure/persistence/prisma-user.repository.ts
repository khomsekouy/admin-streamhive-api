import { Injectable } from '@nestjs/common';
import {
  Paginated,
  PaginationInput,
  normalizePagination,
} from '../../../../shared/application/pagination';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return record ? UserMapper.toDomain(record) : null;
  }

  async list(input: PaginationInput): Promise<Paginated<User>> {
    const { page, pageSize, skip, take } = normalizePagination(input);
    const [records, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return {
      items: records.map(UserMapper.toDomain),
      total,
      page,
      pageSize,
    };
  }

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const record = await this.prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role,
        isActive: data.isActive,
      },
    });
    return UserMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
