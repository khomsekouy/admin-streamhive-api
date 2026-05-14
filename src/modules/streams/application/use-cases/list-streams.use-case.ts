import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { Paginated } from '../../../../shared/application/pagination';
import {
  ListStreamsFilters,
  STREAM_REPOSITORY,
  StreamRepository,
} from '../../domain/stream.repository';
import { StreamDto, toStreamDto } from '../dtos/stream.dto';

@Injectable()
export class ListStreamsUseCase
  implements UseCase<ListStreamsFilters, Paginated<StreamDto>>
{
  constructor(
    @Inject(STREAM_REPOSITORY)
    private readonly streams: StreamRepository,
  ) {}

  async execute(filters: ListStreamsFilters): Promise<Paginated<StreamDto>> {
    const result = await this.streams.list(filters);
    return { ...result, items: result.items.map(toStreamDto) };
  }
}
