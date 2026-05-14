import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../shared/presentation/pipes/zod-validation.pipe';
import { Roles } from '../../../shared/presentation/decorators/roles.decorator';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../../shared/presentation/decorators/current-user.decorator';
import { CreateStreamUseCase } from '../application/use-cases/create-stream.use-case';
import { ListStreamsUseCase } from '../application/use-cases/list-streams.use-case';
import { TransitionStreamUseCase } from '../application/use-cases/transition-stream.use-case';
import {
  CreateStreamDto,
  createStreamSchema,
} from './dtos/create-stream.request';
import {
  ListStreamsQueryDto,
  listStreamsQuerySchema,
} from './dtos/list-streams.query';

@ApiTags('Streams')
@ApiBearerAuth()
@Controller('streams')
export class StreamsController {
  constructor(
    private readonly createStream: CreateStreamUseCase,
    private readonly listStreams: ListStreamsUseCase,
    private readonly transitionStream: TransitionStreamUseCase,
  ) {}

  @Post()
  @Roles('ADMIN', 'EDITOR')
  @UsePipes(new ZodValidationPipe(createStreamSchema))
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateStreamDto,
  ) {
    return this.createStream.execute({ ...dto, createdById: user.id });
  }

  @Get()
  list(
    @Query(new ZodValidationPipe(listStreamsQuerySchema))
    query: ListStreamsQueryDto,
  ) {
    return this.listStreams.execute(query);
  }

  @Post(':id/start')
  @Roles('ADMIN', 'EDITOR')
  start(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.transitionStream.execute({ id, action: 'start' });
  }

  @Post(':id/end')
  @Roles('ADMIN', 'EDITOR')
  end(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.transitionStream.execute({ id, action: 'end' });
  }

  @Post(':id/archive')
  @Roles('ADMIN')
  archive(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.transitionStream.execute({ id, action: 'archive' });
  }
}
