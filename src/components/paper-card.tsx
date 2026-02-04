'use client';

import { useState } from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  Users, 
  Quote,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { Paper } from '@/types';
import { cn, formatDate, truncateText } from '@/lib/utils';

interface PaperCardProps {
  paper: Paper;
  isSaved?: boolean;
  onSave?: (paper: Paper) => void;
  onRemove?: (paperId: string) => void;
}

const sourceColors = {
  'arxiv': 'bg-red-100 text-red-700 border-red-200',
  'semantic-scholar': 'bg-blue-100 text-blue-700 border-blue-200',
  'tavily': 'bg-green-100 text-green-700 border-green-200',
  'wolfram': 'bg-orange-100 text-orange-700 border-orange-200'
};

const sourceLabels = {
  'arxiv': 'arXiv',
  'semantic-scholar': 'Semantic Scholar',
  'tavily': 'Tavily',
  'wolfram': 'WolframAlpha'
};

export function PaperCard({ paper, isSaved = false, onSave, onRemove }: PaperCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-sm hover:shadow-md transition-shadow animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border",
              sourceColors[paper.source]
            )}>
              {sourceLabels[paper.source]}
            </span>
            {paper.year && (
              <span className="flex items-center gap-1 text-sm text-secondary-500">
                <Calendar className="w-3.5 h-3.5" />
                {paper.year}
              </span>
            )}
            {paper.citations !== undefined && paper.citations > 0 && (
              <span className="flex items-center gap-1 text-sm text-secondary-500">
                <Quote className="w-3.5 h-3.5" />
                {paper.citations.toLocaleString()} citations
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 leading-tight">
            {paper.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isSaved ? (
            <button
              onClick={() => onRemove?.(paper.id)}
              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Remove from saved"
            >
              <BookmarkCheck className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => onSave?.(paper)}
              className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Save paper"
            >
              <Bookmark className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Authors */}
      {paper.authors.length > 0 && (
        <div className="flex items-start gap-2 mb-3 text-secondary-600">
          <Users className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">
            {paper.authors.slice(0, 5).join(', ')}
            {paper.authors.length > 5 && ` +${paper.authors.length - 5} more`}
          </span>
        </div>
      )}

      {/* Abstract / Content */}
      <div className="mb-4">
        <p className="text-secondary-700 text-sm leading-relaxed">
          {expanded 
            ? paper.abstract 
            : truncateText(paper.abstract, 250)
          }
        </p>
        {paper.abstract.length > 250 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Summary for Tavily results */}
      {paper.summary && (
        <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
          <p className="text-sm text-secondary-700">
            <span className="font-medium text-primary-700">AI Summary:</span> {paper.summary}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
        <div className="flex items-center gap-4">
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <FileText className="w-4 h-4" />
              PDF
            </a>
          )}
          {paper.doi && (
            <span className="text-sm text-secondary-500">
              DOI: {paper.doi}
            </span>
          )}
          {paper.journal && (
            <span className="text-sm text-secondary-500">
              {paper.journal}
            </span>
          )}
        </div>
        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg text-sm font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Source
        </a>
      </div>
    </div>
  );
}
