import React, { useState, useEffect, useMemo } from 'react';
import {
  StructuredResume,
  ResumeTemplateId,
  AtsAnalysisResult
} from '../../types';
import { StudioToolbar } from './StudioToolbar';
import { ResumeEditorPanel } from './ResumeEditorPanel';
import { ResumePreviewPanel } from './ResumePreviewPanel';
import { AtsAnalysisDrawer } from './AtsAnalysisDrawer';
import { ResumeStylingPanel } from './ResumeStylingPanel';
import { CoverLetterStudio } from './CoverLetterStudio';
import { analyzeResumeForAts } from '../../utils/atsAnalyzer';
import { X, Sparkles } from 'lucide-react';

interface ResumeStudioProps {
  initialResume: StructuredResume;
  jobDescription?: string;
  onBackToOptimizer: () => void;
}

export const ResumeStudio: React.FC<ResumeStudioProps> = ({
  initialResume,
  jobDescription,
  onBackToOptimizer,
}) => {
  // Active Tab: Resume Builder vs Cover Letter Studio
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');

  // Resume state & history stack for Undo/Redo
  const [history, setHistory] = useState<StructuredResume[]>([initialResume]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentResume = history[historyIndex] || initialResume;

  // Selected template & ATS mode
  const [templateId, setTemplateId] = useState<ResumeTemplateId>('ats-classic');
  const [atsMode, setAtsMode] = useState(false);

  // Drawers
  const [atsDrawerOpen, setAtsDrawerOpen] = useState(false);
  const [stylingDrawerOpen, setStylingDrawerOpen] = useState(false);

  // Save status indicator
  const [isSaved, setIsSaved] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Debounced auto-save effect
  useEffect(() => {
    if (!isSaved && currentResume) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem('resume_studio_draft', JSON.stringify(currentResume));
          setIsSaved(true);
        } catch (err) {
          console.warn('Could not auto-save to localStorage', err);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentResume, isSaved]);

  // Handle Resume Update with history recording
  const handleResumeChange = (updated: StructuredResume) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);
    if (newHistory.length > 30) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setIsSaved(false);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setIsSaved(false);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setIsSaved(false);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history.length]);

  // Handle Save
  const handleSave = () => {
    try {
      localStorage.setItem('resume_studio_draft', JSON.stringify(currentResume));
      setIsSaved(true);
      setSaveToast('Resume saved successfully!');
      setTimeout(() => setSaveToast(null), 3000);
    } catch (e) {
      setIsSaved(true);
      setSaveToast('Saved to active session');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Calculate live ATS analysis
  const atsAnalysis = useMemo(() => {
    return analyzeResumeForAts(currentResume, jobDescription);
  }, [currentResume, jobDescription]);

  // Handle adding missing keyword to skills
  const handleAddMissingKeyword = (keyword: string) => {
    const updatedSkills = [...currentResume.skills];
    if (updatedSkills.length === 0) {
      updatedSkills.push({
        id: 'skill-custom',
        category: 'Core Competencies',
        items: [keyword],
      });
    } else {
      updatedSkills[0] = {
        ...updatedSkills[0],
        items: [...updatedSkills[0].items, keyword],
      };
    }
    handleResumeChange({
      ...currentResume,
      skills: updatedSkills,
    });
    setSaveToast(`Added "${keyword}" to Skills section`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Auto-fit 1 page
  const handleAutoFit1Page = () => {
    handleResumeChange({
      ...currentResume,
      spacingDensity: 'compact',
    });
    setSaveToast('Optimized spacing to fit 1 page');
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col">
      {/* Top Toolbar */}
      <StudioToolbar
        templateId={templateId}
        onTemplateChange={setTemplateId}
        atsMode={atsMode}
        onToggleAtsMode={() => setAtsMode(!atsMode)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        isSaved={isSaved}
        atsAnalysis={atsAnalysis}
        onOpenAtsDrawer={() => setAtsDrawerOpen(true)}
        onOpenStylingDrawer={() => setStylingDrawerOpen(true)}
        resume={currentResume}
        onBackToOptimizer={onBackToOptimizer}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Workspace */}
      {activeTab === 'resume' ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Editable Resume Content (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Resume Content Editor
              </h2>
              <span className="text-xs text-slate-500">Auto-syncs with live preview</span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-140px)] pr-1 custom-scrollbar">
              <ResumeEditorPanel
                resume={currentResume}
                jobDescription={jobDescription}
                onChange={handleResumeChange}
              />
            </div>
          </div>

          {/* Right Side: Live Resume Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-[calc(100vh-140px)] sticky top-16">
            <ResumePreviewPanel
              resume={currentResume}
              templateId={templateId}
              atsMode={atsMode}
              onAutoFit={handleAutoFit1Page}
            />
          </div>
        </div>
      ) : (
        /* Cover Letter Studio Mode */
        <div className="flex-1 flex overflow-hidden">
          <CoverLetterStudio
            resume={currentResume}
            targetJobDescription={jobDescription || ''}
          />
        </div>
      )}

      {/* ATS Analysis Drawer */}
      <AtsAnalysisDrawer
        analysis={atsAnalysis}
        isOpen={atsDrawerOpen}
        onClose={() => setAtsDrawerOpen(false)}
        onSelectMissingKeyword={handleAddMissingKeyword}
      />

      {/* Design & Styling Drawer Modal */}
      {stylingDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Design & Typography</h3>
                  <p className="text-[11px] text-slate-500">Fine-tune colors, fonts, and density</p>
                </div>
              </div>
              <button
                onClick={() => setStylingDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ResumeStylingPanel
                resume={currentResume}
                onChange={handleResumeChange}
                onClose={() => setStylingDrawerOpen(false)}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setStylingDrawerOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Apply & Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {saveToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2">
          <span>✓ {saveToast}</span>
        </div>
      )}
    </div>
  );
};
