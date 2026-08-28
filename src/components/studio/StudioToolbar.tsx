import React, { useState, useRef, useEffect } from 'react';
import {
  ResumeTemplateId,
  AtsAnalysisResult,
  StructuredResume
} from '../../types';
import {
  Layout,
  ShieldCheck,
  Undo2,
  Redo2,
  Save,
  Download,
  Copy,
  FileText,
  FileDown,
  Check,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Palette,
  Mail,
  Wand2,
  CheckCircle2,
  Printer,
  FileCode,
  FileSpreadsheet,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { serializeStructuredResumeToMarkdown } from '../../utils/resumeParser';

interface StudioToolbarProps {
  templateId: ResumeTemplateId;
  onTemplateChange: (template: ResumeTemplateId) => void;
  atsMode: boolean;
  onToggleAtsMode: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  isSaved: boolean;
  atsAnalysis: AtsAnalysisResult;
  onOpenAtsDrawer: () => void;
  onOpenStylingDrawer: () => void;
  resume: StructuredResume;
  onBackToOptimizer: () => void;
  activeTab: 'resume' | 'cover-letter';
  onTabChange: (tab: 'resume' | 'cover-letter') => void;
}

const TEMPLATES: { id: ResumeTemplateId; name: string; tag: string; color: string }[] = [
  { id: 'ats-classic', name: 'ATS Classic', tag: 'Standard', color: '#1e293b' },
  { id: 'modern', name: 'Stockholm', tag: 'Polished', color: '#2563eb' },
  { id: 'minimal', name: 'Vienna', tag: 'Clean', color: '#0f766e' },
  { id: 'executive', name: 'London', tag: 'Leadership', color: '#1e1b4b' },
  { id: 'tech', name: 'Tokyo', tag: 'Engineers', color: '#4f46e5' },
  { id: 'creative', name: 'Sydney', tag: 'Editorial', color: '#be123c' },
];

export const StudioToolbar: React.FC<StudioToolbarProps> = ({
  templateId,
  onTemplateChange,
  atsMode,
  onToggleAtsMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  isSaved,
  atsAnalysis,
  onOpenAtsDrawer,
  onOpenStylingDrawer,
  resume,
  onBackToOptimizer,
  activeTab,
  onTabChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    const md = serializeStructuredResumeToMarkdown(resume);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const md = serializeStructuredResumeToMarkdown(resume);
    const blob = new Blob([md], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resume.contact.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadMenuOpen(false);
  };

  const handleDownloadDocx = () => {
    // Generate a clean HTML-based doc file that Microsoft Word & Google Docs open seamlessly
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${resume.contact.fullName || 'Resume'}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.35; color: #111; margin: 1in; }
          h1 { font-size: 20pt; font-weight: bold; margin-bottom: 2pt; text-transform: uppercase; color: #0f172a; }
          h2 { font-size: 12pt; font-weight: bold; border-bottom: 1pt solid #cbd5e1; padding-bottom: 2pt; margin-top: 14pt; margin-bottom: 4pt; text-transform: uppercase; color: #1e293b; }
          h3 { font-size: 11pt; font-weight: bold; margin-top: 6pt; margin-bottom: 2pt; color: #0f172a; }
          p { margin: 2pt 0; }
          ul { margin-top: 2pt; margin-bottom: 6pt; padding-left: 18pt; }
          li { margin-bottom: 2pt; }
          .contact { font-size: 9.5pt; color: #475569; margin-bottom: 12pt; }
        </style>
      </head>
      <body>
        <h1>${resume.contact.fullName || 'Candidate Name'}</h1>
        ${resume.contact.title ? `<p><b>${resume.contact.title}</b></p>` : ''}
        <div class="contact">
          ${[resume.contact.location, resume.contact.phone, resume.contact.email, resume.contact.linkedin, resume.contact.github].filter(Boolean).join(' | ')}
        </div>
        ${resume.summary ? `<h2>Professional Summary</h2><p>${resume.summary}</p>` : ''}
        ${resume.experience.length > 0 ? `<h2>Work Experience</h2>` + resume.experience.map(e => `
          <h3>${e.role} — ${e.company} (${[e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ')})</h3>
          <ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        `).join('') : ''}
        ${resume.skills.length > 0 ? `<h2>Technical & Professional Skills</h2>` + resume.skills.map(s => `
          <p><b>${s.category}:</b> ${s.items.join(', ')}</p>
        `).join('') : ''}
        ${resume.education.length > 0 ? `<h2>Education</h2>` + resume.education.map(e => `
          <p><b>${[e.degree, e.field].filter(Boolean).join(' in ')}</b>, ${e.institution} (${[e.startDate, e.endDate].filter(Boolean).join(' – ')})</p>
        `).join('') : ''}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resume.contact.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.doc`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadMenuOpen(false);
  };

  const handlePrintPdf = () => {
    window.print();
    setDownloadMenuOpen(false);
  };

  const atsScore = atsAnalysis.overallAtsScore || 75;

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back button & Tabs */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onBackToOptimizer}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="Back to Optimizer Input"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Optimizer</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Tab Switcher: Resume vs Cover Letter */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => onTabChange('resume')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'resume'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume Studio</span>
            </button>
            <button
              onClick={() => onTabChange('cover-letter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cover-letter'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Cover Letter</span>
              <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase">
                AI
              </span>
            </button>
          </div>

          {activeTab === 'resume' && (
            <>
              {/* Template Selector with Visual Color Dot */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <Layout className="w-3.5 h-3.5 text-indigo-600 hidden sm:inline" />
                <span className="text-[11px] font-semibold text-slate-500 hidden md:inline">Template:</span>
                <select
                  value={templateId}
                  onChange={(e) => onTemplateChange(e.target.value as ResumeTemplateId)}
                  className="text-xs font-bold text-slate-900 bg-transparent border-none outline-hidden cursor-pointer"
                  id="template-selector"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.tag})
                    </option>
                  ))}
                </select>
              </div>

              {/* Design & Styling Drawer Button */}
              <button
                type="button"
                onClick={onOpenStylingDrawer}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                title="Customize Accent Color, Typography, Density & Headers"
              >
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline">Design & Styles</span>
              </button>

              {/* ATS Friendly Mode Toggle */}
              <button
                type="button"
                onClick={onToggleAtsMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  atsMode
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
                title="Toggle ATS Pure High-Compatibility Format"
                id="ats-mode-toggle"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ATS Mode {atsMode ? 'ON' : 'OFF'}</span>
              </button>
            </>
          )}
        </div>

        {/* Center/Right: Actions, Score & Download */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {activeTab === 'resume' && (
            <>
              {/* Resume.io style ATS Completeness Score Widget */}
              <button
                type="button"
                onClick={onOpenAtsDrawer}
                className={`px-3 py-1.5 rounded-2xl border text-xs font-extrabold flex items-center gap-2 shadow-2xs transition cursor-pointer hover:scale-102 active:scale-98 ${
                  atsScore >= 80
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80'
                }`}
                title="View detailed ATS score & keyword match breakdown"
                id="ats-score-badge-btn"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <span className={`w-2 h-2 rounded-full ${atsScore >= 80 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                </div>
                <span>ATS Score: {atsScore}%</span>
                <span className="hidden lg:inline text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white/80 border border-emerald-300/40">
                  {atsScore >= 85 ? 'Strong' : atsScore >= 70 ? 'Good' : 'Needs Polish'}
                </span>
              </button>

              {/* Undo / Redo */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={onUndo}
                  disabled={!canUndo}
                  className="p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition cursor-pointer"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-200" />
                <button
                  type="button"
                  onClick={onRedo}
                  disabled={!canRedo}
                  className="p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition cursor-pointer"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Save Status Button */}
              <button
                type="button"
                onClick={onSave}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isSaved
                    ? 'bg-slate-50 text-slate-600 border-slate-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                }`}
                title={isSaved ? 'All changes saved locally' : 'Save draft to browser storage'}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    <span>Save Draft</span>
                  </>
                )}
              </button>
            </>
          )}

          {/* Primary Download Dropdown Menu (Resume.io style) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-95 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              id="download-resume-menu-btn"
            >
              <Download className="w-4 h-4 text-indigo-200" />
              <span>Download</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${downloadMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {downloadMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Export Formats
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 hover:bg-indigo-50/70 hover:text-indigo-700 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>Download PDF</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">Recommended</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal">Print to high-resolution vector PDF</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 hover:bg-blue-50/70 hover:text-blue-700 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Microsoft Word (.doc)</div>
                    <p className="text-[10px] text-slate-500 font-normal">Editable in Word & Google Docs</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Plain Text (.txt)</div>
                    <p className="text-[10px] text-slate-500 font-normal">Pure raw text for online job portals</p>
                  </div>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </div>
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown Text'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
