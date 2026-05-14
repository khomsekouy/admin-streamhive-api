import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/domain.exception';
import {
  CHANNEL_REPOSITORY,
  ChannelRepository,
} from '../../domain/channel.repository';
import { ChannelDto, toChannelDto } from '../dtos/channel.dto';

@Injectable()
export class GetChannelUseCase implements UseCase<string, ChannelDto> {
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channels: ChannelRepository,
  ) {}

  async execute(id: string): Promise<ChannelDto> {
    const channel = await this.channels.findById(id);
    if (!channel) throw new EntityNotFoundException('Channel', id);
    return toChannelDto(channel);
  }
}
