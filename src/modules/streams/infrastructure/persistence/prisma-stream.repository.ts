import { Injectable } from '@nestjs/common';
import { StreamStatus as PrismaStreamStatus } from '@prisma/client';
import {
  Paginated,
  normalizePagination,
} from '../../../../shared/application/pagination';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Stream } from '../../domain/stream.entity';
import {
  ListStreamsFilters,
  StreamRepository,
} from '../../domain/stream.repository';
import { StreamMapper } from '../mappers/stream.mapper';

@Injectable()
export class PrismaStreamRepository implements StreamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Stream | null> {
    const record = await this.prisma.stream.findUnique({ where: { id } });
    return record ? StreamMapper.toDomain(record) : null;
  }

  async list(filters: ListStreamsFilters): Promise<Paginated<Stream>> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = {
      ...(filters.channelId ? { channelId: filters.channelId } : {}),
      ...(filters.status
        ? { status: filters.status as PrismaStreamStatus }
        : {}),
    };
    const [records, total] = await this.prisma.$transaction([
      this.prisma.stream.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stream.count({ where }),
    ]);
    return {
      items: records.map(StreamMapper.toDomain),
      total,
      page,
      pageSize,
    };
  }

  async save(stream: Stream): Promise<Stream> {
    const data = StreamMapper.toPersistence(stream);
    const record = await this.prisma.stream.upsert({
      where: { id: data.id },
      create: data,
      update: {
        title: data.title,
        description: data.description,
        status: data.status,
        scheduledAt: data.scheduledAt,
        startedAt: data.startedAt,
        endedAt: data.endedAt,
      },
    });
    return StreamMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.stream.delete({ where: { id } });
  }
}
