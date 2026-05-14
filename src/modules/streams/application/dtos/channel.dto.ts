import { Channel } from '../../domain/channel.entity';

export interface ChannelDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export const toChannelDto = (channel: Channel): ChannelDto => ({
  id: channel.id,
  name: channel.name,
  slug: channel.slug,
  description: channel.description,
  ownerId: channel.ownerId,
  createdAt: channel.createdAt.toISOString(),
  updatedAt: channel.updatedAt.toISOString(),
});
