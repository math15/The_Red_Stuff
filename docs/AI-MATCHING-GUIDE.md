# AI Matching System Guide

## Overview

The AI Matching System uses OpenAI to intelligently connect:

- **Current events** → **Relevant quotes from Jesus** → **Volunteer opportunities**
- **User questions** → **Biblical wisdom** → **Practical actions**

This goes beyond simple keyword matching to understand semantic meaning and context.

## Architecture

### Core Components

1. **`src/lib/news-matcher.ts`** - Server-side AI matching logic
2. **`src/lib/ai-matcher.client.ts`** - Client-side service wrapper
3. **`src/hooks/useAIMatcher.ts`** - React hooks for easy integration
4. **API Routes:**
   - `POST /api/news/match` - Match news events to quotes and opportunities
   - `POST /api/ask/match` - Match user questions to wisdom and action

### How It Works

#### News Event Matching Flow

```
1. Fetch current events, quotes, and opportunities
2. For each event:
   a. Use GPT-4o-mini to find top 3 relevant quotes
      - Considers: theme, tags, context, and semantic relevance
      - Returns: quotes + relevance scores + reasoning

   b. Use quote themes to filter candidate opportunities

   c. Use GPT-4o-mini to rank opportunities
      - Considers: direct relevance, impact potential, urgency
      - Returns: opportunities + relevance scores + reasoning

3. Return complete matches with explanations
```

#### Question Matching Flow

```
1. User submits a question
2. GPT-4o-mini finds relevant quotes from Jesus
   - Considers: question intent, emotional context, practical needs

3. Use matched quote themes to filter opportunities
4. GPT-4o-mini suggests actionable volunteer work
   - Connects wisdom to practical application

5. Generate a brief reflection connecting question → wisdom → action
6. Return complete package
```

## Usage

### Backend Usage

#### Match News Events

```typescript
import { matchNewsEventsToQuotes } from '@/lib/news-matcher';

const result = await matchNewsEventsToQuotes();

// Returns:
// {
//   matches: [
//     {
//       event: CurrentEvent,
//       matchedQuotes: [
//         { quote: Quote, relevanceScore: 95, reasoning: "..." }
//       ],
//       matchedOpportunities: [
//         { opportunity: Opportunity, relevanceScore: 90, reasoning: "..." }
//       ]
//     }
//   ],
//   summary: "Successfully matched 5 events..."
// }
```

#### Match User Question

```typescript
import { matchQuestionToAction } from '@/lib/news-matcher';

const result = await matchQuestionToAction('How can I find purpose?');

// Returns:
// {
//   quotes: [
//     { quote: Quote, relevance: "This speaks to..." }
//   ],
//   opportunities: [
//     { opportunity: Opportunity, reasoning: "This allows you to..." }
//   ],
//   reflection: "Your question about purpose..."
// }
```

### Frontend Usage

#### Using the React Hooks

```typescript
import { useNewsMatch, useQuestionMatch } from '@/hooks/useAIMatcher';

function MyComponent() {
  // For news matching
  const { loading, error, data, matchNews } = useNewsMatch();

  // For question matching
  const {
    loading: questionLoading,
    error: questionError,
    data: questionData,
    matchQuestion,
    reset,
  } = useQuestionMatch();

  // Use them
  const handleNewsMatch = async () => {
    const result = await matchNews();
    console.log(result.matches);
  };

  const handleAsk = async (question: string) => {
    const result = await matchQuestion(question);
    if (result) {
      console.log(result.quotes);
      console.log(result.opportunities);
      console.log(result.reflection);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <DisplayMatches matches={data.matches} />}
    </div>
  );
}
```

#### Using the Service Directly

```typescript
import { AIMatcherService } from '@/lib/ai-matcher.client';

// Match news
const newsMatches = await AIMatcherService.matchNewsEvents();

// Match question
const questionResult = await AIMatcherService.matchQuestion(
  'How can I respond to injustice?'
);

// Get opportunities for specific event
const opportunities = await AIMatcherService.getOpportunitiesForEvent(
  'event-id-123'
);
```

## Integration Examples

### Homepage Integration

