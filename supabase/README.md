# Database Setup for The Red Stuff PWA

## Overview

The Red Stuff uses Supabase (PostgreSQL) for data storage and management. The database schema is designed to support:

- 📖 **Quotes** from Jesus's teachings
- 🤝 **Volunteer Opportunities** matching biblical wisdom to action
- 📰 **News Events** with AI-powered matching
- 👤 **User Activity Tracking** for personalization
- 🎯 **AI Match Caching** for performance
- 📊 **Analytics** for measuring impact

## Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Copy your service role key (needed for admin operations)

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEWSAPI_KEY="your-newsapi-key"  # Optional
OPENAI_API_KEY="your-openai-key"  # Optional
```

### 3. Run the Schema

In your Supabase SQL Editor, run:

```sql
-- 1. First, run schema.sql to create all tables
-- Copy/paste the contents of supabase/schema.sql

-- 2. Then, run seed.sql to populate initial data
-- Copy/paste the contents of supabase/seed.sql
```

Or use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or manually apply
supabase db execute -f supabase/schema.sql
supabase db execute -f supabase/seed.sql
```

## Database Schema

### Core Tables

#### `quotes`

Stores Jesus's teachings with themes, tags, and semantic embeddings.

```sql
- id: UUID (primary key)
- text: Full quote text
- reference: Biblical reference (e.g., "Matthew 5:9")
- theme: Primary theme (hunger, peace, children, etc.)
- tags: Array of related tags
- context: Explanation of the quote
- embedding: Vector for semantic search
```

#### `opportunities`

Volunteer opportunities that align with biblical teachings.

```sql
- id: UUID (primary key)
- organization_name: Name of the organization
- organization_type: charity, church, community, etc.
- opportunity_title: Title of the volunteer opportunity
- description: Detailed description
- time_commitment: one-time, weekly, monthly, ongoing
- location: JSONB (city, state, mode: remote/local/hybrid)
- skills_needed: Array of required skills
- cause_categories: Array (hunger, education, etc.)
- related_quotes: Array of quote UUIDs
- urgency_level: immediate, ongoing, seasonal
- verified_status: Boolean
- active_status: Boolean
```

#### `news_events`

Current events matched to quotes and opportunities.

```sql
- id: UUID (primary key)
- headline: Event headline
- summary: Brief summary
- category: Cause category
- related_quote_ids: Array of matched quotes
- related_opportunity_ids: Array of matched opportunities
- embedding: Vector for semantic search
```

### User Activity Tables

#### `user_questions`

Tracks questions users ask for AI matching.

```sql
- id: UUID
- user_id: User identifier
- question: The question text
- matched_quote_ids: AI-matched quotes
- matched_opportunity_ids: AI-matched opportunities
- reflection: AI-generated reflection
```

#### `quote_saves`

Users' saved/favorited quotes.

```sql
- id: UUID
- user_id: User identifier
- quote_id: Reference to quotes table
- notes: Optional user notes
```

#### `opportunity_interest`

Tracks user interest in volunteer opportunities.

```sql
- id: UUID
- opportunity_id: Reference to opportunities
- user_id: User identifier (optional)
- metadata: Additional context (JSONB)
```

#### `match_feedback`

User feedback on AI match quality.

```sql
- id: UUID
- match_type: event_quote, question_opportunity, etc.
- rating: 1-5 stars
- helpful: Boolean
- feedback_text: Optional feedback
```

#### `user_engagement`

Comprehensive engagement tracking.

```sql
- id: UUID
- user_id: User identifier
- event_type: page_view, quote_view, opportunity_click, etc.
- event_data: JSONB with additional context
```

### AI & Caching Tables

#### `ai_match_cache`

Caches AI matching results to reduce API costs.

```sql
- id: UUID
- cache_key: Unique identifier for the match
- match_type: news_event, user_question, etc.
- result: JSONB with full match results
- expires_at: Cache expiration timestamp
```

#### `news_quote_matches`

Stores AI-computed matches between news and quotes.

```sql
- id: UUID
- news_event_id: Reference to news_events
- quote_id: Reference to quotes
- similarity: Similarity score
- selected: Whether this match was chosen for display
```

