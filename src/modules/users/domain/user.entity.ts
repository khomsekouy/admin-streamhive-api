import { AggregateRoot } from '../../../shared/domain/aggregate-root.base';
import { ValidationException } from '../../../shared/domain/domain.exception';

export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface UserProps {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class User extends AggregateRoot<string> {
  private props: UserProps;

  private constructor(id: string, props: UserProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: UserProps): User {
    if (!EMAIL_REGEX.test(props.email)) {
      throw new ValidationException(`Invalid email: ${props.email}`);
    }
    if (props.name.trim().length < 2) {
      throw new ValidationException('Name must be at least 2 characters');
    }
    return new User(id, { ...props, email: props.email.toLowerCase() });
  }

  static rehydrate(id: string, props: UserProps): User {
    return new User(id, props);
  }

  get email(): string {
    return this.props.email;
  }
  get name(): string {
    return this.props.name;
  }
  get role(): UserRole {
    return this.props.role;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
  get passwordHash(): string {
    return this.props.passwordHash;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(name: string): void {
    if (name.trim().length < 2) {
      throw new ValidationException('Name must be at least 2 characters');
    }
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  changeRole(role: UserRole): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  setPasswordHash(hash: string): void {
    this.props.passwordHash = hash;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }
}
