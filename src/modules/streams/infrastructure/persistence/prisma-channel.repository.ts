import { Injectable } from '@nestjs/common';
import {
  Paginated,
  PaginationInput,
  normalizePagination,
} from '../../../../shared/application/pagination';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Channel } from '../../domain/channel.entity';
import { ChannelRepository } from '../../domain/channel.repository';
import { ChannelMapper } from '../mappers/channel.mapper';

@Injectable()
export class PrismaChannelRepository implements ChannelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Channel | null> {
    const record = await this.prisma.channel.findUnique({ where: { id } });
    return record ? ChannelMapper.toDomain(record) : null;
  }

  async findBySlug(slug: string): Promise<Channel | null> {
    const record = await this.prisma.channel.findUnique({ where: { slug } });
    return record ? ChannelMapper.toDomain(record) : null;
  }

  async list(input: PaginationInput): Promise<Paginated<Channel>> {
    const { page, pageSize, skip, take } = normalizePagination(input);
    const [records, total] = await this.prisma.$transaction([
      this.prisma.channel.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.channel.count(),
    ]);
    return {
      items: records.map(ChannelMapper.toDomain),
      total,
      page,
      pageSize,
    };
  }

  async save(channel: Channel): Promise<Channel> {
    const data = ChannelMapper.toPersistence(channel);
    const record = await this.prisma.channel.upsert({
      where: { id: data.id },
      create: data,
      update: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        ownerId: data.ownerId,
      },
    });
    return ChannelMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.channel.delete({ where: { id } });
  }
}