#### `news_opportunity_matches`

Stores AI-computed matches between news and opportunities.

```sql
- id: UUID
- news_event_id: Reference to news_events
- opportunity_id: Reference to opportunities
- similarity: Similarity score
- relevance_score: Overall relevance
```

### Analytics Tables

#### `daily_features`

Featured content for the homepage (event + quote + opportunity of the day).

```sql
- id: UUID
- feature_date: Date
- featured_event_id: Reference to news_events
- featured_quote_id: Reference to quotes
- featured_opportunity_id: Reference to opportunities
- reflection: Daily reflection text
- active: Boolean
```

#### `opportunity_performance` (View)

Analytics view showing opportunity engagement metrics.

```sql
- opportunity_id: UUID
- opportunity_title: Text
- interest_count: Number of interest expressions
- view_count: Number of views
- feedback_count: Number of feedback submissions
- avg_rating: Average user rating
```

## Database Functions

### `get_user_recommendations(user_id, limit)`

Returns personalized opportunity recommendations based on:

- Saved quotes
- Asked questions
- User preferences
- Recent activity

```sql
SELECT * FROM get_user_recommendations('user-123', 10);
```

### `get_trending_opportunities(days, limit)`

Returns trending opportunities based on recent engagement.

```sql
SELECT * FROM get_trending_opportunities(7, 10);
```

### `cleanup_expired_cache()`

Removes expired AI match cache entries.

```sql
SELECT cleanup_expired_cache();
```

## Row Level Security (RLS)

The database uses RLS policies for security:

- ✅ **Public read** for quotes, opportunities, and news events
- ✅ **Users can insert** their own interests, questions, and feedback
- ✅ **Users can only view** their own saved quotes and questions
- ✅ **Anonymous tracking** allowed for engagement data

## Indexes

The schema includes optimized indexes for:

- Cause category filtering (GIN indexes on arrays)
- Date-based queries
- User activity lookups
- Vector similarity search (IVFFlat for embeddings)

## Migrations

When adding new features:

1. Create a new migration file: `supabase/migrations/YYYYMMDD_description.sql`
2. Test locally first
3. Apply to production via Supabase dashboard or CLI

## Backup & Maintenance

### Automated Tasks

Consider setting up cron jobs for:

```sql
-- Clean up old cache entries (run daily)
SELECT cron.schedule(
  'cleanup-cache',
  '0 2 * * *',  -- 2 AM daily
  $$SELECT cleanup_expired_cache()$$
);

-- Archive old engagement data (run monthly)
-- Implementation depends on your retention policy
```

### Manual Backups

Supabase provides automatic backups, but you can also:

```bash
# Export specific tables
supabase db dump -f backup.sql

# Export only data
supabase db dump --data-only -f data-backup.sql
```

## Performance Tips

1. **Use the cache table** - Store expensive AI computations
2. **Limit array operations** - PostgreSQL array operations can be slow on large datasets
3. **Batch inserts** - Use bulk inserts for engagement tracking
4. **Monitor query performance** - Use Supabase's query performance dashboard
5. **Consider partitioning** - For very large engagement/tracking tables

## Troubleshooting

### "relation does not exist"

- Ensure schema.sql was run completely
- Check that you're connected to the right database
- Verify table names match (case-sensitive)

### "permission denied"

- Check RLS policies
- Ensure you're using the correct API key (anon vs service role)
- For admin operations, use service role key

### Slow queries

- Check if indexes are being used: `EXPLAIN ANALYZE SELECT ...`
- Consider adding indexes for your specific query patterns
- Review the query performance dashboard in Supabase

### Vector search not working

- Ensure `pgvector` extension is enabled
- Check that embeddings are populated
- Verify IVFFlat index was created successfully

## Next Steps

1. **Populate embeddings** - Use OpenAI to generate embeddings for semantic search
2. **Set up analytics** - Connect to your analytics dashboard
3. **Configure backups** - Set retention policies
4. **Monitor costs** - Track database size and API usage
5. **Optimize queries** - Use Supabase's performance monitoring

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

---

For questions about the schema design, see the project requirements document.
