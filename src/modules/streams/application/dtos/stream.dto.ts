import { Stream, StreamStatus } from '../../domain/stream.entity';

export interface StreamDto {
  id: string;
  channelId: string;
  createdById: string;
  title: string;
  description: string | null;
  status: StreamStatus;
  scheduledAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toStreamDto = (s: Stream): StreamDto => ({
  id: s.id,
  channelId: s.channelId,
  createdById: s.createdById,
  title: s.title,
  description: s.description,
  status: s.status,
  scheduledAt: s.scheduledAt?.toISOString() ?? null,
  startedAt: s.startedAt?.toISOString() ?? null,
  endedAt: s.endedAt?.toISOString() ?? null,
  createdAt: s.createdAt.toISOString(),
  updatedAt: s.updatedAt.toISOString(),
});
