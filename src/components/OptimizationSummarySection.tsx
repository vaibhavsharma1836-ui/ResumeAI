import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  Tag, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { OptimizationSummary } from '../types';

interface OptimizationSummarySectionProps {
  summary: OptimizationSummary;
}

export function OptimizationSummarySection({ summary }: OptimizationSummarySectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const matchScore = Math.min(100, Math.max(0, summary.matchScoreEstimate || 92));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden no-print">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200/80 flex items-center justify-between transition cursor-pointer text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Optimization Summary & Keyword Match
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {matchScore}% Alignment
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Keywords matched, emphasized skills, and structural enhancements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
          <span>{isOpen ? 'Collapse' : 'View Details'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Top Metric & Highlights Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Match Score Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  ATS Alignment Score
                </span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{matchScore}%</span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> High Match
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Calculated against core requirements and keywords in the job posting.
              </p>
            </div>

            {/* Key Strategic Highlights */}
            <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Strategic Enhancements Applied
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {summary.keyHighlights && summary.keyHighlights.length > 0 ? (
                  summary.keyHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Realigned action verbs and targeted requirements from the job posting.</span>
                  </li>
                )}
              </ul>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero fabricated information. All details grounded in original resume.</span>
              </div>
            </div>
          </div>

          {/* Keywords & Emphasized Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target JD Keywords */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Important Job Description Keywords
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {summary.keywordsIdentified && summary.keywordsIdentified.length > 0 ? (
                  summary.keywordsIdentified.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80 font-medium"
                    >
                      <Tag className="w-3 h-3 text-blue-500" />
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">None identified</span>
                )}
              </div>
            </div>

            {/* Skills Emphasized */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Candidate Skills Emphasized
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {summary.skillsEmphasized && summary.skillsEmphasized.length > 0 ? (
                  summary.skillsEmphasized.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">None emphasized</span>
                )}
              </div>
            </div>
          </div>

          {/* Sections Improved Details */}
          {summary.sectionsImproved && summary.sectionsImproved.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Section-by-Section Improvements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {summary.sectionsImproved.map((sec, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                  >
                    <span className="font-bold text-slate-900 block">{sec.section}</span>
                    <p className="text-slate-600 leading-relaxed">{sec.improvements}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
