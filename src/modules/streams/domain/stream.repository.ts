import {
  Paginated,
  PaginationInput,
} from '../../../shared/application/pagination';
import { Stream, StreamStatus } from './stream.entity';

export const STREAM_REPOSITORY = Symbol('STREAM_REPOSITORY');

export interface ListStreamsFilters extends PaginationInput {
  channelId?: string;
  status?: StreamStatus;
}

export interface StreamRepository {
  findById(id: string): Promise<Stream | null>;
  list(filters: ListStreamsFilters): Promise<Paginated<Stream>>;
  save(stream: Stream): Promise<Stream>;
  delete(id: string): Promise<void>;
}
