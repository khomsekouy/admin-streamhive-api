import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(120).optional(),
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateUserDtoType = z.infer<typeof updateUserSchema>;

export class UpdateUserDto implements UpdateUserDtoType {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'EDITOR', 'VIEWER'] })
  role?: 'ADMIN' | 'EDITOR' | 'VIEWER';

  @ApiPropertyOptional()
  isActive?: boolean;
}
