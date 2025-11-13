import { z } from 'zod';

import { clientEnv } from './env';

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'Supabase service key is required'),
  NEWSAPI_KEY: z.string().optional().or(z.literal('')),
  OPENAI_API_KEY: z.string().optional().or(z.literal('')),
});

const serverEnvOnly = serverEnvSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEWSAPI_KEY: process.env.NEWSAPI_KEY || undefined,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || undefined,
});

export const serverEnv = {
  ...clientEnv,
  ...serverEnvOnly,
};

export type ServerEnv = typeof serverEnv;
