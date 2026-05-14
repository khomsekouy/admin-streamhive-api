import { AggregateRoot } from '../../../shared/domain/aggregate-root.base';
import { ValidationException } from '../../../shared/domain/domain.exception';

export type StreamStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'LIVE'
  | 'ENDED'
  | 'ARCHIVED';

export interface StreamProps {
  channelId: string;
  createdById: string;
  title: string;
  description: string | null;
  status: StreamStatus;
  scheduledAt: Date | null;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Stream extends AggregateRoot<string> {
  private props: StreamProps;

  private constructor(id: string, props: StreamProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: StreamProps): Stream {
    if (props.title.trim().length < 2) {
      throw new ValidationException('Stream title must be at least 2 characters');
    }
    return new Stream(id, props);
  }

  static rehydrate(id: string, props: StreamProps): Stream {
    return new Stream(id, props);
  }

  get channelId(): string {
    return this.props.channelId;
  }
  get createdById(): string {
    return this.props.createdById;
  }
  get title(): string {
    return this.props.title;
  }
  get description(): string | null {
    return this.props.description;
  }
  get status(): StreamStatus {
    return this.props.status;
  }
  get scheduledAt(): Date | null {
    return this.props.scheduledAt;
  }
  get startedAt(): Date | null {
    return this.props.startedAt;
  }
  get endedAt(): Date | null {
    return this.props.endedAt;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  retitle(title: string): void {
    if (title.trim().length < 2) {
      throw new ValidationException('Stream title must be at least 2 characters');
    }
    this.props.title = title;
    this.touch();
  }

  describe(description: string | null): void {
    this.props.description = description;
    this.touch();
  }

  schedule(at: Date): void {
    if (this.props.status !== 'DRAFT' && this.props.status !== 'SCHEDULED') {
      throw new ValidationException(
        `Cannot schedule stream in ${this.props.status} status`,
      );
    }
    if (at.getTime() <= Date.now()) {
      throw new ValidationException('Scheduled time must be in the future');
    }
    this.props.scheduledAt = at;
    this.props.status = 'SCHEDULED';
    this.touch();
  }

  start(): void {
    if (this.props.status !== 'DRAFT' && this.props.status !== 'SCHEDULED') {
      throw new ValidationException(
        `Cannot start stream in ${this.props.status} status`,
      );
    }
    this.props.startedAt = new Date();
    this.props.status = 'LIVE';
    this.touch();
  }

  end(): void {
    if (this.props.status !== 'LIVE') {
      throw new ValidationException('Only LIVE streams can be ended');
    }
    this.props.endedAt = new Date();
    this.props.status = 'ENDED';
    this.touch();
  }

  archive(): void {
    this.props.status = 'ARCHIVED';
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
