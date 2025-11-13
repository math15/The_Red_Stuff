declare module 'newsapi' {
  interface NewsAPIOptions {
    language?: string;
    country?: string;
    pageSize?: number;
    page?: number;
    q?: string;
    sources?: string;
    domains?: string;
    from?: string;
    to?: string;
    sortBy?: string;
  }

  interface NewsAPISource {
    id: string | null;
    name: string;
  }

  interface NewsAPIArticle {
    source: NewsAPISource;
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }

  interface NewsAPIResponse {
    status: string;
    totalResults?: number;
    articles: NewsAPIArticle[];
  }

  class NewsAPI {
    constructor(apiKey: string);
    v2: {
      topHeadlines(options: NewsAPIOptions): Promise<NewsAPIResponse>;
      everything(options: NewsAPIOptions): Promise<NewsAPIResponse>;
      sources(
        options?: Partial<NewsAPIOptions>
      ): Promise<{ status: string; sources: NewsAPISource[] }>;
    };
  }

  export default NewsAPI;
}
