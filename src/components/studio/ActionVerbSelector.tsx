import React, { useState, useMemo } from 'react';
import { Sparkles, Search, X, Check, ArrowRight, Zap } from 'lucide-react';
import { ACTION_VERB_CATEGORIES, WEAK_VERBS_MAP, evaluateBulletStrength } from '../../data/actionVerbs';

interface ActionVerbSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerb: (verb: string) => void;
  currentBulletText?: string;
}

export const ActionVerbSelector: React.FC<ActionVerbSelectorProps> = ({
  isOpen,
  onClose,
  onSelectVerb,
  currentBulletText = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const strength = useMemo(() => {
    return evaluateBulletStrength(currentBulletText);
  }, [currentBulletText]);

  const filteredCategories = useMemo(() => {
    let categories = ACTION_VERB_CATEGORIES;
    if (activeCategory !== 'all') {
      categories = categories.filter(c => c.category === activeCategory);
    }
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories
      .map(cat => ({
        ...cat,
        verbs: cat.verbs.filter(v => v.toLowerCase().includes(query))
      }))
      .filter(cat => cat.verbs.length > 0);
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Power Action Verbs Thesaurus</h3>
              <p className="text-xs text-slate-500">Transform weak duties into high-impact executive achievements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Bullet Analysis Banner */}
        {currentBulletText && (
          <div className="p-4 bg-indigo-50/70 border-b border-indigo-100 text-xs text-indigo-950">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Live Bullet Power Analysis:
              </span>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                strength.score >= 75 ? 'bg-emerald-100 text-emerald-800' :
                strength.score >= 50 ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                Score: {strength.score}/100
              </span>
            </div>
            <p className="italic text-slate-700 truncate mb-1.5">"{currentBulletText}"</p>
            <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
              {strength.feedback.map((f, i) => (
                <span key={i} className="flex items-center gap-1">
                  • {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Weak Verbs Quick Replacement Bar if detected */}
        {strength.weakVerbMatch && WEAK_VERBS_MAP[strength.weakVerbMatch] && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs flex items-center gap-2">
            <span className="font-semibold text-amber-900">
              Replace weak "{strength.weakVerbMatch}":
            </span>
            <div className="flex flex-wrap gap-1.5">
              {WEAK_VERBS_MAP[strength.weakVerbMatch].map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    onSelectVerb(v);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-bold rounded border border-amber-300 shadow-xs text-xs flex items-center gap-1 transition-all"
                >
                  {v} <ArrowRight className="w-3 h-3 text-amber-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 150+ power verbs (e.g., spearheaded, architected, accelerated)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-colors ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {ACTION_VERB_CATEGORIES.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-colors ${
                  activeCategory === cat.category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.category.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Verb List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No action verbs match "{searchQuery}".
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-baseline justify-between border-b border-slate-100 pb-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {cat.category}
                  </h4>
                  <span className="text-[11px] text-slate-400">{cat.verbs.length} verbs</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cat.verbs.map((verb) => (
                    <button
                      key={verb}
                      onClick={() => {
                        onSelectVerb(verb);
                        onClose();
                      }}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/60 transition-all text-sm font-semibold text-slate-800 hover:text-indigo-700 flex items-center justify-between group"
                    >
                      <span>{verb}</span>
                      <Check className="w-3.5 h-3.5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Click any power verb to insert or replace at the start of your bullet</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
