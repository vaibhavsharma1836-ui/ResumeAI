import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Edit3,
  Check,
  ChevronRight,
  Layers,
  FileSearch,
  Filter,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { JobMatchAnalysisResult } from '../../types';

interface JobMatchDashboardProps {
  analysis: JobMatchAnalysisResult;
  onOptimize: () => void;
  onEditInputs: () => void;
  onOpenStudio?: () => void;
  isOptimizing?: boolean;
}

export function JobMatchDashboard({
  analysis,
  onOptimize,
  onEditInputs,
  onOpenStudio,
  isOptimizing = false,
}: JobMatchDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'experience' | 'actionPlan'>('overview');
  const [keywordFilter, setKeywordFilter] = useState<'all' | 'matched' | 'missing' | 'semantic'>('all');

  const {
    overallScore,
    tier,
    summaryVerdict,
    breakdown,
    skillsMatch,
    keywordAnalysis,
    experienceAlignment,
    educationAndCerts,
    strengths,
    gaps,
    actionPlan,
  } = analysis;

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200 ring-emerald-500/20';
    if (score >= 65) return 'text-blue-600 bg-blue-50 border-blue-200 ring-blue-500/20';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200 ring-amber-500/20';
    return 'text-rose-600 bg-rose-50 border-rose-200 ring-rose-500/20';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 65) return 'bg-blue-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Action Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-50/60 via-blue-50/40 to-transparent pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                <FileSearch className="w-3.5 h-3.5" />
                Pre-Optimization Job Match Engine
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Truth-Grounded Analysis
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Job Match Fit: <span className="text-indigo-600">{tier || 'Analysis Complete'}</span>
            </h1>

            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {summaryVerdict ||
                'Here is a detailed comparison of your original resume against the target role requirements before any AI rewriting.'}
            </p>
          </div>

          {/* Prominent Call to Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={onEditInputs}
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Change Input / JD</span>
            </button>

            <button
              type="button"
              onClick={onOptimize}
              disabled={isOptimizing}
              id="match-optimize-resume-btn"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/25 transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{isOptimizing ? 'Optimizing Resume...' : 'Optimize My Resume →'}</span>
            </button>
          </div>
        </div>

        {/* 5-Metric Breakdown Grid */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Overall Score */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Overall Match</span>
              <Target className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="my-2">
              <span className={`text-3xl font-black ${overallScore >= 70 ? 'text-indigo-600' : 'text-slate-800'}`}>
                {overallScore}
                <span className="text-base font-bold text-slate-400">/100</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(overallScore)}`}
                style={{ width: `${Math.min(100, Math.max(5, overallScore))}%` }}
              />
            </div>
          </div>

          {/* Skills Score */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Skills Match</span>
              <Award className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-slate-800">
                {breakdown?.skills ?? 0}
                <span className="text-base font-bold text-slate-400">%</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(breakdown?.skills ?? 0)}`}
                style={{ width: `${Math.min(100, Math.max(5, breakdown?.skills ?? 0))}%` }}
              />
            </div>
          </div>

          {/* Experience Score */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Experience</span>
              <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-slate-800">
                {breakdown?.experience ?? 0}
                <span className="text-base font-bold text-slate-400">%</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(breakdown?.experience ?? 0)}`}
                style={{ width: `${Math.min(100, Math.max(5, breakdown?.experience ?? 0))}%` }}
              />
            </div>
          </div>

          {/* Keywords Score */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Keywords</span>
              <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-slate-800">
                {breakdown?.keywords ?? 0}
                <span className="text-base font-bold text-slate-400">%</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(breakdown?.keywords ?? 0)}`}
                style={{ width: `${Math.min(100, Math.max(5, breakdown?.keywords ?? 0))}%` }}
              />
            </div>
          </div>

          {/* Education & Certs Score */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Education / Certs</span>
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black text-slate-800">
                {breakdown?.education ?? 0}
                <span className="text-base font-bold text-slate-400">%</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(breakdown?.education ?? 0)}`}
                style={{ width: `${Math.min(100, Math.max(5, breakdown?.education ?? 0))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Deep Dive */}
      <div className="flex items-center border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Match Overview & Strengths</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'skills'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Skills & Keywords Match ({skillsMatch?.matched?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'experience'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Experience & Education Alignment</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('actionPlan')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'actionPlan'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>How to Improve Match ({actionPlan?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Overview & Comparative Strengths/Gaps */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Strengths Card */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs p-6 flex flex-col">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-emerald-50">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your Key Strengths for this Role</h3>
                  <p className="text-xs text-slate-500">Verified areas where your resume matches requirements</p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {strengths && strengths.length > 0 ? (
                  strengths.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100/80 text-xs sm:text-sm text-slate-800 flex items-start gap-3"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{str}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No specific standout strengths detected.</p>
                )}
              </div>
            </div>

            {/* Resume Gaps & Weaknesses Card */}
            <div className="bg-white rounded-2xl border border-amber-100 shadow-xs p-6 flex flex-col">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-amber-50">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Resume Gaps & Missing Evidence</h3>
                  <p className="text-xs text-slate-500">Requirements in the job posting lacking proof in your resume</p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {gaps && gaps.length > 0 ? (
                  gaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/80 text-xs sm:text-sm text-slate-800 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{gap}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No substantial gaps detected.</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-amber-50 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>The optimizer will reframe existing achievements rather than fabricating missing skills.</span>
              </div>
            </div>
          </div>

          {/* Quick Snapshot Action Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-bold flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-300" />
                Ready to bridge these gaps with AI Optimization?
              </h4>
              <p className="text-xs text-indigo-200">
                We will rewrite your bullet points, prioritize matched keywords, and format your resume for maximum ATS resonance.
              </p>
            </div>
            <button
              type="button"
              onClick={onOptimize}
              disabled={isOptimizing}
              className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md transition cursor-pointer shrink-0 active:scale-95 disabled:opacity-50"
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize Resume Now →'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Skills & Keyword Analysis */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Skills Breakdown 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matched Skills */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matched Skills ({skillsMatch?.matched?.length || 0})</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Skills explicitly demonstrated in your resume.</p>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {skillsMatch?.matched && skillsMatch.matched.length > 0 ? (
                  skillsMatch.matched.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No direct matches identified.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Missing Skills ({skillsMatch?.missing?.length || 0})</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold">
                  Job Demands
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Important role requirements absent from your resume.</p>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {skillsMatch?.missing && skillsMatch.missing.length > 0 ? (
                  skillsMatch.missing.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/80 text-xs font-medium flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-emerald-600 font-medium">Zero missing key skills detected!</p>
                )}
              </div>
            </div>

            {/* Potential / Adjacent Skills */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <HelpCircle className="w-4 h-4" />
                  <span>Potential / Transferable ({skillsMatch?.potential?.length || 0})</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                  Adjacent
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Skills where you show partial exposure or related tools.</p>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {skillsMatch?.potential && skillsMatch.potential.length > 0 ? (
                  skillsMatch.potential.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80 text-xs font-medium flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No adjacent skills identified.</p>
                )}
              </div>
            </div>
          </div>

          {/* Semantic Bridges / Keyword Equivalents Table */}
          {keywordAnalysis?.semantic && keywordAnalysis.semantic.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Semantic Terminology Bridges</h3>
                  <p className="text-xs text-slate-500">
                    How terms in your resume correlate to vocabulary in the job description
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="px-4 py-2.5 rounded-l-lg">Your Resume Term</th>
                      <th className="px-4 py-2.5">Target Job Term</th>
                      <th className="px-4 py-2.5 rounded-r-lg">Optimization Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {keywordAnalysis.semantic.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-semibold text-slate-800 font-mono">
                          {item.resumeEquivalent}
                        </td>
                        <td className="px-4 py-3 font-bold text-indigo-600 font-mono">
                          {item.jobTerm}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {item.notes || 'Align terminology to match recruiter search query.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Complete Keyword Filter & Tag List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Target Role Keyword Coverage</h3>
                <p className="text-xs text-slate-500">Essential domain terms and technologies from the job description</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setKeywordFilter('all')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    keywordFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  All ({(keywordAnalysis?.matched?.length || 0) + (keywordAnalysis?.missing?.length || 0)})
                </button>
                <button
                  type="button"
                  onClick={() => setKeywordFilter('matched')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    keywordFilter === 'matched' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Matched ({keywordAnalysis?.matched?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setKeywordFilter('missing')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    keywordFilter === 'missing' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Missing ({keywordAnalysis?.missing?.length || 0})
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {(keywordFilter === 'all' || keywordFilter === 'matched') &&
                keywordAnalysis?.matched?.map((kw, idx) => (
                  <span
                    key={`m-${idx}`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{kw}</span>
                  </span>
                ))}

              {(keywordFilter === 'all' || keywordFilter === 'missing') &&
                keywordAnalysis?.missing?.map((kw, idx) => (
                  <span
                    key={`mis-${idx}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{kw}</span>
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Experience & Education Alignment */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          {/* Strong Experience Matches */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Strong Experience Matches</h3>
                <p className="text-xs text-slate-500">Core duties where your background provides compelling proof</p>
              </div>
            </div>

            <div className="space-y-3">
              {experienceAlignment?.strongMatches && experienceAlignment.strongMatches.length > 0 ? (
                experienceAlignment.strongMatches.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 text-xs space-y-1.5">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item.area}</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      <strong className="text-slate-800">Resume Evidence:</strong> {item.evidence}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No strong direct experience matches identified.</p>
              )}
            </div>
          </div>

          {/* Partial Experience & Evidence Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Partial Matches */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Partial / Related Experience</h3>
              </div>
              <div className="space-y-3 flex-1">
                {experienceAlignment?.partialMatches && experienceAlignment.partialMatches.length > 0 ? (
                  experienceAlignment.partialMatches.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs space-y-1">
                      <h4 className="font-bold text-blue-900">{item.area}</h4>
                      <p className="text-slate-700"><strong>Background:</strong> {item.candidateBackground}</p>
                      <p className="text-blue-800/80 text-[11px]"><strong>Identified Gap:</strong> {item.gap}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">None noted.</p>
                )}
              </div>
            </div>

            {/* Insufficient Evidence */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Areas with Insufficient Resume Evidence</h3>
              </div>
              <div className="space-y-3 flex-1">
                {experienceAlignment?.insufficientEvidence && experienceAlignment.insufficientEvidence.length > 0 ? (
                  experienceAlignment.insufficientEvidence.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs space-y-1">
                      <h4 className="font-bold text-amber-900">{item.requirement}</h4>
                      <p className="text-amber-800">{item.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">None noted.</p>
                )}
              </div>
            </div>
          </div>

          {/* Education & Certification Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Education & Certification Audit</h3>
                <p className="text-xs text-slate-500">Degree, major, and professional credential requirements comparison</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
                <span className="font-bold text-emerald-900 block mb-1">Matched Credentials:</span>
                {educationAndCerts?.matched && educationAndCerts.matched.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-0.5 text-emerald-800">
                    {educationAndCerts.matched.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                ) : (
                  <span className="text-slate-500 italic">None specified.</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
                <span className="font-bold text-rose-900 block mb-1">Missing Credentials:</span>
                {educationAndCerts?.missing && educationAndCerts.missing.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-0.5 text-rose-800">
                    {educationAndCerts.missing.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                ) : (
                  <span className="text-emerald-700 font-medium">None required or missing.</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Not Explicitly Stated:</span>
                {educationAndCerts?.notMentioned && educationAndCerts.notMentioned.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    {educationAndCerts.notMentioned.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                ) : (
                  <span className="text-slate-400 italic">None.</span>
                )}
              </div>
            </div>

            {educationAndCerts?.analysis && (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                <strong>Recruiter Context:</strong> {educationAndCerts.analysis}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Strategic Action Plan */}
      {activeTab === 'actionPlan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">How to Improve Your Match</h3>
                  <p className="text-xs text-slate-500">
                    Ethical, truth-grounded strategic recommendations to maximize your application score
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOptimize}
                disabled={isOptimizing}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Recommendations with AI</span>
              </button>
            </div>

            <div className="space-y-4">
              {actionPlan && actionPlan.length > 0 ? (
                actionPlan.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition bg-slate-50/50 hover:bg-indigo-50/30 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed text-xs sm:text-sm pl-7">
                      {item.recommendation}
                    </p>

                    {item.exampleOrTip && (
                      <div className="ml-7 p-2.5 rounded-lg bg-white border border-indigo-100 text-indigo-900 text-[11px] leading-relaxed">
                        <strong className="font-semibold text-indigo-700">Concrete Example:</strong> {item.exampleOrTip}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No recommendations generated.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky / Fixed Bottom Action Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Transform this Analysis into an ATS-Optimized Resume
            </h4>
            <p className="text-xs text-slate-500">
              Rewrites bullet points, highlights matched keywords, and preserves 100% factual accuracy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onOpenStudio && (
            <button
              type="button"
              onClick={onOpenStudio}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Open in Studio
            </button>
          )}

          <button
            type="button"
            onClick={onOptimize}
            disabled={isOptimizing}
            id="bottom-match-optimize-btn"
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>{isOptimizing ? 'Optimizing Resume...' : 'Optimize My Resume →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
