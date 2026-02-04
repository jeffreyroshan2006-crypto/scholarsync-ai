'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PaperCard } from '@/components/paper-card';
import { SavedPaper } from '@/types';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, BookOpen, Trash2 } from 'lucide-react';

export default function SavedPapersPage() {
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const getUserAndPapers = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({ email: session.user.email! });
        await loadSavedPapers(session.user.id);
      }
      
      setIsLoading(false);
    };

    getUserAndPapers();
  }, []);

  const loadSavedPapers = async (userId: string) => {
    const { data, error } = await supabase
      .from('saved_papers')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });

    if (!error && data) {
      setSavedPapers(data);
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
      setSavedPapers(prev => prev.filter(p => p.paper_id !== paperId));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSavedPapers([]);
  };

  if (!user && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Sign In Required
            </h1>
            <p className="text-secondary-600 mb-6">
              Please sign in to view your saved papers
            </p>
            <Link
              href="/auth"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="flex-1">
        <div className="bg-white border-b border-secondary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Link>
            <h1 className="text-3xl font-bold text-secondary-900">
              Saved Papers
            </h1>
            <p className="text-secondary-600 mt-2">
              Your collection of {savedPapers.length} saved research papers
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : savedPapers.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-secondary-800 mb-2">
                No Saved Papers
              </h2>
              <p className="text-secondary-600 max-w-md mx-auto mb-6">
                You haven&apos;t saved any papers yet. Start searching and save papers 
                that interest you.
              </p>
              <Link
                href="/"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Start Searching
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedPapers.map((savedPaper) => (
                <PaperCard
                  key={savedPaper.id}
                  paper={{
                    id: savedPaper.paper_id,
                    title: savedPaper.title,
                    authors: savedPaper.authors,
                    abstract: savedPaper.abstract,
                    url: savedPaper.url,
                    source: savedPaper.source as any
                  }}
                  isSaved={true}
                  onRemove={handleRemovePaper}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
