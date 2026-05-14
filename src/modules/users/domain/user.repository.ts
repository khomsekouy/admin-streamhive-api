import { Paginated, PaginationInput } from '../../../shared/application/pagination';
import { User } from './user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  list(input: PaginationInput): Promise<Paginated<User>>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
