import { AggregateRoot } from '../../../shared/domain/aggregate-root.base';
import { ValidationException } from '../../../shared/domain/domain.exception';

const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

export interface ChannelProps {
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Channel extends AggregateRoot<string> {
  private props: ChannelProps;

  private constructor(id: string, props: ChannelProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: ChannelProps): Channel {
    if (props.name.trim().length < 2) {
      throw new ValidationException('Channel name must be at least 2 characters');
    }
    if (!SLUG_REGEX.test(props.slug)) {
      throw new ValidationException(
        'Slug must be lowercase alphanumeric with dashes (max 64 chars)',
      );
    }
    return new Channel(id, props);
  }

  static rehydrate(id: string, props: ChannelProps): Channel {
    return new Channel(id, props);
  }

  get name(): string {
    return this.props.name;
  }
  get slug(): string {
    return this.props.slug;
  }
  get description(): string | null {
    return this.props.description;
  }
  get ownerId(): string {
    return this.props.ownerId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(name: string): void {
    if (name.trim().length < 2) {
      throw new ValidationException('Channel name must be at least 2 characters');
    }
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  describe(description: string | null): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }
}
