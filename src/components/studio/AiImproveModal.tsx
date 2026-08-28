import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Loader2, X, AlertCircle } from 'lucide-react';

export type ImprovementAction = 'strengthen' | 'concise' | 'keywords' | 'grammar' | 'general';

interface AiImproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  sectionType: string;
  context?: string;
  jobDescription?: string;
  onApply: (improvedText: string) => void;
}

export const AiImproveModal: React.FC<AiImproveModalProps> = ({
  isOpen,
  onClose,
  originalText,
  sectionType,
  context,
  jobDescription,
  onApply,
}) => {
  const [selectedAction, setSelectedAction] = useState<ImprovementAction>('strengthen');
  const [improvedText, setImprovedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (actionToUse: ImprovementAction = selectedAction) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/improve-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType,
          text: originalText,
          jobDescription,
          context,
          improvementType: actionToUse,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to improve text');
      }

      setImprovedText(data.improvedText);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating improvements.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: ImprovementAction) => {
    setSelectedAction(action);
    handleGenerate(action);
  };

  const actions: { id: ImprovementAction; label: string; desc: string }[] = [
    {
      id: 'strengthen',
      label: 'Strengthen Action Verbs',
      desc: 'Rephrase with high-impact executive verbs and measurable structure',
    },
    {
      id: 'concise',
      label: 'Make More Concise',
      desc: 'Eliminate filler and tighten phrasing while preserving facts',
    },
    {
      id: 'keywords',
      label: 'Add Relevant Keywords',
      desc: 'Incorporate target job terminology matching candidate capabilities',
    },
    {
      id: 'grammar',
      label: 'Fix Grammar & Polish',
      desc: 'Ensure consistent tense, punctuation, and professional flow',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Section Optimizer</h3>
              <p className="text-xs text-slate-500">
                Enhance content strictly grounded in your authentic experience
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Action Selector Pills */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
              Choose Enhancement Strategy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {actions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => handleActionClick(act.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedAction === act.id
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs ring-1 ring-indigo-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50/80'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    {act.label}
                    {selectedAction === act.id && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 leading-tight">{act.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Original Text Display */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Original Text ({sectionType})
            </label>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono-code">
              {originalText}
            </div>
          </div>

          {/* AI Result Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI-Refined Version
              </label>
              {!improvedText && !isLoading && (
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Generate Now →
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="p-6 bg-indigo-50/40 rounded-xl border border-indigo-100 flex flex-col items-center justify-center gap-2 text-indigo-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-xs font-medium text-slate-600">
                  Refining bullet with verified action verbs...
                </p>
              </div>
            ) : error ? (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            ) : improvedText ? (
              <textarea
                value={improvedText}
                onChange={(e) => setImprovedText(e.target.value)}
                rows={3}
                className="w-full p-3 bg-white border border-indigo-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition leading-relaxed font-mono-code"
              />
            ) : (
              <div
                onClick={() => handleGenerate()}
                className="p-5 border-2 border-dashed border-slate-200 rounded-xl text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition text-slate-400 hover:text-indigo-600"
              >
                <Sparkles className="w-5 h-5 mx-auto mb-1 opacity-70" />
                <p className="text-xs font-medium">Click to generate improvement</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!improvedText || isLoading}
            onClick={() => {
              if (improvedText) {
                onApply(improvedText);
                onClose();
              }
            }}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Improvement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
