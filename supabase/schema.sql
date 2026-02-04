-- Create saved_papers table
CREATE TABLE IF NOT EXISTS public.saved_papers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    paper_id TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT[] DEFAULT '{}',
    abstract TEXT NOT NULL,
    url TEXT NOT NULL,
    source TEXT NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    UNIQUE(user_id, paper_id)
);

-- Create search_history table
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    results_count INTEGER DEFAULT 0,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE public.saved_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_papers
CREATE POLICY "Users can view own saved papers"
    ON public.saved_papers
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved papers"
    ON public.saved_papers
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved papers"
    ON public.saved_papers
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved papers"
    ON public.saved_papers
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for search_history
CREATE POLICY "Users can view own search history"
    ON public.search_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history"
    ON public.search_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_saved_papers_user_id ON public.saved_papers(user_id);
CREATE INDEX idx_saved_papers_saved_at ON public.saved_papers(saved_at DESC);
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_searched_at ON public.search_history(searched_at DESC);
