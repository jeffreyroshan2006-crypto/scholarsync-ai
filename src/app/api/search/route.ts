import { NextResponse } from 'next/server';
import { searchAllApis } from '@/lib/api/search-service';
import { SearchFilters } from '@/types';

export async function POST(request: Request) {
  try {
    const { query, filters } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const results = await searchAllApis({
      query,
      filters: filters as SearchFilters,
      apiKeys: {
        tavily: process.env.TAVILY_API_KEY,
        wolfram: process.env.WOLFRAM_APP_ID
      }
    });

    return NextResponse.json({ papers: results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
