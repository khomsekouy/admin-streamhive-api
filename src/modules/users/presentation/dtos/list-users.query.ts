import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

export type ListUsersQueryType = z.infer<typeof listUsersQuerySchema>;

export class ListUsersQueryDto implements ListUsersQueryType {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  pageSize?: number;
}
