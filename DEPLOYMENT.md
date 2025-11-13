# The Red Stuff PWA - Deployment Guide

## Issues Fixed

### 1. TypeScript Build Error (newsapi module)

**Problem**: TypeScript couldn't find type declarations for the `newsapi` package.

**Solution**: Created type declaration file `src/types/newsapi.d.ts` with proper TypeScript definitions for the NewsAPI module.

### 2. Database UUID Error

**Problem**: The schema used UUID types for IDs, but seed data used string IDs like `"quote-matthew-25-40"`.

**Solution**: Updated `supabase/schema.sql` to use `TEXT` instead of `UUID` for:

- `quotes.id`
- `opportunities.id`
- `news_events.id`
- All related foreign key references
- All array columns containing these IDs

## Deployment Steps

### 1. On Your VPS

#### Install Dependencies

```bash
cd ~/The_Red_Stuff
npm install
```

#### Build the Project

```bash
npm run build
```

#### Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: OpenAI for AI matching (system will work without it)
OPENAI_API_KEY=your_openai_api_key

# Optional: NewsAPI for real-time news (system will work without it)
NEWSAPI_KEY=your_newsapi_key
```

#### Start the Application

For development:

```bash
npm run dev
```

For production (recommended):

```bash
npm run build
npm start
```

Or use PM2 for production:

```bash
npm install -g pm2
pm2 start npm --name "redstuff" -- start
pm2 save
pm2 startup
```

### 2. On Supabase

#### Step 1: Run Schema

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Run the query
4. Verify all tables are created

#### Step 2: Run Seed Data

1. In SQL Editor, create a new query
2. Copy contents of `supabase/seed.sql`
3. Run the query
4. Verify data is inserted:

```sql
-- Check quotes
SELECT COUNT(*) FROM public.quotes;

-- Check opportunities
SELECT COUNT(*) FROM public.opportunities;

-- Check news events
SELECT COUNT(*) FROM public.news_events;
```

Expected results:

- 13 quotes
- 12 opportunities
- 4 news events
- 1 daily feature

## Verification

### Test the Build

```bash
npm run build
```

Should complete without errors.

### Test the API Endpoints

Once running, test these endpoints:

- `http://your-domain/api/opportunities` - Should return opportunities
- `http://your-domain/api/news` - Should return news events
- `http://your-domain/` - Homepage should load

### Check Database Connection

Visit your app and verify:

- Quotes display on the home page
- Good Works page shows opportunities
- Quotations page shows all quotes
- Ask page loads (AI features optional)

## Troubleshooting

### Build Fails with newsapi Error

Make sure `src/types/newsapi.d.ts` exists and is committed to git.

### Database Seed Fails

- Ensure you ran `schema.sql` before `seed.sql`
- Check that IDs in seed.sql are text strings, not UUIDs
- Verify Supabase project is active and accessible

### Runtime Errors

- Check `.env` file has all required variables
- Verify Supabase URL and keys are correct
- Check server logs: `pm2 logs redstuff` (if using PM2)

## Optional Features

### Enable AI Matching

Set `OPENAI_API_KEY` in `.env` to enable:

- News event → quote → opportunity matching
- User question → wisdom → action matching

### Enable Real-time News

Set `NEWSAPI_KEY` in `.env` to fetch live news headlines.

## Production Checklist

- [ ] Schema deployed to Supabase
- [ ] Seed data loaded successfully
- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] Application starts successfully
- [ ] All pages load correctly
- [ ] Database queries work
- [ ] PM2 or similar process manager configured
- [ ] HTTPS/SSL certificate configured (if production)
- [ ] Domain configured and DNS pointing to server

## Support

For issues:

1. Check build logs: `npm run build`
2. Check runtime logs: `pm2 logs` or `npm start`
3. Verify Supabase connection in dashboard
4. Check browser console for client-side errors
