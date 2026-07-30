'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Idea {
  id: string;
  idea_id: string;
  title: string;
  slug: string;
  summary: string;
  category_name: string;
  subcategory_name: string;
  tags: string;
  trend_score: number;
  tier: string;
}

export default function Dashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  useEffect(() => {
    fetchIdeas();
  }, []);

  async function fetchIdeas() {
    setLoading(true);
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('trend_score', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
    } else if (data) {
      setIdeas(data);
    }
    setLoading(false);
  }

  // Extract unique categories dynamically from DB
  const categories = ['All', ...Array.from(new Set(ideas.map((i) => i.category_name).filter(Boolean)))];

  // Helper to parse tags safely
  const parseTags = (rawTags: string): string[] => {
    if (!rawTags) return ['SaaS', 'B2B'];
    try {
      const parsed = JSON.parse(rawTags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return rawTags.split(',').map((t) => t.trim().replace(/["[\]]/g, ''));
    }
    return ['SaaS', 'B2B'];
  };

  // Filter ideas based on search, category, and tier
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      (idea.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.category_name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || idea.category_name === selectedCategory;
    const matchesTier = selectedTier === 'All' || idea.tier?.toLowerCase() === selectedTier.toLowerCase();

    return matchesSearch && matchesCategory && matchesTier;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Background Glow Accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-indigo-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header / Hero */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              IV
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              IdeaVault <span className="text-indigo-400">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              ● Live DB Connected
            </span>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
          <span>🔥 Access 10,000+ AI-Validated Startup Opportunities</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
          Discover High-Momentum <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Micro-SaaS & AI Ideas
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Uncover market gaps, revenue models, and instant AI validation reports backed by real-time web intelligence.
        </p>

        {/* Search Input Bar */}
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search ideas by keyword, category, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-14 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-xl backdrop-blur-xl text-base transition"
          />
          <svg
            className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </section>

      {/* Filter Chips Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-10 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tier Select */}
          <div className="flex items-center space-x-2 shrink-0">
            {['All', 'Free', 'Premium'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedTier === tier
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ideas Grid */}
      <section className="max-w-7xl mx-auto px-6 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse p-6" />
            ))}
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-lg">No startup ideas found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedTier('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => {
              const tagsList = parseTags(idea.tags);
              const isPremium = idea.tier?.toLowerCase() === 'premium';

              return (
                <div
                  key={idea.id || idea.slug}
                  className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {idea.category_name || 'SaaS'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 flex items-center gap-1">
                          🔥 {idea.trend_score || 85}
                        </span>
                        {isPremium ? (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            PRO
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            FREE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Idea Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {idea.title}
                    </h3>

                    {/* Subcategory */}
                    {idea.subcategory_name && (
                      <p className="text-xs text-indigo-400/90 font-medium mb-3">
                        ↳ {idea.subcategory_name}
                      </p>
                    )}

                    {/* Summary */}
                    <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {idea.summary}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {tagsList.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* View Details Action */}
                    <Link
                      href={`/idea/${idea.slug || idea.idea_id}`}
                      className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold transition-all duration-200 border border-slate-700 hover:border-transparent"
                    >
                      <span>Explore Idea & AI Report</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
