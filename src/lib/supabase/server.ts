import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

import { serverEnv } from '@/lib/env.server';

import { Database } from '@/types';

export const getServiceSupabase = cache(() => {
  return createClient<Database>(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
});

export type ServiceSupabaseClient = SupabaseClient<Database>;
