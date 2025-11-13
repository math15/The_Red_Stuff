# AI Matching - Quick Start Guide

## What Was Implemented

The AI matching system intelligently connects current events → biblical wisdom → volunteer opportunities using OpenAI GPT-4o-mini.

### Files Created

1. **`src/lib/news-matcher.ts`** - Core AI matching logic (558 lines)

   - `matchNewsEventsToQuotes()` - Match events to quotes and opportunities
   - `matchQuestionToAction()` - Match user questions to wisdom and action

2. **`src/app/api/news/match/route.ts`** - News matching API endpoint

   - `POST /api/news/match` - Returns matched events, quotes, and opportunities

3. **`src/app/api/ask/match/route.ts`** - Question matching API endpoint

   - `POST /api/ask/match` - Takes question, returns wisdom and opportunities

4. **`src/lib/ai-matcher.client.ts`** - Client-side service wrapper

   - `AIMatcherService.matchNewsEvents()`
   - `AIMatcherService.matchQuestion(question)`
   - `AIMatcherService.getOpportunitiesForEvent(eventId)`

5. **`src/hooks/useAIMatcher.ts`** - React hooks

   - `useNewsMatch()` - Hook for news matching
   - `useQuestionMatch()` - Hook for question matching

6. **Documentation**
   - `docs/AI-MATCHING-GUIDE.md` - Comprehensive guide
   - `docs/AI-MATCHING-QUICKSTART.md` - This file

## Quick Integration

### Step 1: Environment Setup

Add to your `.env.local`:

```bash
OPENAI_API_KEY="sk-your-key-here"
```

### Step 2: Test the API

Start your dev server:

```bash
npm run dev
```

Test the endpoints:

```bash
# Test news matching
curl -X POST http://localhost:3000/api/news/match

# Test question matching
curl -X POST http://localhost:3000/api/ask/match \
  -H "Content-Type: application/json" \
  -d '{"question": "How can I make a difference?"}'
```

### Step 3: Use in Your Components

#### Example: Homepage with Daily Matches

```typescript
'use client';

import { useEffect } from 'react';
import { useNewsMatch } from '@/hooks/useAIMatcher';

export default function HomePage() {
  const { data, loading, error, matchNews } = useNewsMatch();

  useEffect(() => {
    matchNews();
  }, [matchNews]);

  if (loading) return <div>Loading today's wisdom...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const todayMatch = data.matches[0];

  return (
    <div>
      <h1>Today's Event</h1>
      <h2>{todayMatch.event.headline}</h2>
      <p>{todayMatch.event.summary}</p>

      <h2>Wisdom from Jesus</h2>
      {todayMatch.matchedQuotes.map(({ quote, reasoning }) => (
        <div key={quote.id}>
          <blockquote>{quote.text}</blockquote>
          <cite>{quote.reference}</cite>
          <p>
            <em>Why this matters: {reasoning}</em>
          </p>
        </div>
      ))}

      <h2>Take Action</h2>
      {todayMatch.matchedOpportunities.map(({ opportunity, reasoning }) => (
        <div key={opportunity.id}>
          <h3>{opportunity.opportunity_title}</h3>
          <p>{opportunity.description}</p>
          <p>
            <em>{reasoning}</em>
          </p>
        </div>
      ))}
    </div>
  );
}
```

#### Example: Ask Page with Question Matching

