import { Paper } from '@/types';

const SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1';

export async function searchSemanticScholar(
  query: string, 
  maxResults: number = 10
): Promise<Paper[]> {
  try {
    const fields = 'title,authors,year,citationCount,referenceCount,abstract,url,externalIds';
    const url = `${SEMANTIC_SCHOLAR_API}/paper/search?query=${encodeURIComponent(query)}&limit=${maxResults}&fields=${fields}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ScholarSync/1.0 (academic research app)'
      }
    });

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.data || []).map((paper: any) => ({
      id: paper.paperId || paper.externalIds?.DOI || generateId(),
      title: paper.title || '',
      authors: paper.authors?.map((a: any) => a.name) || [],
      abstract: paper.abstract || '',
      year: paper.year,
      url: paper.url || '',
      source: 'semantic-scholar',
      citations: paper.citationCount,
      references: paper.referenceCount,
      doi: paper.externalIds?.DOI
    }));
  } catch (error) {
    console.error('Semantic Scholar search error:', error);
    return [];
  }
}

export async function getPaperDetails(paperId: string): Promise<Paper | null> {
  try {
    const fields = 'title,authors,year,citationCount,referenceCount,abstract,url,externalIds,fieldsOfStudy,journal';
    const url = `${SEMANTIC_SCHOLAR_API}/paper/${paperId}?fields=${fields}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ScholarSync/1.0 (academic research app)'
      }
    });

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }

    const paper = await response.json();
    
    return {
      id: paper.paperId,
      title: paper.title,
      authors: paper.authors?.map((a: any) => a.name) || [],
      abstract: paper.abstract || '',
      year: paper.year,
      url: paper.url,
      source: 'semantic-scholar',
      citations: paper.citationCount,
      references: paper.referenceCount,
      doi: paper.externalIds?.DOI,
      journal: paper.journal?.name
    };
  } catch (error) {
    console.error('Semantic Scholar details error:', error);
    return null;
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
