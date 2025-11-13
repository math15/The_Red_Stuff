import OpenAI from 'openai';

import { serverEnv } from '@/lib/env.server';

let client: OpenAI | null = null;

export const getOpenAIClient = () => {
  if (!serverEnv.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  if (!client) {
    client = new OpenAI({
      apiKey: serverEnv.OPENAI_API_KEY,
    });
  }

  return client;
};
