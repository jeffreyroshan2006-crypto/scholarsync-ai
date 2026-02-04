import Link from 'next/link';
import { BookOpen, Github, Twitter, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-secondary-200 bg-secondary-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-secondary-900">ScholarSync</span>
            </Link>
            <p className="text-secondary-600 text-sm max-w-sm">
              An AI-powered academic research assistant that aggregates papers from 
              multiple sources including arXiv, Semantic Scholar, Tavily, and WolframAlpha.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-secondary-900 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                  Search Papers
                </Link>
              </li>
              <li>
                <Link href="/saved" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                  Saved Papers
                </Link>
              </li>
              <li>
                <a 
                  href="https://docs.tavily.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Powered By */}
          <div>
            <h3 className="font-semibold text-secondary-900 mb-3">Powered By</h3>
            <ul className="space-y-2 text-sm text-secondary-600">
              <li>arXiv API</li>
              <li>Semantic Scholar</li>
              <li>Tavily Search</li>
              <li>WolframAlpha</li>
              <li>Supabase</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-secondary-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for researchers
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
