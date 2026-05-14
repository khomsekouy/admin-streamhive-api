import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/domain.exception';
import { UserRole } from '../../domain/user.entity';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/user.repository';
import { toUserDto, UserDto } from '../dtos/user.dto';

export interface UpdateUserInput {
  id: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

@Injectable()
export class UpdateUserUseCase implements UseCase<UpdateUserInput, UserDto> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: UpdateUserInput): Promise<UserDto> {
    const user = await this.users.findById(input.id);
    if (!user) throw new EntityNotFoundException('User', input.id);

    if (input.name !== undefined) user.rename(input.name);
    if (input.role !== undefined) user.changeRole(input.role);
    if (input.isActive !== undefined) {
      input.isActive ? user.activate() : user.deactivate();
    }

    const saved = await this.users.save(user);
    return toUserDto(saved);
  }
}
