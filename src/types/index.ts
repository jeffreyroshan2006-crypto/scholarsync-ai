export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  year?: number;
  published?: string;
  updated?: string;
  pdfUrl?: string;
  url: string;
  source: 'arxiv' | 'semantic-scholar' | 'tavily' | 'wolfram';
  citations?: number;
  references?: number;
  journal?: string;
  doi?: string;
  category?: string;
  summary?: string;
  relevanceScore?: number;
}

export interface SearchResult {
  papers: Paper[];
  totalResults: number;
  page: number;
  perPage: number;
}

export interface SavedPaper {
  id: string;
  user_id: string;
  paper_id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  source: string;
  saved_at: string;
  notes?: string | null;
  tags?: string[] | null;
}

export interface SearchFilters {
  sources: ('arxiv' | 'semantic-scholar' | 'tavily' | 'wolfram')[];
  yearFrom?: number;
  yearTo?: number;
  sortBy: 'relevance' | 'date' | 'citations';
  maxResults: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: 'success' | 'error';
}
