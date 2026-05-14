import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const createChannelSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/),
  description: z.string().max(2000).optional(),
});

export type CreateChannelDtoType = z.infer<typeof createChannelSchema>;

export class CreateChannelDto implements CreateChannelDtoType {
  @ApiProperty()
  name!: string;

  @ApiProperty({ example: 'main-stage' })
  slug!: string;

  @ApiPropertyOptional()
  description?: string;
}
