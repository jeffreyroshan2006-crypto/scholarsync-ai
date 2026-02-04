'use client';

import Link from 'next/link';
import { BookOpen, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  user?: { email: string } | null;
  onSignOut?: () => void;
}

export function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header className="w-full border-b border-secondary-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">ScholarSync</h1>
              <p className="text-xs text-secondary-500">AI Research Assistant</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-secondary-600 hover:text-secondary-900 font-medium transition-colors"
            >
              Search
            </Link>
            <Link 
              href="/saved" 
              className="text-secondary-600 hover:text-secondary-900 font-medium transition-colors"
            >
              Saved Papers
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-secondary-600">{user.email}</span>
                <button
                  onClick={onSignOut}
                  className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
