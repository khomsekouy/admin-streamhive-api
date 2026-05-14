import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/domain.exception';
import {
  STREAM_REPOSITORY,
  StreamRepository,
} from '../../domain/stream.repository';
import { StreamDto, toStreamDto } from '../dtos/stream.dto';

export type StreamTransition = 'start' | 'end' | 'archive';

export interface TransitionStreamInput {
  id: string;
  action: StreamTransition;
}

@Injectable()
export class TransitionStreamUseCase
  implements UseCase<TransitionStreamInput, StreamDto>
{
  constructor(
    @Inject(STREAM_REPOSITORY)
    private readonly streams: StreamRepository,
  ) {}

  async execute(input: TransitionStreamInput): Promise<StreamDto> {
    const stream = await this.streams.findById(input.id);
    if (!stream) throw new EntityNotFoundException('Stream', input.id);

    switch (input.action) {
      case 'start':
        stream.start();
        break;
      case 'end':
        stream.end();
        break;
      case 'archive':
        stream.archive();
        break;
    }

    return toStreamDto(await this.streams.save(stream));
  }
}
