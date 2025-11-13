import NewsAPI from 'newsapi';
import { cache } from 'react';

import { serverEnv } from '@/lib/env.server';
import logger from '@/lib/logger';

import { CauseCategory, CurrentEvent } from '@/types';

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
const newsApiClient =
  hasNewsApiKey && serverEnv.NEWSAPI_KEY
    ? new NewsAPI(serverEnv.NEWSAPI_KEY)
    : null;

const matchRule = (content: string) => {
  const lower = content.toLowerCase();
  return keywordRules.find((rule) =>
    rule.keywords.some((keyword) => lower.includes(keyword))
  );
};

export const fetchNewsEvents = cache(async (): Promise<CurrentEvent[]> => {
  if (!newsApiClient) {
    return [];
  }

  try {
    const response = await newsApiClient.v2.topHeadlines({
      language: 'en',
      country: 'us',
      pageSize: 5,
    });

    if (response.status !== 'ok' || !response.articles?.length) {
      return [];
    }

    return response.articles
      .filter((article) => Boolean(article.title))
      .map((article, index) => {
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
