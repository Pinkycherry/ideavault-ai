'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

// Data Type Interface matching database schema
export interface Idea {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  tier: 'free' | 'premium';
  trend_score: number;
  created_at?: string;
}

// Fallback data so the dashboard is visually striking immediately
const MOCK_IDEAS: Idea[] = [
  {
    id: '1',
    title: 'AI Legal Contract Summarizer',
    slug: 'ai-legal-contract-summarizer',
    summary: 'Automate contract analysis and risk scoring for freelancers in under 10 seconds with precise AI clause breakdown.',
    category: 'SaaS',
    tags: ['AI', 'Legal Tech', 'Micro-SaaS'],
    tier: 'free',
    trend_score: 92,
  },
  {
    id: '2',
    title: 'Hyper-Local Micro-Gym Finder',
    slug: 'hyper-local-micro-gym-finder',
    summary: 'Uber-style marketplace for discovering and booking private garage gym rentals on-demand.',
    category: 'Consumer',
    tags: ['Fitness', 'Mobile', 'Sharing Economy'],
    tier: 'free',
    trend_score: 78,
  },
  {
    id: '3',
    title: 'Autonomous SEO Content Auditor',
    slug: 'autonomous-seo-content-auditor',
    summary: 'AI agent that monitors search rank drops, identifies broken internal links, and auto-generates fixes.',
    category: 'B2B',
    tags: ['SEO', 'Marketing', 'AI Agents'],
    tier: 'premium',
    trend_score: 95,
  },
  {
    id: '4',
    title: 'B2B API Usage Anomaly Detector',
    slug: 'b2b-api-usage-anomaly-detector',
    summary: 'Real-time alert platform targeting fintech startups to catch rogue API billing overages before invoices land.',
    category: 'B2B',
    tags: ['DevOps', 'Security', 'APIs'],
    tier: 'premium',
    trend_score: 89,
  },
];

export default function DashboardPage() {
  const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  // Fetch real ideas from Supabase
  useEffect(() => {
    async function fetchIdeas() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .order('trend_score', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setIdeas(data as Idea[]);
        }
      } catch (err) {
        console.info('Using fallback mock data while Supabase connects...', err);
      } finally {
        setLoading(false);
      }
    }
    fetchIdeas();
  }, []);

  // Live Instant Filter Logic
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || idea.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesTier =
        selectedTier === 'All' || idea.tier.toLowerCase() === selectedTier.toLowerCase();

      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [ideas, searchQuery, selectedCategory, selectedTier]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />

      {/* NAVIGATION BAR */}
      <nav className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              IV
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              IdeaVault <span className="text-indigo-400 font-normal">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all">
              Unlock All 10,000+ Ideas
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative z-10 max-w-5xl mx-auto pt-16 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          Updated Daily • 10,000+ AI-Scored Startup Blueprints
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-4">
          Discover Your Next High-Margin Venture
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Skip 60+ hours of market research. Unlock instantly validated startup opportunities with target markets, competitor landscapes, and monetization reports.
        </p>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <svg
                className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search ideas, keywords, or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Category Filters */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
                {['All', 'SaaS', 'B2B', 'Consumer'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Tier Filters */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
                {['All', 'Free', 'Premium'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTier(t)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      selectedTier === t
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* IDEAS GRID */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading startup ideas...</div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            No ideas matched your search criteria. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => {
              const isPremium = idea.tier === 'premium';

              return (
                <div
                  key={idea.id}
                  className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col justify-between overflow-hidden"
                >
                  {/* TOP CARD CONTENT */}
                  <div>
                    {/* Header Row: Category Tag & Glowing Trend Score */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                        {idea.category}
                      </span>

                      {/* Glowing Trend Badge */}
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>{idea.trend_score}/100</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                      {idea.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {idea.summary}
                    </p>
                  </div>

                  {/* BOTTOM CARD CONTENT */}
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {idea.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-800/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <a
                      href={`/idea/${idea.slug}`}
                      className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white text-xs font-semibold transition-all group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    >
                      View AI Validation Report →
                    </a>
                  </div>

                  {/* PREMIUM LOCK OVERLAY (Visible on Premium items) */}
                  {isPremium && (
                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center p-6 text-center border border-amber-500/30 rounded-2xl">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mb-3 text-amber-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-1">
                        PRO EXCLUSIVE IDEA
                      </span>
                      <h4 className="text-base font-bold text-white mb-2">
                        {idea.title}
                      </h4>
                      <p className="text-slate-400 text-xs mb-4 max-w-xs">
                        Unlock target customer personas, competitive moats, and monetization strategies.
                      </p>
                      <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all">
                        Unlock Instant Access ($9)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
