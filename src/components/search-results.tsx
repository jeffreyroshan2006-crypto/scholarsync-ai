'use client';

import { Paper } from '@/types';
import { PaperCard } from './paper-card';
import { FileSearch, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  papers: Paper[];
  isLoading: boolean;
  query: string;
  savedPaperIds: Set<string>;
  onSavePaper: (paper: Paper) => void;
  onRemovePaper: (paperId: string) => void;
}

export function SearchResults({ 
  papers, 
  isLoading, 
  query,
  savedPaperIds,
  onSavePaper,
  onRemovePaper
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-secondary-600">Searching across academic databases...</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileSearch className="w-10 h-10 text-secondary-400" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-800 mb-2">
            Start Your Research
          </h2>
          <p className="text-secondary-600 max-w-md mx-auto">
            Search across arXiv, Semantic Scholar, Tavily, and WolframAlpha to find 
            academic papers, research, and computational results.
          </p>
        </div>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-secondary-400" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-800 mb-2">
            No Results Found
          </h2>
          <p className="text-secondary-600 max-w-md mx-auto">
            We couldn't find any papers matching &quot;{query}&quot;. Try adjusting your search terms or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-secondary-800">
          Search Results
        </h2>
        <span className="text-sm text-secondary-500">
          {papers.length} papers found
        </span>
      </div>

      <div className="space-y-4">
        {papers.map((paper, index) => (
          <PaperCard
            key={`${paper.id}-${index}`}
            paper={paper}
            isSaved={savedPaperIds.has(paper.id)}
            onSave={onSavePaper}
            onRemove={onRemovePaper}
          />
        ))}
      </div>
    </div>
  );
}
