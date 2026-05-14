import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import {
  Paginated,
  PaginationInput,
} from '../../../../shared/application/pagination';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/user.repository';
import { toUserDto, UserDto } from '../dtos/user.dto';

@Injectable()
export class ListUsersUseCase
  implements UseCase<PaginationInput, Paginated<UserDto>>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: PaginationInput): Promise<Paginated<UserDto>> {
    const result = await this.users.list(input);
    return { ...result, items: result.items.map(toUserDto) };
  }
}
