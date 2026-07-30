'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AIValidationReport } from '@/app/api/generate-report/route';

interface Idea {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  tier: 'free' | 'premium';
  trend_score: number;
}

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loadingIdea, setLoadingIdea] = useState<boolean>(true);

  // Drawer & AI State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [generatingAI, setGeneratingAI] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<AIValidationReport | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('Initializing Gemini Engine...');

  // Load Idea details
  useEffect(() => {
    async function loadIdea() {
      try {
        setLoadingIdea(true);
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          // Fallback idea state if slug is test-only
          setIdea({
            id: 'demo-1',
            title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'AI Validation Demo',
            slug: slug || 'demo',
            summary:
              'Automated AI platform designed to stream process execution and increase customer acquisition efficiency.',
            category: 'SaaS',
            tags: ['AI', 'Automation', 'NextGen'],
            tier: 'free',
            trend_score: 91,
          });
        } else {
          setIdea(data as Idea);
        }
      } catch (err) {
        console.error('Error fetching idea:', err);
      } finally {
        setLoadingIdea(false);
      }
    }
    if (slug) loadIdea();
  }, [slug]);

  // Execute 120s AI Validation Call
  const handleRunAIValidation = async () => {
    if (!idea) return;

    setIsDrawerOpen(true);

    if (aiReport) return; // Prevent re-fetching if report is already loaded

    setGeneratingAI(true);

    // Simulated Loading Steps for Visual Feedback
    const steps = [
      'Scanning Global Market Trends...',
      'Mapping Competitor Weaknesses...',
      'Calculating TAM, SAM & SOM Financials...',
      'Structuring Final 120s AI Intelligence Report...',
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
      }
    }, 800);

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          summary: idea.summary,
          category: idea.category,
        }),
      });

      const data = await res.json();
      setAiReport(data);
    } catch (err) {
      console.error('Error triggering AI validation:', err);
    } finally {
      clearInterval(interval);
      setGeneratingAI(false);
    }
  };

  if (loadingIdea) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading idea details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* NAVBAR */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
            {idea?.category}
          </span>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 mb-8 shadow-2xl relative overflow-hidden">
          {/* Glowing Top Edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* Header Badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              BUSINESS OPPORTUNITY BLUEPRINT
            </span>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
              Trend Score: {idea?.trend_score}/100
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
            {idea?.title}
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8">
            {idea?.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {idea?.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA Trigger */}
          <button
            onClick={handleRunAIValidation}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-3 group"
          >
            <span>Run 120s AI Validation Engine</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </main>

      {/* SLIDING SIDE-DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between relative z-10">
              
              {/* Drawer Header */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                  <div>
                    <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                      Gemini 2.5 Flash Intelligence
                    </span>
                    <h2 className="text-xl font-bold text-white">Validation Report</h2>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* LOADING STATE */}
                {generatingAI ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-6" />
                    <p className="text-sm font-semibold text-white mb-2">{loadingStep}</p>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Gemini is scanning market signals and competitor landscapes...
                    </p>
                  </div>
                ) : aiReport ? (
                  /* REPORT CONTENT DISPLAY */
                  <div className="space-y-8">
                    {/* Market Opportunity */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Market Opportunity
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs">
                          Score: {aiReport.marketOpportunity.opportunityScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        {aiReport.marketOpportunity.overview}
                      </p>
                      <h4 className="text-xs font-semibold text-slate-400 mb-2">Growth Drivers:</h4>
                      <ul className="space-y-1.5">
                        {aiReport.marketOpportunity.growthDrivers.map((driver, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{driver}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Financial Forecast Grid */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Financial Projection (TAM / SAM / SOM)
                      </h3>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                          <span className="text-[10px] text-slate-500 font-bold block">TAM</span>
                          <span className="text-sm font-bold text-white">{aiReport.financialForecast.tam}</span>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                          <span className="text-[10px] text-slate-500 font-bold block">SAM</span>
                          <span className="text-sm font-bold text-indigo-400">{aiReport.financialForecast.sam}</span>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                          <span className="text-[10px] text-slate-500 font-bold block">SOM</span>
                          <span className="text-sm font-bold text-emerald-400">{aiReport.financialForecast.som}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold block">Est. Year 1 Revenue</span>
                          <span className="text-sm font-bold text-emerald-400">{aiReport.financialForecast.year1RevenueEstimate}</span>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                          <span className="text-[10px] text-slate-500 font-bold block">Est. Year 3 Revenue</span>
                          <span className="text-sm font-bold text-purple-400">{aiReport.financialForecast.year3RevenueEstimate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Competitors Analysis */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Competitor Weaknesses & Moat
                      </h3>
                      <div className="space-y-3">
                        {aiReport.competitorTracking.map((comp, i) => (
                          <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-white">{comp.name}</span>
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                                Moat: {comp.moat}
                              </span>
                            </div>
                            <p className="text-xs text-rose-400">
                              <strong className="text-slate-400">Weakness:</strong> {comp.weakness}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Persona */}
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Target Customer Persona
                      </h3>
                      <p className="text-xs font-bold text-indigo-300 mb-2">
                        {aiReport.targetAudience.primaryPersona}
                      </p>
                      <p className="text-xs text-slate-400 mb-2">
                        <strong>Willingness to Pay:</strong> {aiReport.targetAudience.willingnessToPay}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-slate-800 mt-6">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  Close Report
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
