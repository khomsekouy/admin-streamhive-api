import { UserRole } from '../../../users/domain/user.entity';

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

export interface TokenService {
  signAccessToken(payload: AccessTokenPayload): Promise<string>;
  signRefreshToken(payload: RefreshTokenPayload): Promise<{
    token: string;
    expiresAt: Date;
  }>;
  verifyRefreshToken(token: string): Promise<RefreshTokenPayload>;
  hashRefreshToken(token: string): string;
}
