import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const listStreamsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  channelId: z.string().uuid().optional(),
  status: z
    .enum(['DRAFT', 'SCHEDULED', 'LIVE', 'ENDED', 'ARCHIVED'])
    .optional(),
});

export type ListStreamsQueryType = z.infer<typeof listStreamsQuerySchema>;

export class ListStreamsQueryDto implements ListStreamsQueryType {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  pageSize?: number;

  @ApiPropertyOptional()
  channelId?: string;

  @ApiPropertyOptional({
    enum: ['DRAFT', 'SCHEDULED', 'LIVE', 'ENDED', 'ARCHIVED'],
  })
  status?: 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'ENDED' | 'ARCHIVED';
}
