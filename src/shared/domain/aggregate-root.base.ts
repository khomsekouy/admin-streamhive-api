import { Entity } from './entity.base';

export abstract class AggregateRoot<TId = string> extends Entity<TId> {}
