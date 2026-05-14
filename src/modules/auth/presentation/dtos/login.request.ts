import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginDtoType = z.infer<typeof loginSchema>;

export class LoginDto implements LoginDtoType {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}
