import {
  Paginated,
  PaginationInput,
} from '../../../shared/application/pagination';
import { Channel } from './channel.entity';

export const CHANNEL_REPOSITORY = Symbol('CHANNEL_REPOSITORY');

export interface ChannelRepository {
  findById(id: string): Promise<Channel | null>;
  findBySlug(slug: string): Promise<Channel | null>;
  list(input: PaginationInput): Promise<Paginated<Channel>>;
  save(channel: Channel): Promise<Channel>;
  delete(id: string): Promise<void>;
}
