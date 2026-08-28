import React, { useState } from 'react';
import { Sparkles, Download, Copy, Check, FileText, RefreshCw, Printer, AlertCircle } from 'lucide-react';
import { StructuredResume, CoverLetterData } from '../../types';

interface CoverLetterStudioProps {
  resume: StructuredResume;
  targetJobDescription: string;
}

export const CoverLetterStudio: React.FC<CoverLetterStudioProps> = ({
  resume,
  targetJobDescription,
}) => {
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>({
    recipientName: 'Hiring Manager',
    recipientTitle: 'Hiring Lead / Talent Acquisition',
    companyName: 'Target Company',
    companyAddress: 'San Francisco, CA',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    salutation: 'Dear Hiring Manager,',
    opening: `I am writing to express my enthusiastic interest in the ${resume.contact.title || 'open role'} position at your organization. With a proven background in delivering high-impact solutions, optimizing performance, and collaborating across multidisciplinary teams, I am confident in my ability to make an immediate, positive contribution to your group.`,
    bodyParagraphs: [
      `Throughout my career, I have focused on solving complex challenges and driving measurable results. At ${resume.experience[0]?.company || 'my recent role'}, I spearheaded initiatives that streamlined core processes and elevated team velocity. My background in ${resume.skills[0]?.items?.slice(0, 4)?.join(', ') || 'modern industry technologies'} has equipped me to quickly adapt, build reliable systems, and solve high-priority technical hurdles.`,
      `What excites me most about this opportunity is the opportunity to bring my experience in architecting scalable solutions and driving cross-functional alignment to your high-performing team. I pride myself on maintaining high standards of quality, continuous learning, and fostering collaborative engineering environments.`
    ],
    closing: `Thank you for your time and consideration. I would welcome the opportunity to discuss how my experience, technical skills, and commitment to excellence align with your team's goals. I look forward to speaking with you.`,
    signature: 'Sincerely,\n' + (resume.contact.fullName || 'Candidate Name')
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const accentColor = resume.accentColor || '#4f46e5';

  const fontClass =
    resume.fontFamily === 'serif' ? 'font-serif-resume' :
    resume.fontFamily === 'outfit' ? 'font-outfit' :
    resume.fontFamily === 'playfair' ? 'font-playfair' :
    resume.fontFamily === 'mono' ? 'font-mono-code' :
    'font-sans';

  const handleGenerateAiCoverLetter = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const experienceHighlights = resume.experience
        .slice(0, 2)
        .map(e => `${e.role} at ${e.company}: ${e.bullets.slice(0, 2).join('; ')}`)
        .join('\n');

      const allSkills = resume.skills.flatMap(s => s.items).slice(0, 12).join(', ');

      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateInfo: resume.contact,
          resumeSummary: resume.summary,
          experienceHighlights,
          skills: allSkills,
          jobDescription: targetJobDescription || 'General requirements for the target role',
          companyName: coverLetter.companyName,
          recipientName: coverLetter.recipientName,
          tone: 'professional, compelling, and impactful'
        })
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate cover letter.');
      }

      const generated = json.data;
      setCoverLetter(prev => ({
        ...prev,
        salutation: generated.salutation || prev.salutation,
        opening: generated.opening || prev.opening,
        bodyParagraphs: generated.bodyParagraphs || prev.bodyParagraphs,
        closing: generated.closing || prev.closing,
        signature: (generated.signature || 'Sincerely,') + '\n' + (resume.contact.fullName || 'Candidate Name')
      }));
    } catch (err: any) {
      setError(err.message || 'Error generating AI cover letter.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    const fullText = `${resume.contact.fullName}
${resume.contact.email} | ${resume.contact.phone} | ${resume.contact.location}

${coverLetter.date}

${coverLetter.recipientName}
${coverLetter.recipientTitle}
${coverLetter.companyName}
${coverLetter.companyAddress}

${coverLetter.salutation}

${coverLetter.opening}

${coverLetter.bodyParagraphs.join('\n\n')}

${coverLetter.closing}

${coverLetter.signature}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const fullText = `${resume.contact.fullName}
${resume.contact.email} | ${resume.contact.phone} | ${resume.contact.location}

${coverLetter.date}

${coverLetter.recipientName}
${coverLetter.recipientTitle}
${coverLetter.companyName}
${coverLetter.companyAddress}

${coverLetter.salutation}

${coverLetter.opening}

${coverLetter.bodyParagraphs.join('\n\n')}

${coverLetter.closing}

${coverLetter.signature}`;

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resume.contact.fullName || 'Candidate').replace(/\s+/g, '_')}_Cover_Letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-100">
      {/* Left Form Editor */}
      <div className="w-full lg:w-1/2 border-r border-slate-200 bg-white overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Cover Letter Builder
            </h2>
            <p className="text-xs text-slate-500">
              Matches your resume's aesthetic and highlights your authentic achievements
            </p>
          </div>
          <button
            onClick={handleGenerateAiCoverLetter}
            disabled={isGenerating}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {isGenerating ? 'Drafting...' : 'AI Generate Letter'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Recipient & Job Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">
            Recipient & Company
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Company Name</label>
              <input
                type="text"
                value={coverLetter.companyName}
                onChange={(e) => setCoverLetter({ ...coverLetter, companyName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Recipient Name / Team</label>
              <input
                type="text"
                value={coverLetter.recipientName}
                onChange={(e) => setCoverLetter({ ...coverLetter, recipientName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Recipient Title</label>
              <input
                type="text"
                value={coverLetter.recipientTitle}
                onChange={(e) => setCoverLetter({ ...coverLetter, recipientTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Date</label>
              <input
                type="text"
                value={coverLetter.date}
                onChange={(e) => setCoverLetter({ ...coverLetter, date: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Letter Content Sections */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">
            Letter Content
          </h3>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Salutation</label>
            <input
              type="text"
              value={coverLetter.salutation}
              onChange={(e) => setCoverLetter({ ...coverLetter, salutation: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Opening Hook</label>
            <textarea
              rows={3}
              value={coverLetter.opening}
              onChange={(e) => setCoverLetter({ ...coverLetter, opening: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          {coverLetter.bodyParagraphs.map((para, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600">Body Paragraph {idx + 1}</label>
                {coverLetter.bodyParagraphs.length > 1 && (
                  <button
                    onClick={() => {
                      const updated = coverLetter.bodyParagraphs.filter((_, i) => i !== idx);
                      setCoverLetter({ ...coverLetter, bodyParagraphs: updated });
                    }}
                    className="text-[10px] text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={para}
                onChange={(e) => {
                  const updated = [...coverLetter.bodyParagraphs];
                  updated[idx] = e.target.value;
                  setCoverLetter({ ...coverLetter, bodyParagraphs: updated });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>
          ))}

          <button
            onClick={() => {
              setCoverLetter({
                ...coverLetter,
                bodyParagraphs: [...coverLetter.bodyParagraphs, '']
              });
            }}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            + Add Body Paragraph
          </button>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Call to Action / Closing</label>
            <textarea
              rows={3}
              value={coverLetter.closing}
              onChange={(e) => setCoverLetter({ ...coverLetter, closing: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Sign-off & Name</label>
            <textarea
              rows={2}
              value={coverLetter.signature}
              onChange={(e) => setCoverLetter({ ...coverLetter, signature: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Right Live Preview */}
      <div className="w-full lg:w-1/2 bg-slate-200/60 overflow-y-auto p-6 flex flex-col items-center">
        {/* Actions Bar */}
        <div className="w-full max-w-[800px] flex items-center justify-between mb-4 no-print">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Matching Live Preview
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" /> TXT
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div
          className={`w-full max-w-[800px] bg-white rounded-xl shadow-lg border border-slate-200 p-10 sm:p-14 text-slate-900 leading-relaxed text-[13px] ${fontClass} resume-paper`}
        >
          {/* Header */}
          <div className="border-b pb-6 mb-8" style={{ borderColor: `${accentColor}30` }}>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1" style={{ color: accentColor }}>
              {resume.contact.fullName || 'Candidate Name'}
            </h1>
            {resume.contact.title && (
              <p className="text-sm font-medium text-slate-600 mb-2">{resume.contact.title}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              {resume.contact.email && <span>{resume.contact.email}</span>}
              {resume.contact.phone && (
                <>
                  <span>•</span>
                  <span>{resume.contact.phone}</span>
                </>
              )}
              {resume.contact.location && (
                <>
                  <span>•</span>
                  <span>{resume.contact.location}</span>
                </>
              )}
            </div>
          </div>

          {/* Date & Recipient Details */}
          <div className="mb-8 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900 mb-4">{coverLetter.date}</p>
            <p className="font-bold text-slate-900">{coverLetter.recipientName}</p>
            {coverLetter.recipientTitle && <p>{coverLetter.recipientTitle}</p>}
            {coverLetter.companyName && <p className="font-semibold">{coverLetter.companyName}</p>}
            {coverLetter.companyAddress && <p className="text-slate-500">{coverLetter.companyAddress}</p>}
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-slate-800 text-[13.5px] leading-relaxed">
            <p className="font-semibold text-slate-900">{coverLetter.salutation}</p>

            <p className="text-justify">{coverLetter.opening}</p>

            {coverLetter.bodyParagraphs.map((para, i) => (
              <p key={i} className="text-justify">
                {para}
              </p>
            ))}

            <p className="text-justify">{coverLetter.closing}</p>

            <div className="pt-6 whitespace-pre-line font-medium text-slate-900">
              {coverLetter.signature}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
