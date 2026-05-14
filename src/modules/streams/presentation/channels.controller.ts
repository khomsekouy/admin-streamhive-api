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
import { CreateChannelUseCase } from '../application/use-cases/create-channel.use-case';
import { GetChannelUseCase } from '../application/use-cases/get-channel.use-case';
import { ListChannelsUseCase } from '../application/use-cases/list-channels.use-case';
import {
  CreateChannelDto,
  createChannelSchema,
} from './dtos/create-channel.request';
import {
  ListUsersQueryDto,
  listUsersQuerySchema,
} from '../../users/presentation/dtos/list-users.query';

@ApiTags('Channels')
@ApiBearerAuth()
@Controller('channels')
export class ChannelsController {
  constructor(
    private readonly createChannel: CreateChannelUseCase,
    private readonly getChannel: GetChannelUseCase,
    private readonly listChannels: ListChannelsUseCase,
  ) {}

  @Post()
  @Roles('ADMIN', 'EDITOR')
  @UsePipes(new ZodValidationPipe(createChannelSchema))
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateChannelDto,
  ) {
    return this.createChannel.execute({ ...dto, ownerId: user.id });
  }

  @Get()
  list(
    @Query(new ZodValidationPipe(listUsersQuerySchema)) query: ListUsersQueryDto,
  ) {
    return this.listChannels.execute(query);
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.getChannel.execute(id);
  }
}
