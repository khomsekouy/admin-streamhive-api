import { ConfigService } from '@nestjs/config';
import { Env } from './env.schema';

export type AppConfigService = ConfigService<Env, true>;
