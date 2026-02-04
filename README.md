# ScholarSync - AI Academic Research Assistant

A comprehensive web application that aggregates academic research from multiple sources including arXiv, Semantic Scholar, Tavily, and WolframAlpha. Built with Next.js, Supabase, and deployed on Vercel.

## Features

- **Multi-Source Search**: Search across 4 major academic databases
  - arXiv (completely free)
  - Semantic Scholar (free tier)
  - Tavily (free tier: 1,000 credits/month)
  - WolframAlpha (free tier: 2,000 requests/month)

- **Smart Filtering**: Filter by year range, sort by relevance/date/citations
- **Save Papers**: Create an account to save and organize your research
- **AI-Powered Results**: Leverage Tavily's AI for enhanced search results
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Components
- **Database**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **APIs**: arXiv, Semantic Scholar, Tavily, WolframAlpha

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier available)
- Vercel account (free tier available)
- API keys for Tavily and WolframAlpha (optional, but recommended)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd scholar-sync
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Get your project URL and anon key from Project Settings > API

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - From Supabase dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase dashboard

Optional (for enhanced functionality):
- `NEXT_PUBLIC_TAVILY_API_KEY` - Get free at [tavily.com](https://tavily.com)
- `NEXT_PUBLIC_WOLFRAM_APP_ID` - Get free at [developer.wolframalpha.com](https://developer.wolframalpha.com)

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## API Usage Limits (Free Tiers)

| API | Free Tier | Rate Limit |
|-----|-----------|------------|
| arXiv | Unlimited | 1 req/3s (recommended) |
| Semantic Scholar | Unlimited | 100 req/sec |
| Tavily | 1,000 credits/month | Varies by endpoint |
| WolframAlpha | 2,000 requests/month | 1 req/sec |

## Project Structure

```
scholar-sync/
├── src/
│   ├── app/
│   │   ├── api/search/      # API routes
│   │   ├── auth/            # Authentication page
│   │   ├── saved/           # Saved papers page
│   │   ├── page.tsx         # Home page
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   ├── search-bar.tsx   # Search interface
│   │   ├── paper-card.tsx   # Paper display
│   │   ├── search-results.tsx
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── lib/
│   │   ├── api/             # API integrations
│   │   ├── supabase.ts      # Supabase client
│   │   └── utils.ts         # Utilities
│   └── types/
│       └── index.ts         # TypeScript types
├── supabase/
│   └── schema.sql           # Database schema
└── package.json
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `NEXT_PUBLIC_TAVILY_API_KEY` | No | Tavily API key (free) |
| `NEXT_PUBLIC_WOLFRAM_APP_ID` | No | WolframAlpha App ID (free) |

## Database Schema

### saved_papers
- Stores user's saved papers
- Fields: id, user_id, paper_id, title, authors, abstract, url, source, saved_at, notes, tags

### search_history
- Tracks user search queries
- Fields: id, user_id, query, filters, results_count, searched_at

## License

MIT License - feel free to use for personal or commercial projects!

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ for researchers and students everywhere.
