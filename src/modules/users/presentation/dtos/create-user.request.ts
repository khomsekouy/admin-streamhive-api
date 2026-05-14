import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(120),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
});

export type CreateUserDtoType = z.infer<typeof createUserSchema>;

export class CreateUserDto implements CreateUserDtoType {
  @ApiProperty({ example: 'admin@streamhive.io' })
  email!: string;

  @ApiProperty({ minLength: 8, maxLength: 128 })
  password!: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  name!: string;

  @ApiProperty({ enum: ['ADMIN', 'EDITOR', 'VIEWER'], required: false })
  role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
}
