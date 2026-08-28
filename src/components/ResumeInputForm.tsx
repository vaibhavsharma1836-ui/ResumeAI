import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { 
  FileText, 
  Briefcase, 
  Upload, 
  Sparkles, 
  Trash2, 
  Check, 
  AlertCircle, 
  Lightbulb, 
  Layers,
  FileCheck,
  X,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import mammoth from 'mammoth';
import { SAMPLE_PRESETS } from '../data/samples';

interface ResumeInputFormProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  onOptimize: () => void;
  onAnalyzeMatch?: () => void;
  isLoading: boolean;
  isAnalyzingMatch?: boolean;
  validationError: string | null;
}

export function ResumeInputForm({
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  onOptimize,
  onAnalyzeMatch,
  isLoading,
  isAnalyzingMatch = false,
  validationError,
}: ResumeInputFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [fileReadNotice, setFileReadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resumeWordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const resumeCharCount = resumeText.length;

  const jdWordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const jdCharCount = jobDescription.length;

  const isFormValid = resumeText.trim().length >= 25 && jobDescription.trim().length >= 20;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileReadNotice('File exceeds 10MB limit. Please upload a smaller text or Word file.');
      setTimeout(() => setFileReadNotice(null), 4000);
      return;
    }

    // Handle DOCX
    if (fileName.endsWith('.docx')) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (result.value && result.value.trim().length > 0) {
          setResumeText(result.value.trim());
          setUploadedFile({ name: file.name, size: file.size });
          setFileReadNotice(`Successfully extracted text from Word document "${file.name}"`);
          setTimeout(() => setFileReadNotice(null), 4000);
          return;
        } else {
          setFileReadNotice('No readable text found in Word document. Please paste text directly.');
          setTimeout(() => setFileReadNotice(null), 4000);
          return;
        }
      } catch (err) {
        console.error('Error reading docx:', err);
        setFileReadNotice('Failed to extract Word document text. Please paste text directly.');
        setTimeout(() => setFileReadNotice(null), 4000);
        return;
      }
    }

    // Support text, markdown, rtf
    const validExtensions = ['.txt', '.md', '.text', '.markdown', '.rtf', '.json'];
    const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext)) || file.type.startsWith('text/');

    if (!hasValidExt) {
      setFileReadNotice('Please upload a .txt, .md, or .docx file, or paste your text.');
      setTimeout(() => setFileReadNotice(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setResumeText(content);
        setUploadedFile({ name: file.name, size: file.size });
        setFileReadNotice(`Successfully loaded "${file.name}"`);
        setTimeout(() => setFileReadNotice(null), 4000);
      }
    };
    reader.onerror = () => {
      setFileReadNotice('Failed to read file. Please paste your resume text directly.');
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileReadNotice(null);
  };

  const loadPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setResumeText(preset.resumeText);
      setJobDescription(preset.jobDescription);
      setUploadedFile(null);
      setFileReadNotice(`Loaded sample profile: ${preset.title}`);
      setTimeout(() => setFileReadNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sample Presets Strip (Resume.io style quick starter) */}
      <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span>Quick-Load Sample Job Profiles:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadPreset(preset.id)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 font-semibold text-slate-700 transition shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>{preset.title}</span>
            </button>
          ))}
          
          {(resumeText || jobDescription || uploadedFile) && (
            <button
              type="button"
              onClick={() => {
                setResumeText('');
                setJobDescription('');
                setUploadedFile(null);
              }}
              className="text-xs px-3 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition font-semibold flex items-center gap-1 cursor-pointer"
              title="Clear all fields"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Existing Resume Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden relative group">
          {/* Card Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                  <span>Your Current Resume</span>
                  {resumeText.trim().length >= 25 && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Paste text or upload file (.docx, .txt, .md)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.txt,.md,.text,.markdown,.rtf,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
                id="resume-file-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-indigo-50/50 hover:text-indigo-600 transition cursor-pointer"
                id="upload-resume-file-btn"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>{uploadedFile ? 'Replace File' : 'Upload File'}</span>
              </button>
              {resumeText && (
                <button
                  type="button"
                  onClick={() => {
                    setResumeText('');
                    setUploadedFile(null);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                  title="Clear resume"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Uploaded File Banner (if active) */}
          {uploadedFile && (
            <div className="px-5 py-2.5 bg-indigo-50/80 border-b border-indigo-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-900 font-semibold truncate max-w-[80%]">
                <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">File: <strong>{uploadedFile.name}</strong></span>
                <span className="text-indigo-600 text-[11px]">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-indigo-600 hover:text-rose-600 p-1 rounded-md hover:bg-indigo-100/60 transition cursor-pointer"
                title="Dismiss file info"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Drag and drop notice if active */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-5 flex-1 flex flex-col transition relative ${
              isDragging ? 'bg-indigo-50/60 ring-2 ring-indigo-500 ring-inset' : ''
            }`}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-indigo-50/95 z-20 flex flex-col items-center justify-center pointer-events-none text-indigo-600">
                <Upload className="w-10 h-10 mb-2 animate-bounce" />
                <p className="font-bold text-sm">Drop your resume file here (.docx, .txt, .md)</p>
              </div>
            )}

            <textarea
              id="resume-text-input"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder={`Paste your complete resume here, including:\n• Contact details & summary\n• Work experience with bullet points\n• Skills and technical capabilities\n• Education and certifications\n\nOr click "Upload File" to import a .docx Word document or .txt resume file.`}
              className="w-full h-80 sm:h-96 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 text-slate-800 text-xs sm:text-sm leading-relaxed placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-hidden transition resize-none custom-scrollbar font-mono"
            />
          </div>

          {/* Card Footer Counter */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span>{resumeWordCount} words</span>
              <span>•</span>
              <span>{resumeCharCount} characters</span>
            </div>
            {resumeText.trim().length >= 25 ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Ready for Analysis
              </span>
            ) : (
              <span className="text-slate-400">Min. 25 characters required</span>
            )}
          </div>
        </div>

        {/* Right Column: Target Job Description Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden relative group">
          {/* Card Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                  <span>Target Job Description</span>
                  {jobDescription.trim().length >= 20 && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Job posting requirements, qualifications & duties</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {jobDescription && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                  title="Clear job description"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Text Area */}
          <div className="p-5 flex-1 flex flex-col">
            <textarea
              id="job-description-input"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={`Paste the target job description or requirements here, including:\n• Role title & team overview\n• Core responsibilities and deliverables\n• Required technical skills and experience levels\n• Preferred qualifications and education\n\nThe AI compares your authentic resume background with this job description to calculate match scores and optimize phrasing.`}
              className="w-full h-80 sm:h-96 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 text-slate-800 text-xs sm:text-sm leading-relaxed placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-hidden transition resize-none custom-scrollbar font-sans"
            />
          </div>

          {/* Card Footer Counter */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span>{jdWordCount} words</span>
              <span>•</span>
              <span>{jdCharCount} characters</span>
            </div>
            {jobDescription.trim().length >= 20 ? (
              <span className="text-blue-600 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Job Criteria Loaded
              </span>
            ) : (
              <span className="text-slate-400">Min. 20 characters required</span>
            )}
          </div>
        </div>
      </div>

      {/* Validation or File Notice Banners */}
      {fileReadNotice && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2 shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{fileReadNotice}</span>
        </div>
      )}

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Action Bar (Resume.io style bottom action strip) */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-600 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span className="leading-relaxed">
            <strong>Job Match Engine:</strong> Run a pre-optimization diagnostic or directly optimize your resume with 100% factual fidelity.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Analyze Job Match Button */}
          {onAnalyzeMatch && (
            <button
              type="button"
              onClick={onAnalyzeMatch}
              disabled={isLoading || isAnalyzingMatch || !isFormValid}
              id="analyze-job-match-button"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95 font-extrabold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Target className="w-4 h-4 text-indigo-600" />
              <span>{isAnalyzingMatch ? 'Analyzing Fit...' : 'Analyze Job Match'}</span>
            </button>
          )}

          {/* Optimize Resume Button */}
          <button
            type="button"
            onClick={onOptimize}
            disabled={isLoading || isAnalyzingMatch || !isFormValid}
            id="optimize-resume-button"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{isLoading ? 'Optimizing Resume...' : 'Optimize Resume →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
