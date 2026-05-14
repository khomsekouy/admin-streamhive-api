import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const createStreamSchema = z.object({
  channelId: z.string().uuid(),
  title: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  scheduledAt: z.coerce.date().optional(),
});

export type CreateStreamDtoType = z.infer<typeof createStreamSchema>;

export class CreateStreamDto implements CreateStreamDtoType {
  @ApiProperty({ format: 'uuid' })
  channelId!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  scheduledAt?: Date;
}