```typescript
'use client';

import { useState } from 'react';
import { useQuestionMatch } from '@/hooks/useAIMatcher';

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const { data, loading, error, matchQuestion } = useQuestionMatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await matchQuestion(question);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What's on your heart?"
          rows={4}
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Seeking wisdom...' : 'Ask'}
        </button>
      </form>

      {error && <p className='error'>{error}</p>}

      {data && (
        <div>
          <h2>Wisdom for Your Journey</h2>
          {data.quotes.map(({ quote, relevance }) => (
            <div key={quote.id}>
              <blockquote>{quote.text}</blockquote>
              <cite>{quote.reference}</cite>
              <p>{relevance}</p>
            </div>
          ))}

          <div className='reflection'>
            <p>{data.reflection}</p>
          </div>

          <h2>Ways to Serve</h2>
          {data.opportunities.map(({ opportunity, reasoning }) => (
            <div key={opportunity.id}>
              <h3>{opportunity.opportunity_title}</h3>
              <p>{reasoning}</p>
              <button>Learn More</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## How It Works

### News Matching

1. Fetches current events from your data
2. Uses AI to find the 3 most relevant quotes from Jesus
3. Filters opportunities based on quote themes
4. Uses AI to rank and select best volunteer opportunities
5. Returns everything with explanations

### Question Matching

1. Takes user's question
2. AI finds relevant biblical wisdom
3. Maps wisdom to cause categories
4. AI suggests volunteer opportunities that align
5. Generates a reflection connecting question → wisdom → action

## Key Features

✅ **Semantic Understanding** - Goes beyond keyword matching  
✅ **Reasoning Provided** - Every match includes "why"  
✅ **Graceful Fallbacks** - Works even if AI fails  
✅ **Cost Optimized** - Uses GPT-4o-mini  
✅ **Type Safe** - Full TypeScript support  
✅ **React Hooks** - Easy integration  
✅ **Error Handling** - Proper error states

## Data Flow

```
User Action → React Hook → Client Service → API Route → AI Matcher → OpenAI
                ↓                                            ↓
              UI Updates ← Data Returned ← JSON Response ← Smart Matching
```

## Next Steps

1. **Integrate into Homepage**

   - Show daily event + matched quote + featured opportunity
   - Use the dual-pillar layout from requirements

2. **Enable Ask Page**

   - Replace placeholder with working form
   - Show matched wisdom and opportunities
   - Add reflection display

3. **Add Caching**

   - Cache daily news matches (refresh once per day)
   - Cache frequently asked questions
   - Consider using React Query

4. **Monitor & Optimize**

   - Track API costs in OpenAI dashboard
   - A/B test different prompts
   - Collect user feedback on match quality

5. **Enhance Data**
   - Add more quotes with rich context
   - Expand opportunity database
   - Improve cause category mappings

## Troubleshooting

**"OPENAI_API_KEY is not configured"**

- Check `.env.local` file exists
- Verify key format: `sk-...`
- Restart dev server

**Matches seem irrelevant**

- Review prompt engineering in `src/lib/news-matcher.ts`
- Check data quality (quotes need good themes/tags)
- Adjust temperature (0.7-0.8 recommended)

**Slow performance**

- Normal for AI calls (2-5 seconds)
- Consider caching results
- Process fewer events at once

**API rate limits**

- Reduce frequency of matching
- Add delays between calls
- Upgrade OpenAI plan

## API Reference

### POST /api/news/match

**Request:** None needed  
**Response:**

```json
{
  "success": true,
  "matches": [
    {
      "event": { "id": "...", "headline": "..." },
      "matchedQuotes": [
        {
          "quote": { "id": "...", "text": "..." },
          "relevanceScore": 95,
          "reasoning": "This quote directly..."
        }
      ],
      "matchedOpportunities": [
        {
          "opportunity": { "id": "...", "title": "..." },
          "relevanceScore": 90,
          "reasoning": "This opportunity..."
        }
      ]
    }
  ],
  "summary": "Successfully matched 5 events..."
}
```

### POST /api/ask/match

**Request:**

```json
{
  "question": "How can I find purpose?"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "quote": { "id": "...", "text": "..." },
        "relevance": "This speaks to..."
      }
    ],
    "opportunities": [
      {
        "opportunity": { "id": "...", "title": "..." },
        "reasoning": "This allows you to..."
      }
    ],
    "reflection": "Your question about purpose..."
  }
}
```

## Performance Tips

1. **Cache results** - News matches can be cached for hours
2. **Debounce user input** - Don't match every keystroke
3. **Show loading states** - AI calls take time
4. **Prefetch on hover** - Load details before click
5. **Use React Query** - Automatic caching and refetching

## Cost Estimation

With GPT-4o-mini:

- News matching (5 events): ~$0.01-0.02 per run
- Question matching: ~$0.005-0.01 per question
- Daily cost (100 users asking 1-2 questions): ~$2-5

## Support

Need help?

- Read full guide: `docs/AI-MATCHING-GUIDE.md`
- Check codebase: `src/lib/news-matcher.ts`
- Review types: `src/types/opportunity.ts`
