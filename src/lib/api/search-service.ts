import { Paper, SearchFilters } from '@/types';
import { searchArxiv } from './arxiv';
import { searchSemanticScholar } from './semantic-scholar';
import { searchTavily } from './tavily';
import { searchWolfram } from './wolfram';

interface SearchOptions {
  query: string;
  filters: SearchFilters;
  apiKeys: {
    tavily?: string;
    wolfram?: string;
  };
}

export async function searchAllApis(options: SearchOptions): Promise<Paper[]> {
  const { query, filters, apiKeys } = options;
  const results: Paper[] = [];
  
  const searchPromises: Promise<Paper[]>[] = [];
  
  // ArXiv (always free)
  if (filters.sources.includes('arxiv')) {
    searchPromises.push(
      searchArxiv(query, Math.ceil(filters.maxResults / filters.sources.length))
    );
  }
  
  // Semantic Scholar (free tier)
  if (filters.sources.includes('semantic-scholar')) {
    searchPromises.push(
      searchSemanticScholar(query, Math.ceil(filters.maxResults / filters.sources.length))
    );
  }
  
  // Tavily (requires API key - free tier available)
  if (filters.sources.includes('tavily') && apiKeys.tavily) {
    searchPromises.push(
      searchTavily(query, Math.ceil(filters.maxResults / filters.sources.length), apiKeys.tavily)
    );
  }
  
  // WolframAlpha (requires API key - free tier available)
  if (filters.sources.includes('wolfram') && apiKeys.wolfram) {
    searchPromises.push(
      searchWolfram(query, apiKeys.wolfram)
    );
  }
  
  const apiResults = await Promise.allSettled(searchPromises);
  
  apiResults.forEach((result) => {
    if (result.status === 'fulfilled') {
      results.push(...result.value);
    } else {
      console.error('Search failed:', result.reason);
    }
  });
  
  // Apply filters
  let filteredResults = results;
  
  // Filter by year
  if (filters.yearFrom) {
    filteredResults = filteredResults.filter(p => 
      !p.year || p.year >= filters.yearFrom!
    );
  }
  
  if (filters.yearTo) {
    filteredResults = filteredResults.filter(p => 
      !p.year || p.year <= filters.yearTo!
    );
  }
  
  // Sort results
  filteredResults = sortResults(filteredResults, filters.sortBy);
  
  // Remove duplicates based on title similarity
  filteredResults = removeDuplicates(filteredResults);
  
  return filteredResults.slice(0, filters.maxResults);
}

function sortResults(papers: Paper[], sortBy: SearchFilters['sortBy']): Paper[] {
  return [...papers].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        const dateA = a.year || 0;
        const dateB = b.year || 0;
        return dateB - dateA;
      
      case 'citations':
        const citesA = a.citations || 0;
        const citesB = b.citations || 0;
        return citesB - citesA;
      
      case 'relevance':
      default:
        // Sort by source priority and year
        const sourcePriority = { 'semantic-scholar': 4, 'arxiv': 3, 'tavily': 2, 'wolfram': 1 };
        const priorityA = sourcePriority[a.source] || 0;
        const priorityB = sourcePriority[b.source] || 0;
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        return (b.year || 0) - (a.year || 0);
    }
  });
}

function removeDuplicates(papers: Paper[]): Paper[] {
  const seen = new Set<string>();
  return papers.filter(paper => {
    const normalizedTitle = paper.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(normalizedTitle)) {
      return false;
    }
    seen.add(normalizedTitle);
    return true;
  });
}
