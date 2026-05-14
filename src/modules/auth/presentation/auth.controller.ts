import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../shared/presentation/pipes/zod-validation.pipe';
import { Public } from '../../../shared/presentation/decorators/public.decorator';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../../shared/presentation/decorators/current-user.decorator';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { LogoutUseCase } from '../application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { LoginDto, loginSchema } from './dtos/login.request';
import { RefreshDto, refreshSchema } from './dtos/refresh.request';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly login: LoginUseCase,
    private readonly refresh: RefreshTokenUseCase,
    private readonly logout: LogoutUseCase,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  loginUser(@Body() dto: LoginDto) {
    return this.login.execute(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(refreshSchema))
  refreshToken(@Body() dto: RefreshDto) {
    return this.refresh.execute(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutUser(@CurrentUser() user: CurrentUserPayload): Promise<void> {
    await this.logout.execute(user.id);
  }
}
