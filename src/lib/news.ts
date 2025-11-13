import { cache } from 'react';

import { serverEnv } from '@/lib/env.server';
import logger from '@/lib/logger';

import { CauseCategory, CurrentEvent } from '@/types';

// Type definitions for NewsAPI responses
interface NewsAPIArticle {
  title?: string | null;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  publishedAt?: string | null;
  source?: {
    id?: string | null;
    name?: string | null;
  } | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults?: number;
  articles?: NewsAPIArticle[];
}

type KeywordRule = {
  keywords: string[];
  quoteIds: string[];
  category: CauseCategory;
};

const DEFAULT_QUOTE = 'quote-matthew-7-16';
const DEFAULT_CATEGORY: CauseCategory = 'community';

const keywordRules: KeywordRule[] = [
  {
    keywords: ['homeless', 'shelter', 'eviction', 'housing'],
    quoteIds: ['quote-matthew-25-40'],
    category: 'homelessness',
  },
  {
    keywords: ['hunger', 'food bank', 'food insecurity', 'meal'],
    quoteIds: ['quote-matthew-25-40'],
    category: 'hunger',
  },
  {
    keywords: ['youth', 'children', 'school', 'student', 'education'],
    quoteIds: ['quote-matthew-19-14'],
    category: 'education',
  },
  {
    keywords: ['elder', 'senior', 'nursing home'],
    quoteIds: ['quote-john-13-34'],
    category: 'elderly',
  },
  {
    keywords: ['clinic', 'hospital', 'health', 'mental health'],
    quoteIds: ['quote-luke-10-9'],
    category: 'healthcare',
  },
  {
    keywords: ['prison', 'incarceration', 'justice system'],
    quoteIds: ['quote-luke-4-18', 'quote-matthew-5-7'],
    category: 'prison',
  },
  {
    keywords: ['violence', 'peace', 'conflict', 'ceasefire'],
    quoteIds: ['quote-matthew-5-9'],
    category: 'peace',
  },
  {
    keywords: ['climate', 'environment', 'wildfire', 'flood', 'storm'],
    quoteIds: ['quote-matthew-5-14'],
    category: 'environment',
  },
];

const hasNewsApiKey = Boolean(process.env.NEWSAPI_KEY);

const matchRule = (content: string) => {
  const lower = content.toLowerCase();
  return keywordRules.find((rule) =>
    rule.keywords.some((keyword) => lower.includes(keyword))
  );
};

export const fetchNewsEvents = cache(async (): Promise<CurrentEvent[]> => {
  if (!hasNewsApiKey || !serverEnv.NEWSAPI_KEY) {
    return [];
  }

  try {
    const apiKey = serverEnv.NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=us&language=en&pageSize=5&apiKey=${apiKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `NewsAPI returned ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) as NewsAPIResponse;

    if (data.status !== 'ok' || !data.articles?.length) {
      return [];
    }

    return data.articles
      .filter((article: NewsAPIArticle) => Boolean(article.title))
      .map((article: NewsAPIArticle, index: number) => {
        const summary = article.description ?? article.content ?? '';
        const rule = matchRule(`${article.title ?? ''} ${summary}`);
        const related_quote_ids = rule?.quoteIds ?? [DEFAULT_QUOTE];

        return {
          id: article.url ?? `newsapi-${index}`,
          headline: article.title ?? 'Breaking story',
          summary: summary || 'Developing story — details to follow.',
          category: rule?.category ?? DEFAULT_CATEGORY,
          region: article.source?.name ?? 'Global',
          published_at: article.publishedAt ?? new Date().toISOString(),
          related_quote_ids,
          related_opportunity_ids: [],
        };
      });
  } catch (error) {
    logger(error, 'newsapi-fetch');
    return [];
  }
});
