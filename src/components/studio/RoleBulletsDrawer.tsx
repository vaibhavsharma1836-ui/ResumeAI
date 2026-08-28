import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Sparkles, BookOpen, Layers, Check } from 'lucide-react';
import { ROLE_BULLETS_LIBRARY } from '../../data/roleBulletsLibrary';

interface RoleBulletsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertBullet: (bulletText: string) => void;
}

export const RoleBulletsDrawer: React.FC<RoleBulletsDrawerProps> = ({
  isOpen,
  onClose,
  onInsertBullet
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(ROLE_BULLETS_LIBRARY[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCategoryData = useMemo(() => {
    return ROLE_BULLETS_LIBRARY.find(c => c.id === selectedCategory) || ROLE_BULLETS_LIBRARY[0];
  }, [selectedCategory]);

  const filteredBullets = useMemo(() => {
    if (!searchQuery.trim()) {
      return activeCategoryData.bullets;
    }
    const q = searchQuery.toLowerCase();
    // Search across all categories if user searched
    const all = ROLE_BULLETS_LIBRARY.flatMap(c => 
      c.bullets.map(b => ({ bullet: b, category: c.title }))
    );
    return all.filter(item => item.bullet.toLowerCase().includes(q)).map(item => item.bullet);
  }, [searchQuery, activeCategoryData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pre-Built Achievement Bullet Library</h3>
              <p className="text-xs text-slate-500">70+ battle-tested, quantifiable bullet points adhering to the Google XYZ Formula</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. latency, CI/CD, conversion, roadmap, revenue)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Body Layout: Categories Sidebar + Bullets List */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {!searchQuery && (
            <div className="w-64 border-r border-slate-200 bg-slate-50/50 p-3 space-y-1 overflow-y-auto">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mb-1">
                Roles & Domains
              </div>
              {ROLE_BULLETS_LIBRARY.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/70'
                    }`}
                  >
                    <span className="truncate">{cat.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {cat.bullets.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Bullets */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                {searchQuery ? `Search Results (${filteredBullets.length})` : activeCategoryData.title}
              </h4>
              <span className="text-[11px] text-slate-400">Click "+ Insert" to add to your active job</span>
            </div>

            {filteredBullets.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No matching achievement bullets found. Try adjusting your search query.
              </div>
            ) : (
              filteredBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all space-y-2 group"
                >
                  <p className="text-xs leading-relaxed text-slate-800 font-medium">
                    {bullet}
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onInsertBullet(bullet);
                        setCopiedId(String(idx));
                        setTimeout(() => setCopiedId(null), 1500);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      {copiedId === String(idx) ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Inserted!
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Insert Bullet
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Remember to adapt specific bracketed numbers/tools to reflect your authentic work.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
