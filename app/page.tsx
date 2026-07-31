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
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('trend_score', { ascending: false });

      if (error) {
        console.error('Error fetching ideas:', error);
      } else if (data) {
        // Filter out empty / scrap rows cleanly
        const validIdeas = data.filter(
          (item) => item.title && item.title.trim() !== '' && item.summary && item.summary.trim() !== ''
        );
        setIdeas(validIdeas);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }

  // Extract unique clean categories
  const categories = [
    'All',
    ...Array.from(new Set(ideas.map((i) => i.category_name).filter(Boolean))),
  ];

  // Helper to parse tags
  const parseTags = (rawTags: string): string[] => {
    if (!rawTags) return ['Micro-SaaS', 'B2B'];
    try {
      const parsed = JSON.parse(rawTags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return rawTags.split(',').map((t) => t.trim().replace(/["[\]]/g, ''));
    }
    return ['Micro-SaaS', 'B2B'];
  };

  // Filter ideas
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      (idea.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.category_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.subcategory_name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || idea.category_name === selectedCategory;
    const ideaTier = (idea.tier || 'free').toLowerCase();
    const matchesTier =
      selectedTier === 'All' ||
      (selectedTier === 'Free' && ideaTier !== 'premium') ||
      (selectedTier === 'Premium' && ideaTier === 'premium');

    return matchesSearch && matchesCategory && matchesTier;
  });

  return (
    <main className="min-h-screen bg-[#07080D] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 antialiased pb-24">
      {/* Top Subtle Ambient Spotlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-slate-900/0 to-transparent blur-3xl pointer-events-none" />

      {/* Sleek Minimalist Navbar */}
      <header className="border-b border-slate-800/60 bg-[#07080D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 p-[1px] shadow-sm">
              <div className="h-full w-full bg-[#07080D] rounded-[7px] flex items-center justify-center">
                <span className="text-xs font-black tracking-widest text-white">IV</span>
              </div>
            </div>
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              IdeaVault <span className="text-indigo-400 font-normal">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {ideas.length} Verified Blueprint{ideas.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
          <span>Venture Intelligence & Market Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
          High-Margin Startup Blueprints <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-slate-400">
            Backed by Deep Tech Analysis
          </span>
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
          Skip 60+ hours of market research. Access pre-validated micro-SaaS opportunities, pricing strategies, and competitive moats.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search blueprints by category, keyword, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3.5 pl-12 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 text-sm shadow-2xl backdrop-blur-md transition-all"
          />
          <svg
            className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </section>

      {/* Filters Bar (Custom hidden scrollbar) */}
      <section className="max-w-7xl mx-auto px-6 mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-100 text-slate-950 font-semibold shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tier Switcher */}
          <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800/80 shrink-0">
            {['All', 'Free', 'Premium'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  selectedTier === tier
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-6 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-xl bg-slate-900/40 border border-slate-800/60 animate-pulse p-6" />
            ))}
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800/60">
            <p className="text-slate-400 text-sm">No active blueprints match your search filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedTier('All');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIdeas.map((idea, index) => {
              const tagsList = parseTags(idea.tags);
              const isPremium = idea.tier?.toLowerCase() === 'premium';

              return (
                <div
                  key={idea.id || idea.slug || index}
                  className="group rounded-xl bg-[#0C0E14] border border-slate-800/80 hover:border-slate-700/90 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50 truncate max-w-[180px]">
                        {idea.category_name || 'Vertical SaaS'}
                      </span>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {idea.trend_score || 85}/100
                        </span>
                        {isPremium && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            PRO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subcategory Label */}
                    {idea.subcategory_name && (
                      <p className="text-[11px] text-slate-500 font-medium mb-1">
                        {idea.subcategory_name}
                      </p>
                    )}

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                      {idea.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-slate-400 text-xs line-clamp-3 mt-2.5 mb-5 leading-relaxed">
                      {idea.summary}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-5">
                      {tagsList.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800/80">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* View Action */}
                    <Link
                      href={`/idea/${idea.slug || idea.idea_id}`}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-indigo-600/90 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-800 hover:border-transparent group/btn"
                    >
                      <span>Explore Blueprint</span>
                      <svg
                        className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
