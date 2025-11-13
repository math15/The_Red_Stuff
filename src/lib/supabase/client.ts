import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { clientEnv } from '@/lib/env';

import { Database } from '@/types';

let browserClient: SupabaseClient<Database> | null = null;

export const getBrowserSupabase = () => {
  if (!browserClient) {
    browserClient = createClient<Database>(
      clientEnv.NEXT_PUBLIC_SUPABASE_URL,
      clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
        },
      }
    );
  }

  return browserClient;
};
