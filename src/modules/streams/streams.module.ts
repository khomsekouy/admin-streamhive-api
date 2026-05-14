import { Module } from '@nestjs/common';
import { CHANNEL_REPOSITORY } from './domain/channel.repository';
import { STREAM_REPOSITORY } from './domain/stream.repository';
import { CreateChannelUseCase } from './application/use-cases/create-channel.use-case';
import { GetChannelUseCase } from './application/use-cases/get-channel.use-case';
import { ListChannelsUseCase } from './application/use-cases/list-channels.use-case';
import { CreateStreamUseCase } from './application/use-cases/create-stream.use-case';
import { ListStreamsUseCase } from './application/use-cases/list-streams.use-case';
import { TransitionStreamUseCase } from './application/use-cases/transition-stream.use-case';
import { PrismaChannelRepository } from './infrastructure/persistence/prisma-channel.repository';
import { PrismaStreamRepository } from './infrastructure/persistence/prisma-stream.repository';
import { ChannelsController } from './presentation/channels.controller';
import { StreamsController } from './presentation/streams.controller';

@Module({
  controllers: [ChannelsController, StreamsController],
  providers: [
    CreateChannelUseCase,
    GetChannelUseCase,
    ListChannelsUseCase,
    CreateStreamUseCase,
    ListStreamsUseCase,
    TransitionStreamUseCase,
    { provide: CHANNEL_REPOSITORY, useClass: PrismaChannelRepository },
    { provide: STREAM_REPOSITORY, useClass: PrismaStreamRepository },
  ],
})
export class StreamsModule {}
