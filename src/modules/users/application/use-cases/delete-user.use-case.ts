import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.interface';
import { EntityNotFoundException } from '../../../../shared/domain/domain.exception';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/user.repository';

@Injectable()
export class DeleteUserUseCase implements UseCase<string, void> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.users.findById(id);
    if (!user) throw new EntityNotFoundException('User', id);
    await this.users.delete(id);
  }
}
