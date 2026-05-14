import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/domain.exception';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/user.repository';
import { toUserDto, UserDto } from '../dtos/user.dto';

@Injectable()
export class GetUserUseCase implements UseCase<string, UserDto> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(id: string): Promise<UserDto> {
    const user = await this.users.findById(id);
    if (!user) throw new EntityNotFoundException('User', id);
    return toUserDto(user);
  }
}
