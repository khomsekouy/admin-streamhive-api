import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConflictException } from '../../../../shared/domain/domain.exception';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { User, UserRole } from '../../domain/user.entity';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/user.repository';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../ports/password-hasher.port';
import { toUserDto, UserDto } from '../dtos/user.dto';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserInput, UserDto> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<UserDto> {
    const existing = await this.users.findByEmail(input.email.toLowerCase());
    if (existing) {
      throw new ConflictException(`Email "${input.email}" already in use`);
    }

    const now = new Date();
    const user = User.create(randomUUID(), {
      email: input.email,
      passwordHash: await this.hasher.hash(input.password),
      name: input.name,
      role: input.role ?? 'VIEWER',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.users.save(user);
    return toUserDto(saved);
  }
}
