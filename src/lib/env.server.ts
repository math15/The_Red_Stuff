import { z } from 'zod';

import { clientEnv } from './env';

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'Supabase service key is required'),
  NEWSAPI_KEY: z.string().min(1).optional(),
});

const serverEnvOnly = serverEnvSchema.parse(process.env);

export const serverEnv = {
  ...clientEnv,
  ...serverEnvOnly,
};

export type ServerEnv = typeof serverEnv;
