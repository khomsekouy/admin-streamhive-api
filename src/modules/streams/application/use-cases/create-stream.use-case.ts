import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/domain.exception';
import {
  CHANNEL_REPOSITORY,
  ChannelRepository,
} from '../../domain/channel.repository';
import { Stream } from '../../domain/stream.entity';
import {
  STREAM_REPOSITORY,
  StreamRepository,
} from '../../domain/stream.repository';
import { StreamDto, toStreamDto } from '../dtos/stream.dto';

export interface CreateStreamInput {
  channelId: string;
  createdById: string;
  title: string;
  description?: string;
  scheduledAt?: Date;
}

@Injectable()
export class CreateStreamUseCase
  implements UseCase<CreateStreamInput, StreamDto>
{
  constructor(
    @Inject(STREAM_REPOSITORY)
    private readonly streams: StreamRepository,
    @Inject(CHANNEL_REPOSITORY)
    private readonly channels: ChannelRepository,
  ) {}

  async execute(input: CreateStreamInput): Promise<StreamDto> {
    const channel = await this.channels.findById(input.channelId);
    if (!channel) {
      throw new EntityNotFoundException('Channel', input.channelId);
    }

    const now = new Date();
    const stream = Stream.create(randomUUID(), {
      channelId: channel.id,
      createdById: input.createdById,
      title: input.title,
      description: input.description ?? null,
      status: 'DRAFT',
      scheduledAt: null,
      startedAt: null,
      endedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    if (input.scheduledAt) {
      stream.schedule(input.scheduledAt);
    }

    return toStreamDto(await this.streams.save(stream));
  }
}
