import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TruthGuaranteeBanner } from './components/TruthGuaranteeBanner';
import { ResumeInputForm } from './components/ResumeInputForm';
import { LoadingProgress } from './components/LoadingProgress';
import { ResultView } from './components/ResultView';
import { ResumeStudio } from './components/studio/ResumeStudio';
import { JobMatchDashboard } from './components/match/JobMatchDashboard';
import { BeforeAfterComparison } from './components/match/BeforeAfterComparison';
import { OptimizationResult, StructuredResume, JobMatchAnalysisResult } from './types';
import { parseMarkdownToStructuredResume, getDefaultStructuredResume } from './utils/resumeParser';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'optimizer' | 'studio'>('optimizer');
  const [screenMode, setScreenMode] = useState<'input' | 'match-dashboard' | 'result' | 'comparison'>('input');
  
  const [resumeText, setResumeText] = useState(() => {
    try {
      return localStorage.getItem('resume_input_text') || '';
    } catch {
      return '';
    }
  });
  const [jobDescription, setJobDescription] = useState(() => {
    try {
      return localStorage.getItem('resume_input_jd') || '';
    } catch {
      return '';
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzingMatch, setIsAnalyzingMatch] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchAnalysisResult | null>(() => {
    try {
      const saved = localStorage.getItem('resume_match_analysis');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse stored match analysis', e);
    }
    return null;
  });

  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  
  // Structured Resume state for the Studio
  const [structuredResume, setStructuredResume] = useState<StructuredResume>(() => {
    try {
      const saved = localStorage.getItem('resume_studio_draft');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse stored resume draft', e);
    }
    return getDefaultStructuredResume();
  });

  // Save inputs & match results to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('resume_input_text', resumeText);
    } catch (e) {
      // ignore
    }
  }, [resumeText]);

  useEffect(() => {
    try {
      localStorage.setItem('resume_input_jd', jobDescription);
    } catch (e) {
      // ignore
    }
  }, [jobDescription]);

  useEffect(() => {
    if (jobMatchResult) {
      try {
        localStorage.setItem('resume_match_analysis', JSON.stringify(jobMatchResult));
      } catch (e) {
        // ignore
      }
    }
  }, [jobMatchResult]);

  // Pre-Optimization Job Match Engine Analysis
  const handleAnalyzeMatch = async () => {
    setValidationError(null);
    setApiError(null);

    const trimmedResume = resumeText.trim();
    const trimmedJD = jobDescription.trim();

    if (!trimmedResume && !trimmedJD) {
      setValidationError('Please provide both your resume and the target job description to analyze match fit.');
      return;
    }

    if (!trimmedResume) {
      setValidationError('Please paste your resume text or upload a resume file.');
      return;
    }

    if (!trimmedJD) {
      setValidationError('Please paste the target job description to compare your qualifications against.');
      return;
    }

    if (trimmedResume.length < 25) {
      setValidationError('Your resume appears too short. Please provide a more complete resume.');
      return;
    }

    if (trimmedJD.length < 20) {
      setValidationError('The target job description is too short. Please provide the key role responsibilities or full posting.');
      return;
    }

    setIsAnalyzingMatch(true);

    try {
      const response = await fetch('/api/match-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: trimmedResume,
          jobDescription: trimmedJD,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze job match. Please try again.');
      }

      setJobMatchResult(data.data);
      setScreenMode('match-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Match analysis error:', err);
      setApiError(err?.message || 'An unexpected error occurred during job match analysis. Please try again.');
    } finally {
      setIsAnalyzingMatch(false);
    }
  };

  // Full Resume Optimization (incorporating pre-analysis context if available)
  const handleOptimize = async () => {
    setValidationError(null);
    setApiError(null);

    const trimmedResume = resumeText.trim();
    const trimmedJD = jobDescription.trim();

    if (!trimmedResume && !trimmedJD) {
      setValidationError('Please provide both your resume and the target job description to begin.');
      return;
    }

    if (!trimmedResume) {
      setValidationError('Please paste your resume text or upload a resume file.');
      return;
    }

    if (!trimmedJD) {
      setValidationError('Please paste the target job description so the AI knows what role to optimize for.');
      return;
    }

    if (trimmedResume.length < 25) {
      setValidationError('Your resume appears too short. Please provide a more complete resume.');
      return;
    }

    if (trimmedJD.length < 20) {
      setValidationError('The target job description is too short. Please provide the key role responsibilities or full job posting.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: trimmedResume,
          jobDescription: trimmedJD,
          matchAnalysis: jobMatchResult,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to optimize resume. Please try again.');
      }

      setOptimizationResult(data.data);

      // Pre-parse the optimized resume into structured format for the Studio
      if (data.data?.optimizedResume) {
        const parsed = parseMarkdownToStructuredResume(data.data.optimizedResume);
        setStructuredResume(parsed);
      }

      // If user ran match analysis earlier, show Before/After comparison first; otherwise standard result view
      if (jobMatchResult) {
        setScreenMode('comparison');
      } else {
        setScreenMode('result');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Optimization error:', err);
      setApiError(err?.message || 'An unexpected error occurred during resume optimization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStudio = () => {
    if (optimizationResult?.optimizedResume) {
      const parsed = parseMarkdownToStructuredResume(optimizationResult.optimizedResume);
      setStructuredResume(parsed);
    } else if (resumeText.trim()) {
      const parsed = parseMarkdownToStructuredResume(resumeText);
      setStructuredResume(parsed);
    }
    setCurrentTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartOver = () => {
    setOptimizationResult(null);
    setJobMatchResult(null);
    setResumeText('');
    setJobDescription('');
    setValidationError(null);
    setApiError(null);
    setScreenMode('input');
    setCurrentTab('optimizer');
    localStorage.removeItem('resume_match_analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditInputs = () => {
    setValidationError(null);
    setApiError(null);
    setScreenMode('input');
    setCurrentTab('optimizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Header 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        matchScore={jobMatchResult?.overallScore}
        documentTitle={structuredResume.contact.fullName ? `${structuredResume.contact.fullName}'s Resume` : 'My Resume'}
      />

      {/* Main Content Area */}
      {currentTab === 'studio' ? (
        <ResumeStudio
          initialResume={structuredResume}
          jobDescription={jobDescription}
          onBackToOptimizer={() => setCurrentTab('optimizer')}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* API Error Notification */}
          {apiError && (
            <div className="mb-6 rounded-3xl bg-rose-50 border border-rose-200 p-4 sm:p-5 flex items-start gap-3.5 text-rose-900 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-rose-900 text-sm sm:text-base">Operation Failed</h3>
                <p className="text-xs sm:text-sm text-rose-700 mt-0.5">{apiError}</p>
                <button
                  type="button"
                  onClick={screenMode === 'match-dashboard' ? handleOptimize : handleAnalyzeMatch}
                  className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Action</span>
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Screen View */}
          {isLoading || isAnalyzingMatch ? (
            <LoadingProgress
              customMessage={
                isAnalyzingMatch
                  ? 'Comparing original resume against target job description and calculating match score...'
                  : 'Synthesizing keyword alignment and optimizing your resume...'
              }
            />
          ) : screenMode === 'match-dashboard' && jobMatchResult ? (
            <JobMatchDashboard
              analysis={jobMatchResult}
              onOptimize={handleOptimize}
              onEditInputs={handleEditInputs}
              onOpenStudio={handleOpenStudio}
              isOptimizing={isLoading}
            />
          ) : screenMode === 'comparison' && optimizationResult ? (
            <BeforeAfterComparison
              originalText={resumeText}
              optimizationResult={optimizationResult}
              initialMatchScore={jobMatchResult?.overallScore || 65}
              onOpenStudio={handleOpenStudio}
              onBackToAnalysis={jobMatchResult ? () => setScreenMode('match-dashboard') : undefined}
              onStartOver={handleStartOver}
              onEditInputs={handleEditInputs}
            />
          ) : screenMode === 'result' && optimizationResult ? (
            <ResultView
              result={optimizationResult}
              onStartOver={handleStartOver}
              onEditInputs={handleEditInputs}
              onOpenStudio={handleOpenStudio}
              onViewComparison={() => setScreenMode('comparison')}
              onViewJobMatch={jobMatchResult ? () => setScreenMode('match-dashboard') : undefined}
            />
          ) : (
            <div className="space-y-7">
              {/* Title / Hero intro */}
              <div className="text-center max-w-3xl mx-auto space-y-3 mb-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-extrabold tracking-wide uppercase shadow-2xs">
                  <span>⚡ ATS Match Engine & Professional Resume Studio</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Craft your resume for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600">job you deserve.</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                  Evaluate ATS compatibility, diagnose skill gaps with the <strong>Job Match Engine</strong>, and reframe your achievements into high-impact bullet points with 100% verified factual integrity.
                </p>
              </div>

              {/* Truthfulness Guarantee */}
              <TruthGuaranteeBanner />

              {/* Resume & Job Description Inputs */}
              <ResumeInputForm
                resumeText={resumeText}
                setResumeText={setResumeText}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                onOptimize={handleOptimize}
                onAnalyzeMatch={handleAnalyzeMatch}
                isLoading={isLoading}
                isAnalyzingMatch={isAnalyzingMatch}
                validationError={validationError}
              />
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500 text-center no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            ResumeAI &copy; {new Date().getFullYear()} &bull; Professional Resume Studio & ATS Job Match Engine
          </span>
          <span className="text-slate-400">
            Engineered with Gemini AI &bull; Strict Factual Fidelity
          </span>
        </div>
      </footer>
    </div>
  );
}
