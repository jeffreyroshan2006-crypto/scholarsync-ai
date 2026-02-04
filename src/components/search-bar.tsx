'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchFilters } from '@/types';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading: boolean;
}

const defaultFilters: SearchFilters = {
  sources: ['arxiv', 'semantic-scholar', 'tavily', 'wolfram'],
  sortBy: 'relevance',
  maxResults: 20
};

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), filters);
    }
  };

  const toggleSource = (source: SearchFilters['sources'][number]) => {
    setFilters(prev => {
      const sources = prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source];
      return { ...prev, sources };
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search academic papers, research, and computations..."
            className="w-full px-6 py-4 pr-32 text-lg border-2 border-secondary-200 rounded-2xl focus:border-primary-500 focus:outline-none transition-colors bg-white shadow-sm"
          />
          <div className="absolute right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 rounded-xl transition-colors",
                showFilters 
                  ? "bg-primary-100 text-primary-700" 
                  : "hover:bg-secondary-100 text-secondary-500"
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>Search</span>
            </button>
          </div>
        </div>
      </form>

      {showFilters && (
        <div className="mt-4 p-6 bg-white rounded-2xl border border-secondary-200 shadow-sm animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-secondary-800">Search Filters</h3>
            <button
              onClick={() => setFilters(defaultFilters)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {/* Sources */}
            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Data Sources
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'arxiv', label: 'arXiv', color: 'bg-red-100 text-red-700 border-red-200' },
                  { id: 'semantic-scholar', label: 'Semantic Scholar', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                  { id: 'tavily', label: 'Tavily', color: 'bg-green-100 text-green-700 border-green-200' },
                  { id: 'wolfram', label: 'WolframAlpha', color: 'bg-orange-100 text-orange-700 border-orange-200' }
                ].map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => toggleSource(source.id as SearchFilters['sources'][number])}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all",
                      filters.sources.includes(source.id as SearchFilters['sources'][number])
                        ? source.color
                        : "bg-secondary-100 text-secondary-500 border-transparent hover:bg-secondary-200"
                    )}
                  >
                    {source.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  From Year
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2020"
                  value={filters.yearFrom || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    yearFrom: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary-700 mb-2 block">
                  To Year
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2024"
                  value={filters.yearTo || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    yearTo: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Sort By
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'relevance', label: 'Relevance' },
                  { id: 'date', label: 'Date' },
                  { id: 'citations', label: 'Citations' }
                ].map((sort) => (
                  <button
                    key={sort.id}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: sort.id as SearchFilters['sortBy'] }))}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      filters.sortBy === sort.id
                        ? "bg-primary-600 text-white"
                        : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
                    )}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Results */}
            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Max Results: {filters.maxResults}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={filters.maxResults}
                onChange={(e) => setFilters(prev => ({ ...prev, maxResults: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-secondary-500 mt-1">
                <span>5</span>
                <span>50</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
