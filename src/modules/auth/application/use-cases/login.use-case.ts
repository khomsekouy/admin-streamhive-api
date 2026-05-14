import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UnauthorizedDomainException } from '../../../../shared/domain/domain.exception';
import { UseCase } from '../../../../shared/application/use-case.interface';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../../../users/application/ports/password-hasher.port';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../users/domain/user.repository';
import { RefreshToken } from '../../domain/refresh-token.entity';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../domain/refresh-token.repository';
import { AuthTokensDto } from '../dtos/auth-tokens.dto';
import { TOKEN_SERVICE, TokenService } from '../ports/token-service.port';

export interface LoginInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase implements UseCase<LoginInput, AuthTokensDto> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  async execute(input: LoginInput): Promise<AuthTokensDto> {
    const user = await this.users.findByEmail(input.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedDomainException('Invalid credentials');
    }

    const ok = await this.hasher.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedDomainException('Invalid credentials');
    }

    const jti = randomUUID();
    const accessToken = await this.tokens.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refresh = await this.tokens.signRefreshToken({
      sub: user.id,
      jti,
    });

    await this.refreshTokens.save(
      RefreshToken.issue(
        jti,
        user.id,
        this.tokens.hashRefreshToken(refresh.token),
        refresh.expiresAt,
      ),
    );

    return {
      accessToken,
      refreshToken: refresh.token,
      tokenType: 'Bearer',
    };
  }
}
