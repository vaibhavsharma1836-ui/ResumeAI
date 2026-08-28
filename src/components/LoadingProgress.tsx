import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 1, text: 'Scanning job description for required qualifications & keywords...' },
  { id: 2, text: 'Evaluating verified experience and skills from your resume...' },
  { id: 3, text: 'Refining bullet points with impactful action verbs and ATS alignment...' },
  { id: 4, text: 'Finalizing pristine Markdown resume and optimization breakdown...' },
];

interface LoadingProgressProps {
  customTitle?: string;
  customMessage?: string;
}

export function LoadingProgress({ customTitle, customMessage }: LoadingProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-slate-200/90 p-8 shadow-lg shadow-slate-200/50 text-center space-y-6">
      {/* Animated icon */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
          <Sparkles className="w-8 h-8 animate-pulse text-indigo-600" />
        </div>
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600"></span>
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {customTitle || 'AI Career Engine at Work'}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {customMessage || 'Matching your real achievements to the job criteria with zero hallucinations.'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3 max-w-md mx-auto text-left py-2">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-50/80 border border-indigo-200/70 text-indigo-950 font-medium scale-[1.02]'
                  : isDone
                  ? 'text-slate-700 font-normal opacity-80'
                  : 'text-slate-400 font-normal opacity-50'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                    {step.id}
                  </div>
                )}
              </div>
              <span className="text-xs sm:text-sm">{step.text}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-700 bg-emerald-50/80 py-2 px-4 rounded-lg border border-emerald-100/80">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Strict truthfulness active: Only verified source facts are used</span>
      </div>
    </div>
  );
}
