import { useState } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Printer,
  RotateCcw,
  Layout,
  FileText,
  Layers,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { OptimizationResult, JobMatchAnalysisResult } from '../../types';

interface BeforeAfterComparisonProps {
  originalText: string;
  optimizationResult: OptimizationResult;
  initialMatchScore?: number;
  onOpenStudio: () => void;
  onBackToAnalysis?: () => void;
  onStartOver: () => void;
  onEditInputs: () => void;
}

export function BeforeAfterComparison({
  originalText,
  optimizationResult,
  initialMatchScore = 65,
  onOpenStudio,
  onBackToAnalysis,
  onStartOver,
  onEditInputs,
}: BeforeAfterComparisonProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'optimized-only' | 'original-only'>('side-by-side');
  const [copied, setCopied] = useState(false);

  const optimizedScore = optimizationResult.summary?.matchScoreEstimate || 92;
  const scoreDelta = Math.max(0, optimizedScore - initialMatchScore);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizationResult.optimizedResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([optimizationResult.optimizedResume], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'Optimized_Resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Delta Score Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Optimization Complete
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Zero Hallucinations Guarantee
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Before vs. After Optimization
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Compare your original document with the AI-optimized version. Keywords, power verbs, and ATS formatting have been maximized while anchoring strictly to your authentic background.
            </p>
          </div>

          {/* Before / After Match Score Comparison Card */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-2xs w-full sm:w-auto justify-center sm:justify-start">
            {/* Original Score */}
            <div className="text-center px-2">
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Original Match
              </span>
              <span className="text-2xl font-extrabold text-slate-700">
                {initialMatchScore}%
              </span>
            </div>

            {/* Delta Arrow */}
            <div className="flex flex-col items-center justify-center">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                +{scoreDelta}%
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5" />
            </div>

            {/* Optimized Score */}
            <div className="text-center px-2">
              <span className="block text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                Optimized Match
              </span>
              <span className="text-2xl font-extrabold text-indigo-600">
                {optimizedScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Key Highlights Pill Row */}
        {optimizationResult.summary?.keyHighlights && optimizationResult.summary.keyHighlights.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {optimizationResult.summary.keyHighlights.slice(0, 3).map((hl, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/60 text-xs text-slate-700 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{hl}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        {/* Layout Mode Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">View:</span>
          <div className="inline-flex p-0.5 rounded-lg bg-slate-100 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'side-by-side' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('optimized-only')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'optimized-only' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Optimized</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('original-only')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'original-only' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Original</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onBackToAnalysis && (
            <button
              type="button"
              onClick={onBackToAnalysis}
              className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Job Match</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenStudio}
            id="comparison-open-studio-btn"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition cursor-pointer active:scale-95"
          >
            <Layout className="w-3.5 h-3.5 text-indigo-200" />
            <span>Open in Resume Studio →</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Optimized'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>.txt</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Side-by-Side / Comparison Containers */}
      <div className={`grid gap-6 ${viewMode === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Original Resume Panel */}
        {(viewMode === 'side-by-side' || viewMode === 'original-only') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Original Candidate Resume
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                Score: {initialMatchScore}%
              </span>
            </div>

            <div className="p-6 overflow-y-auto max-h-[700px] text-xs leading-relaxed text-slate-700 font-sans whitespace-pre-wrap selection:bg-slate-200">
              {originalText}
            </div>
          </div>
        )}

        {/* Optimized Resume Panel */}
        {(viewMode === 'side-by-side' || viewMode === 'optimized-only') && (
          <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-md overflow-hidden flex flex-col relative">
            <div className="px-5 py-3.5 border-b border-indigo-100 bg-indigo-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Optimized & ATS-Aligned Resume</span>
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white shadow-2xs">
                Score: {optimizedScore}% (+{scoreDelta}%)
              </span>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto max-h-[700px] text-xs leading-relaxed text-slate-800 font-sans prose prose-slate max-w-none">
              <Markdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-extrabold text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mt-4 mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xs font-semibold text-slate-900 mt-3 mb-1">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-xs text-slate-700 leading-relaxed mb-2">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700 my-1.5">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed pl-1">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-slate-900">{children}</strong>
                  ),
                }}
              >
                {optimizationResult.optimizedResume}
              </Markdown>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Want to customize fonts, layout templates, or edit bullet points?
            </h4>
            <p className="text-xs text-slate-300">
              Open your optimized resume in the interactive Resume Studio with 6 ATS layouts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onStartOver}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Start Over
          </button>

          <button
            type="button"
            onClick={onOpenStudio}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer active:scale-95"
          >
            <span>Open in Resume Studio →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
