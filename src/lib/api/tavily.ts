import { Paper } from '@/types';

const TAVILY_API_URL = 'https://api.tavily.com/search';

export async function searchTavily(
  query: string, 
  maxResults: number = 10,
  apiKey: string
): Promise<Paper[]> {
  try {
    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        query,
        search_depth: 'advanced',
        max_results: maxResults,
        include_answer: true,
        include_raw_content: true,
        include_images: false,
        topic: 'general'
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.results || []).map((result: any, index: number) => ({
      id: generateId(),
      title: result.title || '',
      authors: extractAuthors(result.raw_content || result.content || ''),
      abstract: result.content || result.raw_content || '',
      url: result.url,
      source: 'tavily',
      summary: data.answer || '',
      relevanceScore: result.score
    }));
  } catch (error) {
    console.error('Tavily search error:', error);
    return [];
  }
}

function extractAuthors(content: string): string[] {
  // Simple regex to extract author names from content
  // This is a basic implementation - could be enhanced with NLP
  const authorPatterns = [
    /(?:by|authors?|written by)[:\s]+([^,.]+(?:,\s*[^,.]+)*)/i,
    /(?:^|\n)([^\n]{10,50})\n.*?(?:university|institute|college|lab)/i
  ];
  
  for (const pattern of authorPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].split(/,\s*|\s+and\s+/).map(s => s.trim()).filter(s => s.length > 2);
    }
  }
  
  return [];
}

function generateId(): string {
  return 'tavily-' + Math.random().toString(36).substring(2, 15);
}
