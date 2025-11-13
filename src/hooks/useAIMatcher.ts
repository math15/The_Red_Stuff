import { useCallback, useState } from 'react';

import {
  AIMatcherService,
  NewsMatchResult,
  QuestionMatchResult,
} from '@/lib/ai-matcher.client';

/**
 * Hook for matching news events to quotes and opportunities
 */
export function useNewsMatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NewsMatchResult | null>(null);

  const matchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await AIMatcherService.matchNewsEvents();
      setData(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to match news';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    matchNews,
  };
}

/**
 * Hook for matching a user question to quotes and opportunities
 */
export function useQuestionMatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QuestionMatchResult | null>(null);

  const matchQuestion = useCallback(async (question: string) => {
    if (!question.trim()) {
      setError('Please enter a question');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await AIMatcherService.matchQuestion(question);
      setData(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to match question';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    data,
    matchQuestion,
    reset,
  };
}
