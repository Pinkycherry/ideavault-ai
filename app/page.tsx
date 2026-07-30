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
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-t
