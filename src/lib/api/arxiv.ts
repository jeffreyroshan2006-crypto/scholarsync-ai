import { Paper } from '@/types';

export async function searchArxiv(query: string, maxResults: number = 10): Promise<Paper[]> {
  try {
    const searchQuery = encodeURIComponent(query);
    const url = `http://export.arxiv.org/api/query?search_query=all:${searchQuery}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ScholarSync/1.0 (academic research app)'
      }
    });

    if (!response.ok) {
      throw new Error(`arXiv API error: ${response.status}`);
    }

    const xmlText = await response.text();
    const papers = parseArxivXml(xmlText);
    
    return papers;
  } catch (error) {
    console.error('arXiv search error:', error);
    return [];
  }
}

function parseArxivXml(xmlText: string): Paper[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const entries = xmlDoc.querySelectorAll('entry');
  
  const papers: Paper[] = [];
  
  entries.forEach((entry) => {
    const id = entry.querySelector('id')?.textContent || '';
    const title = entry.querySelector('title')?.textContent?.replace(/\s+/g, ' ').trim() || '';
    const summary = entry.querySelector('summary')?.textContent?.replace(/\s+/g, ' ').trim() || '';
    const published = entry.querySelector('published')?.textContent || '';
    const updated = entry.querySelector('updated')?.textContent || '';
    
    const authors: string[] = [];
    entry.querySelectorAll('author name').forEach((author) => {
      const name = author.textContent?.trim();
      if (name) authors.push(name);
    });
    
    const pdfLink = entry.querySelector('link[title="pdf"]')?.getAttribute('href') || 
                   id.replace('/abs/', '/pdf/');
    
    const category = entry.querySelector('category')?.getAttribute('term') || '';
    
    const year = published ? new Date(published).getFullYear() : undefined;
    
    papers.push({
      id: id.split('/').pop() || generateId(),
      title,
      authors,
      abstract: summary,
      year,
      published,
      updated,
      pdfUrl: pdfLink,
      url: id,
      source: 'arxiv',
      category
    });
  });
  
  return papers;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
