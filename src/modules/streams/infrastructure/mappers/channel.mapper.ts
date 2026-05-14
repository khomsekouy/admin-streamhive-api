import { Channel as PrismaChannel } from '@prisma/client';
import { Channel } from '../../domain/channel.entity';

export class ChannelMapper {
  static toDomain(record: PrismaChannel): Channel {
    return Channel.rehydrate(record.id, {
      name: record.name,
      slug: record.slug,
      description: record.description,
      ownerId: record.ownerId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(channel: Channel): PrismaChannel {
    return {
      id: channel.id,
      name: channel.name,
      slug: channel.slug,
      description: channel.description,
      ownerId: channel.ownerId,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
    };
  }
}
