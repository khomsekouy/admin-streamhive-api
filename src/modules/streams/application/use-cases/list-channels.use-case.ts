import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import {
  Paginated,
  PaginationInput,
} from '../../../../shared/application/pagination';
import {
  CHANNEL_REPOSITORY,
  ChannelRepository,
} from '../../domain/channel.repository';
import { ChannelDto, toChannelDto } from '../dtos/channel.dto';

@Injectable()
export class ListChannelsUseCase
  implements UseCase<PaginationInput, Paginated<ChannelDto>>
{
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channels: ChannelRepository,
  ) {}

  async execute(input: PaginationInput): Promise<Paginated<ChannelDto>> {
    const result = await this.channels.list(input);
    return { ...result, items: result.items.map(toChannelDto) };
  }
}