```typescript
// In your homepage component
import { useNewsMatch } from '@/hooks/useAIMatcher';

export default function HomePage() {
  const { data, loading, matchNews } = useNewsMatch();

  useEffect(() => {
    // Fetch daily matches on mount
    matchNews();
  }, [matchNews]);

  if (loading) return <LoadingSpinner />;

  const todayMatch = data?.matches[0];

  return (
    <div>
      <h1>Today's World</h1>
      <EventCard event={todayMatch.event} />

      <h2>Matched Wisdom</h2>
      {todayMatch.matchedQuotes.map(({ quote, reasoning }) => (
        <QuoteCard key={quote.id} quote={quote} explanation={reasoning} />
      ))}

      <h2>Take Action</h2>
      {todayMatch.matchedOpportunities.map(({ opportunity, reasoning }) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          explanation={reasoning}
        />
      ))}
    </div>
  );
}
```

### Ask Page Integration

```typescript
import { useQuestionMatch } from '@/hooks/useAIMatcher';

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const { loading, data, matchQuestion } = useQuestionMatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await matchQuestion(question);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What's on your heart?"
      />

      <button type='submit' disabled={loading}>
        {loading ? 'Finding wisdom...' : 'Ask'}
      </button>

      {data && (
        <div>
          <h3>Wisdom for Your Journey</h3>
          {data.quotes.map(({ quote, relevance }) => (
            <QuoteCard key={quote.id} quote={quote} context={relevance} />
          ))}

          <p className='reflection'>{data.reflection}</p>

          <h3>Turn Wisdom into Action</h3>
          {data.opportunities.map(({ opportunity, reasoning }) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              why={reasoning}
            />
          ))}
        </div>
      )}
    </form>
  );
}
```

## Environment Setup

Ensure your `.env.local` file includes:

```bash
OPENAI_API_KEY="sk-..."
```

## Data Requirements

The AI matcher requires:

1. **Quotes** (`src/data/quotes.ts`):

   - Well-defined themes
   - Clear context
   - Descriptive tags

2. **Current Events** (`src/data/current-events.ts`):

   - Clear headlines and summaries
   - Proper categorization
   - Can have pre-configured quote IDs (used as fallback)

3. **Opportunities** (`src/data/opportunities.ts`):
   - Detailed descriptions
   - Proper cause_categories
   - Related quote IDs (for better matching)

## Fallback Strategy

The system includes intelligent fallbacks:

1. **If AI fails for quotes**: Uses pre-configured `related_quote_ids` from events
2. **If AI fails for opportunities**: Uses category-based matching
3. **If no opportunities match**: Returns general active opportunities
4. **If API quota exceeded**: Gracefully degrades to rule-based matching

## Performance Considerations

- Uses `gpt-4o-mini` for cost-effectiveness
- Caches data loading functions
- Processes events sequentially (not parallel) to avoid rate limits
- Limits candidate sets (top 20 opportunities, top 5 events)
- Temperature set to 0.7-0.8 for balance between creativity and consistency

## Testing

```bash
# Run the news matcher manually
curl -X POST http://localhost:3000/api/news/match

# Test question matching
curl -X POST http://localhost:3000/api/ask/match \
  -H "Content-Type: application/json" \
  -d '{"question": "How can I find peace?"}'
```

## Best Practices

1. **Always handle loading states** - AI calls can take 2-5 seconds
2. **Show reasoning to users** - The "why" is as important as the match
3. **Cache results** - Consider storing daily matches
4. **Monitor API costs** - Track OpenAI usage
5. **Provide fallbacks** - Always show something, even if AI fails

## Future Enhancements

- [ ] Add user feedback to improve matching quality
- [ ] Implement caching layer (Redis) for frequent queries
- [ ] Add semantic embeddings for faster similarity search
- [ ] Support batch processing for multiple questions
- [ ] Add A/B testing for different prompts
- [ ] Track which matches lead to volunteer signups

## Troubleshooting

**Error: "OPENAI_API_KEY is not configured"**

- Ensure `.env.local` has the API key
- Restart the dev server

**Error: "Rate limit exceeded"**

- Reduce number of events processed
- Add delays between API calls
- Consider upgrading OpenAI plan

**Poor match quality**

- Review your prompt engineering in `news-matcher.ts`
- Ensure your data has good descriptions and tags
- Adjust temperature parameters
- Add more examples to system prompts

## Support

For questions or issues with the AI matching system:

- Check the logs: Look for `news-matcher-error` or `match-question-error`
- Review OpenAI dashboard for API errors
- Ensure data quality in source files
