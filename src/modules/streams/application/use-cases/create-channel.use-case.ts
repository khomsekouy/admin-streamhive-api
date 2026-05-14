import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConflictException } from '../../../../shared/domain/domain.exception';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Channel } from '../../domain/channel.entity';
import {
  CHANNEL_REPOSITORY,
  ChannelRepository,
} from '../../domain/channel.repository';
import { ChannelDto, toChannelDto } from '../dtos/channel.dto';

export interface CreateChannelInput {
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
}

@Injectable()
export class CreateChannelUseCase
  implements UseCase<CreateChannelInput, ChannelDto>
{
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channels: ChannelRepository,
  ) {}

  async execute(input: CreateChannelInput): Promise<ChannelDto> {
    const existing = await this.channels.findBySlug(input.slug);
    if (existing) {
      throw new ConflictException(`Slug "${input.slug}" already in use`);
    }
    const now = new Date();
    const channel = Channel.create(randomUUID(), {
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      ownerId: input.ownerId,
      createdAt: now,
      updatedAt: now,
    });
    return toChannelDto(await this.channels.save(channel));
  }
}
