import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export type RefreshDtoType = z.infer<typeof refreshSchema>;

export class RefreshDto implements RefreshDtoType {
  @ApiProperty()
  refreshToken!: string;
}
