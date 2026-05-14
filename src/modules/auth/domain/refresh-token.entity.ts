import { Entity } from '../../../shared/domain/entity.base';

export interface RefreshTokenProps {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export class RefreshToken extends Entity<string> {
  private props: RefreshTokenProps;

  private constructor(id: string, props: RefreshTokenProps) {
    super(id);
    this.props = props;
  }

  static issue(
    id: string,
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): RefreshToken {
    return new RefreshToken(id, {
      userId,
      tokenHash,
      expiresAt,
      revokedAt: null,
      createdAt: new Date(),
    });
  }

  static rehydrate(id: string, props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(id, props);
  }

  get userId(): string {
    return this.props.userId;
  }
  get tokenHash(): string {
    return this.props.tokenHash;
  }
  get expiresAt(): Date {
    return this.props.expiresAt;
  }
  get revokedAt(): Date | null {
    return this.props.revokedAt;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  isActive(now: Date = new Date()): boolean {
    return !this.props.revokedAt && this.props.expiresAt > now;
  }

  revoke(): void {
    if (!this.props.revokedAt) {
      this.props.revokedAt = new Date();
    }
  }
}
