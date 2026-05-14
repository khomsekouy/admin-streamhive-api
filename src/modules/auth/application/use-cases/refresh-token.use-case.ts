import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UnauthorizedDomainException } from '../../../../shared/domain/domain.exception';
import { UseCase } from '../../../../shared/application/use-case.interface';
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

export interface RefreshInput {
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase
  implements UseCase<RefreshInput, AuthTokensDto>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(TOKEN_SERVICE) private readonly tokens: TokenService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  async execute(input: RefreshInput): Promise<AuthTokensDto> {
    let payload;
    try {
      payload = await this.tokens.verifyRefreshToken(input.refreshToken);
    } catch {
      throw new UnauthorizedDomainException('Invalid refresh token');
    }

    const stored = await this.refreshTokens.findByHash(
      this.tokens.hashRefreshToken(input.refreshToken),
    );
    if (!stored || !stored.isActive()) {
      // Possible reuse — revoke all tokens for this user.
      await this.refreshTokens.revokeAllForUser(payload.sub);
      throw new UnauthorizedDomainException('Refresh token no longer valid');
    }

    const user = await this.users.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedDomainException('User not available');
    }

    // Rotate: revoke old, issue new.
    stored.revoke();
    await this.refreshTokens.save(stored);

    const newJti = randomUUID();
    const accessToken = await this.tokens.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const next = await this.tokens.signRefreshToken({
      sub: user.id,
      jti: newJti,
    });

    await this.refreshTokens.save(
      RefreshToken.issue(
        newJti,
        user.id,
        this.tokens.hashRefreshToken(next.token),
        next.expiresAt,
      ),
    );

    return {
      accessToken,
      refreshToken: next.token,
      tokenType: 'Bearer',
    };
  }
}
