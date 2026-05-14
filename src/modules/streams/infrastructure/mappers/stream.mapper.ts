import {
  Stream as PrismaStream,
  StreamStatus as PrismaStreamStatus,
} from '@prisma/client';
import { Stream, StreamStatus } from '../../domain/stream.entity';

export class StreamMapper {
  static toDomain(record: PrismaStream): Stream {
    return Stream.rehydrate(record.id, {
      channelId: record.channelId,
      createdById: record.createdById,
      title: record.title,
      description: record.description,
      status: record.status as StreamStatus,
      scheduledAt: record.scheduledAt,
      startedAt: record.startedAt,
      endedAt: record.endedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(stream: Stream): PrismaStream {
    return {
      id: stream.id,
      channelId: stream.channelId,
      createdById: stream.createdById,
      title: stream.title,
      description: stream.description,
      status: stream.status as PrismaStreamStatus,
      scheduledAt: stream.scheduledAt,
      startedAt: stream.startedAt,
      endedAt: stream.endedAt,
      createdAt: stream.createdAt,
      updatedAt: stream.updatedAt,
    };
  }
}
