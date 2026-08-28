import React, { useState, useRef, useEffect } from 'react';
import { StructuredResume, ResumeTemplateId } from '../../types';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Wand2, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Eye, 
  Sparkles,
  Download,
  Printer,
  X
} from 'lucide-react';

interface ResumePreviewPanelProps {
  resume: StructuredResume;
  templateId: ResumeTemplateId;
  atsMode: boolean;
  onAutoFit?: () => void;
  onOpenStylingDrawer?: () => void;
}

export const ResumePreviewPanel: React.FC<ResumePreviewPanelProps> = ({
  resume,
  templateId,
  atsMode,
  onAutoFit,
  onOpenStylingDrawer,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [pageCount, setPageCount] = useState<number>(1);
  const [showPageGuides, setShowPageGuides] = useState<boolean>(true);
  const [paperFormat, setPaperFormat] = useState<'letter' | 'a4'>('letter');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(150, z + 10));
  const handleZoomOut = () => setZoom((z) => Math.max(50, z - 10));
  const handleResetZoom = () => setZoom(100);

  // Standard A4 / US Letter height estimate at 96 DPI is ~1056px
  const PAGE_HEIGHT_PX = paperFormat === 'a4' ? 1122 : 1056;

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      const count = Math.ceil(height / PAGE_HEIGHT_PX);
      setPageCount(Math.max(1, count));
    }
  }, [resume, templateId, atsMode, paperFormat]);

  return (
    <div className="flex flex-col h-full bg-slate-100/90 rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs relative">
      {/* Preview Header / Controls (Resume.io style live viewer bar) */}
      <div className="px-4 sm:px-5 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2 text-xs z-10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm tracking-tight">
            <Eye className="w-4 h-4 text-indigo-600" />
            Live Paper Preview
          </span>

          {atsMode && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              ATS Mode
            </span>
          )}

          {/* Page count pill with status */}
          <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-2xs ${
            pageCount === 1
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {pageCount === 1 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1 Page (Optimal ATS)
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {pageCount} Pages
              </>
            )}
          </span>
        </div>

        {/* Right side controls: Format, Auto-Fit, Zoom, Fullscreen */}
        <div className="flex items-center gap-2 text-slate-600 flex-wrap">
          {/* Paper Format Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setPaperFormat('letter')}
              className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                paperFormat === 'letter' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              US Letter
            </button>
            <button
              type="button"
              onClick={() => setPaperFormat('a4')}
              className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                paperFormat === 'a4' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              A4
            </button>
          </div>

          {pageCount > 1 && onAutoFit && (
            <button
              onClick={onAutoFit}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-[11px] flex items-center gap-1 border border-indigo-200 shadow-2xs transition active:scale-95 cursor-pointer"
              title="Adjust density to fit on 1 page"
            >
              <Wand2 className="w-3 h-3" /> Fit 1 Page
            </button>
          )}

          {/* Zoom Controller */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 rounded-lg hover:bg-white transition cursor-pointer text-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] font-bold min-w-[36px] text-center text-slate-700">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 rounded-lg hover:bg-white transition cursor-pointer text-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 rounded-lg hover:bg-white transition cursor-pointer text-slate-400 hover:text-slate-700"
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Fullscreen Preview Trigger */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
            title="Open Fullscreen Document Preview"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview Canvas Container (Resume.io textured workspace) */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-200/70 bg-grid-slate custom-scrollbar relative">
        <div
          id="resume-printable-document"
          ref={contentRef}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            width: '100%',
            maxWidth: paperFormat === 'a4' ? '794px' : '816px',
            minHeight: `${PAGE_HEIGHT_PX}px`,
            position: 'relative',
          }}
          className="bg-white rounded-2xl resume-paper-canvas print:shadow-none print:border-none print:m-0 print:p-0 print:transform-none"
        >
          {/* Visual Page Break Guide Line (No print) */}
          {showPageGuides && (
            <div
              className="no-print absolute left-0 right-0 border-b-2 border-dashed border-indigo-400/60 z-20 pointer-events-none flex items-center justify-end pr-4 text-[10px] font-extrabold text-indigo-700 tracking-wider uppercase bg-indigo-50/50 py-0.5 rounded-b-md"
              style={{ top: `${PAGE_HEIGHT_PX}px` }}
            >
              <span>✂ Page 1 Boundary</span>
            </div>
          )}

          <TemplateRenderer
            templateId={templateId}
            resume={resume}
            atsMode={atsMode}
          />
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-5xl flex items-center justify-between py-2 text-white mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-base sm:text-lg">Full Screen Document Preview</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Close fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={modalContentRef}
            style={{
              width: '100%',
              maxWidth: paperFormat === 'a4' ? '794px' : '816px',
              minHeight: `${PAGE_HEIGHT_PX}px`,
            }}
            className="bg-white rounded-2xl resume-paper-fullscreen my-auto overflow-hidden"
          >
            <TemplateRenderer
              templateId={templateId}
              resume={resume}
              atsMode={atsMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};
