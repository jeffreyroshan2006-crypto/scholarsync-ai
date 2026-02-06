'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SearchBar } from '@/components/search-bar';
import { SearchResults } from '@/components/search-results';
import { Paper, SearchFilters } from '@/types';
import { searchAllApis } from '@/lib/api/search-service';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [savedPaperIds, setSavedPaperIds] = useState<Set<string>>(new Set());

  // Load user session
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ email: session.user.email! });
        loadSavedPapers(session.user.id);
      }
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email! });
        loadSavedPapers(session.user.id);
      } else {
        setUser(null);
        setSavedPaperIds(new Set());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadSavedPapers = async (userId: string) => {
    const { data } = await supabase
      .from('saved_papers')
      .select('paper_id')
      .eq('user_id', userId);
    
    if (data) {
      setSavedPaperIds(new Set(data.map(p => p.paper_id)));
    }
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setIsLoading(true);
    setCurrentQuery(query);

    try {
      const results = await searchAllApis({
        query,
        filters,
        apiKeys: {
          tavily: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
          wolfram: process.env.NEXT_PUBLIC_WOLFRAM_APP_ID
        }
      });
      setPapers(results);

      // Save search to history if user is logged in
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from('search_history').insert({
            user_id: session.user.id,
            query,
            filters: filters as any,
            results_count: results.length
          });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePaper = async (paper: Paper) => {
    if (!user) {
      alert('Please sign in to save papers');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from('saved_papers').insert({
      user_id: session.user.id,
      paper_id: paper.id,
      title: paper.title,
      authors: paper.authors,
      abstract: paper.abstract,
      url: paper.url,
      source: paper.source
    });

    if (!error) {
      setSavedPaperIds(prev => new Set(Array.from(prev).concat(paper.id)));
    }
  };

  const handleRemovePaper = async (paperId: string) => {
    if (!user) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('saved_papers')
      .delete()
      .eq('user_id', session.user.id)
      .eq('paper_id', paperId);

    if (!error) {
      setSavedPaperIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(paperId);
        return newSet;
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSavedPaperIds(new Set());
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-white to-secondary-50 border-b border-secondary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
                Discover Research Papers
              </h1>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Search across multiple academic databases including arXiv, Semantic Scholar, 
                Tavily, and WolframAlpha to find the research you need.
              </p>
            </div>
            
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchResults
            papers={papers}
            isLoading={isLoading}
            query={currentQuery}
            savedPaperIds={savedPaperIds}
            onSavePaper={handleSavePaper}
            onRemovePaper={handleRemovePaper}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
