import React from 'react';
import {
  AtsAnalysisResult,
  StructuredResume
} from '../../types';
import {
  ShieldCheck,
  Target,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  X,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';

interface AtsAnalysisDrawerProps {
  analysis: AtsAnalysisResult;
  isOpen: boolean;
  onClose: () => void;
  onSelectMissingKeyword?: (kw: string) => void;
}

export const AtsAnalysisDrawer: React.FC<AtsAnalysisDrawerProps> = ({
  analysis,
  isOpen,
  onClose,
  onSelectMissingKeyword,
}) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500 text-white';
    if (score >= 70) return 'bg-blue-600 text-white';
    if (score >= 50) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">ATS Compliance & Match Analysis</h2>
            <p className="text-[11px] text-slate-500">Live parsing & qualification audit</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Score Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Overall ATS Score */}
          <div className={`p-4 rounded-2xl border ${getScoreColor(analysis.overallAtsScore)} flex flex-col items-center justify-center text-center shadow-2xs`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Overall ATS Score
            </span>
            <span className="text-3xl font-extrabold tracking-tight">
              {analysis.overallAtsScore}%
            </span>
            <span className="text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full bg-white/80 border border-current/20">
              {analysis.overallAtsScore >= 80 ? 'Highly Compatible' : 'Needs Optimization'}
            </span>
          </div>

          {/* Job Match Score */}
          <div className={`p-4 rounded-2xl border ${getScoreColor(analysis.jobMatchScore)} flex flex-col items-center justify-center text-center shadow-2xs`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Job Match Score
            </span>
            <span className="text-3xl font-extrabold tracking-tight">
              {analysis.jobMatchScore}%
            </span>
            <span className="text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full bg-white/80 border border-current/20">
              {analysis.jobMatchScore >= 75 ? 'Strong Alignment' : 'Moderate Match'}
            </span>
          </div>
        </div>

        {/* Formatting Compatibility Checks */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-slate-600" />
              Formatting Compatibility ({analysis.formattingCompatibility.score}%)
            </h3>
          </div>

          <div className="space-y-2">
            {analysis.formattingCompatibility.checks.map((check) => (
              <div
                key={check.id}
                className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 bg-white ${
                  check.passed ? 'border-slate-200' : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-slate-900">{check.name}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{check.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword Coverage */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              Keyword Coverage ({analysis.keywordCoverage.matched.length} of {analysis.keywordCoverage.totalIdentified})
            </h3>
            <span className="text-xs font-bold text-indigo-600 font-mono">
              {analysis.keywordCoverage.matchPercentage}%
            </span>
          </div>

          {/* Matched Keywords */}
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 block mb-1.5">
              ✓ Matched in Resume:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {analysis.keywordCoverage.matched.length > 0 ? (
                analysis.keywordCoverage.matched.slice(0, 15).map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">None detected</span>
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          {analysis.keywordCoverage.missing.length > 0 && (
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-semibold text-amber-800 block mb-1.5 flex items-center gap-1">
                <span>⚠ Missing Relevant Keywords:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.keywordCoverage.missing.map((kw, i) => (
                  <span
                    key={i}
                    onClick={() => onSelectMissingKeyword?.(kw)}
                    className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium cursor-pointer hover:bg-amber-100 transition flex items-center gap-1"
                    title="Click to add to skills or experience if supported"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actionable Recommendations */}
        {analysis.actionableRecommendations.length > 0 && (
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
              Actionable Recommendations
            </h3>
            <ul className="space-y-1.5 text-xs text-indigo-900/90 leading-relaxed">
              {analysis.actionableRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <span>Calculated from active resume & target role</span>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition cursor-pointer"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
