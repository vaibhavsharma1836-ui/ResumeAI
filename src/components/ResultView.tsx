import { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Edit3, 
  Printer, 
  FileText, 
  Code, 
  Type as TypeIcon,
  Sparkles,
  Share2
} from 'lucide-react';
import { OptimizationResult, ViewMode, ResumeFont } from '../types';
import { OptimizationSummarySection } from './OptimizationSummarySection';

interface ResultViewProps {
  result: OptimizationResult;
  onStartOver: () => void;
  onEditInputs: () => void;
  onOpenStudio?: () => void;
  onViewComparison?: () => void;
  onViewJobMatch?: () => void;
}

export function ResultView({ 
  result, 
  onStartOver, 
  onEditInputs, 
  onOpenStudio,
  onViewComparison,
  onViewJobMatch
}: ResultViewProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('rendered');
  const [fontChoice, setFontChoice] = useState<ResumeFont>('sans');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.optimizedResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([result.optimizedResume], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'Optimized_Resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadMd = () => {
    const element = document.createElement('a');
    const file = new Blob([result.optimizedResume], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'Optimized_Resume.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Action Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Your Optimized Resume is Ready!
            </h2>
            <p className="text-xs text-slate-500">
              ATS-aligned, impact-driven, and 100% grounded in your real background.
            </p>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Compare Before vs After */}
          {onViewComparison && (
            <button
              type="button"
              onClick={onViewComparison}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/80 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Before / After Diff</span>
            </button>
          )}

          {/* View Job Match Engine Analysis */}
          {onViewJobMatch && (
            <button
              type="button"
              onClick={onViewJobMatch}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Job Match Fit</span>
            </button>
          )}

          {/* Open in Resume Studio (Primary highlight) */}
          {onOpenStudio && (
            <button
              type="button"
              onClick={onOpenStudio}
              id="open-resume-studio-btn"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Open in Resume Studio →</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            id="copy-resume-button"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Resume'}</span>
          </button>

          {/* Download as TXT */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            id="download-txt-button"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download .txt</span>
          </button>

          {/* Download as Markdown */}
          <button
            type="button"
            onClick={handleDownloadMd}
            id="download-md-button"
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>.md</span>
          </button>

          {/* Print / Save PDF */}
          <button
            type="button"
            onClick={handlePrint}
            id="print-resume-button"
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Edit Inputs */}
          <button
            type="button"
            onClick={onEditInputs}
            className="px-3 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Inputs</span>
          </button>

          {/* Start Over Button */}
          <button
            type="button"
            onClick={onStartOver}
            id="start-over-button"
            className="px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        </div>
      </div>

      {/* Optimization Summary Collapsible Section */}
      <OptimizationSummarySection summary={result.summary} />

      {/* Resume Document Viewer Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden resume-paper">
        {/* Document Subheader / View Mode Switcher */}
        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Preview Mode:
            </span>
            <div className="inline-flex p-0.5 rounded-lg bg-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('rendered')}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'rendered'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Document View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'raw'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw Markdown</span>
              </button>
            </div>
          </div>

          {viewMode === 'rendered' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <TypeIcon className="w-3.5 h-3.5" /> Font:
              </span>
              <div className="inline-flex p-0.5 rounded-lg bg-slate-200/80 text-xs">
                <button
                  type="button"
                  onClick={() => setFontChoice('sans')}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    fontChoice === 'sans'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Modern Sans
                </button>
                <button
                  type="button"
                  onClick={() => setFontChoice('serif')}
                  className={`px-2.5 py-1 rounded-md font-serif-resume font-medium transition cursor-pointer ${
                    fontChoice === 'serif'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Classic Serif
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-12 max-w-4xl mx-auto">
          {viewMode === 'rendered' ? (
            <div
              className={`prose prose-slate max-w-none ${
                fontChoice === 'serif' ? 'font-serif-resume' : 'font-sans'
              }`}
            >
              {/* Customized styled Markdown */}
              <Markdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight border-b-2 border-slate-900 pb-2 mb-3 mt-0 text-center">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mt-6 mb-3 flex items-center gap-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 mt-4 mb-1">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-2.5">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 my-2">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed pl-1 text-slate-700">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-slate-900">{children}</strong>
                  ),
                  hr: () => <hr className="border-slate-200 my-4" />,
                }}
              >
                {result.optimizedResume}
              </Markdown>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Raw Markdown format</span>
                <span>{result.optimizedResume.length} characters</span>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
                {result.optimizedResume}
              </pre>
            </div>
          )}
        </div>

        {/* Document Footer Action Strip */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3 no-print">
          <span className="text-xs text-slate-500">
            Resume content contains exclusively the candidate resume in ATS Markdown.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3 h-3 text-slate-500" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
