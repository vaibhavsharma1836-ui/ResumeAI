import React from 'react';
import { StructuredResume, ResumeTemplateId, ResumeFont, SpacingDensity, HeaderStyle } from '../../../types';

interface TemplateProps {
  resume: StructuredResume;
  atsMode?: boolean;
}

const getFontClass = (font?: ResumeFont) => {
  switch (font) {
    case 'serif':
      return 'font-serif-resume';
    case 'mono':
      return 'font-mono-code';
    case 'outfit':
      return 'font-outfit';
    case 'playfair':
      return 'font-playfair';
    default:
      return 'font-sans';
  }
};

const getDensity = (density?: SpacingDensity) => {
  switch (density) {
    case 'compact':
      return {
        padding: 'p-6 sm:p-8',
        space: 'space-y-3.5',
        sectionMargin: 'mb-3',
        itemSpace: 'space-y-2',
        textSize: 'text-[12px]',
        leading: 'leading-snug',
        bulletSpace: 'space-y-1',
      };
    case 'spacious':
      return {
        padding: 'p-10 sm:p-14',
        space: 'space-y-6',
        sectionMargin: 'mb-5',
        itemSpace: 'space-y-4',
        textSize: 'text-[13.5px]',
        leading: 'leading-loose',
        bulletSpace: 'space-y-2',
      };
    default:
      return {
        padding: 'p-8 sm:p-12',
        space: 'space-y-4.5',
        sectionMargin: 'mb-4',
        itemSpace: 'space-y-3',
        textSize: 'text-[13px]',
        leading: 'leading-relaxed',
        bulletSpace: 'space-y-1.5',
      };
  }
};

export const SectionHeading: React.FC<{
  title: string;
  accentColor?: string;
  headerStyle?: HeaderStyle;
  className?: string;
}> = ({ title, accentColor = '#4f46e5', headerStyle = 'underline', className = '' }) => {
  if (headerStyle === 'pill') {
    return (
      <div className={`mb-2.5 flex items-center ${className}`}>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-2xs"
          style={{ backgroundColor: accentColor }}
        >
          {title}
        </span>
        <div className="flex-1 h-px ml-3" style={{ backgroundColor: `${accentColor}30` }} />
      </div>
    );
  }

  if (headerStyle === 'accent-bar') {
    return (
      <div className={`mb-2.5 flex items-center gap-2.5 ${className}`}>
        <div className="w-1.5 h-4 rounded-xs" style={{ backgroundColor: accentColor }} />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {title}
        </h2>
        <div className="flex-1 h-px" style={{ backgroundColor: `${accentColor}25` }} />
      </div>
    );
  }

  if (headerStyle === 'shaded') {
    return (
      <div
        className={`mb-2.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-between ${className}`}
        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
      >
        <span>{title}</span>
      </div>
    );
  }

  if (headerStyle === 'minimal') {
    return (
      <div className={`mb-2 flex items-center gap-2 ${className}`}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {title}
        </h2>
      </div>
    );
  }

  // Default: 'underline'
  return (
    <h2
      className={`text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2.5 flex items-center justify-between ${className}`}
      style={{ borderColor: `${accentColor}40` }}
    >
      <span>{title}</span>
      <span className="w-8 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} />
    </h2>
  );
};

// 1. ATS CLASSIC TEMPLATE
export const ATSClassicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const fontClass = getFontClass(resume.fontFamily);
  const density = getDensity(resume.spacingDensity);
  const accent = resume.accentColor || '#1e293b';

  return (
    <div className={`w-full bg-white text-slate-900 ${fontClass} ${density.padding} ${density.leading} ${density.textSize} shadow-sm`}>
      {/* Header */}
      <header className="border-b pb-4 mb-5 text-center" style={{ borderColor: `${accent}35` }}>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase mb-1" style={{ color: accent }}>
          {resume.contact.fullName || 'Candidate Name'}
        </h1>
        {resume.contact.title && (
          <p className="text-sm font-semibold text-slate-700 mb-2">{resume.contact.title}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600">
          {resume.contact.location && <span>{resume.contact.location}</span>}
          {resume.contact.phone && (
            <>
              <span>•</span>
              <span>{resume.contact.phone}</span>
            </>
          )}
          {resume.contact.email && (
            <>
              <span>•</span>
              <span>{resume.contact.email}</span>
            </>
          )}
          {resume.contact.linkedin && (
            <>
              <span>•</span>
              <span>{resume.contact.linkedin}</span>
            </>
          )}
          {resume.contact.github && (
            <>
              <span>•</span>
              <span>{resume.contact.github}</span>
            </>
          )}
          {resume.contact.website && (
            <>
              <span>•</span>
              <span>{resume.contact.website}</span>
            </>
          )}
        </div>
      </header>

      {/* Sections based on sectionOrder */}
      <div className={density.space}>
        {resume.sectionOrder.map((sectionKey) => {
          if (sectionKey === 'summary' && resume.summary) {
            return (
              <section key="summary" className={density.sectionMargin}>
                <SectionHeading title="Professional Summary" accentColor={accent} headerStyle={resume.headerStyle} />
                <p className="text-slate-800 leading-relaxed text-justify">
                  {resume.summary}
                </p>
              </section>
            );
          }

          if (sectionKey === 'experience' && resume.experience.length > 0) {
            return (
              <section key="experience" className={density.sectionMargin}>
                <SectionHeading title="Work Experience" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className={density.itemSpace}>
                  {resume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-bold text-slate-950 text-sm">
                          {exp.role} <span className="font-normal text-slate-600">— {exp.company}</span>
                        </span>
                        <span className="text-xs font-medium text-slate-600 shrink-0">
                          {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                          {exp.location ? ` | ${exp.location}` : ''}
                        </span>
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className={`mt-2 ${density.bulletSpace} list-disc list-outside ml-4 text-slate-800`}>
                          {exp.bullets.map((bullet, idx) => (
                            <li key={idx} className="leading-snug">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'skills' && resume.skills.length > 0) {
            return (
              <section key="skills" className={density.sectionMargin}>
                <SectionHeading title="Technical & Professional Skills" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-1.5">
                  {resume.skills.map((skillCat) => (
                    <div key={skillCat.id} className="flex flex-wrap gap-1">
                      <span className="font-bold text-slate-950 min-w-[150px]">
                        {skillCat.category}:
                      </span>
                      <span className="text-slate-800">{skillCat.items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'projects' && resume.projects.length > 0) {
            return (
              <section key="projects" className={density.sectionMargin}>
                <SectionHeading title="Key Projects" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className={density.itemSpace}>
                  {resume.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-bold text-slate-950">
                          {proj.name} {proj.role ? `(${proj.role})` : ''}
                        </span>
                        {proj.link && <span className="text-xs text-slate-600">{proj.link}</span>}
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <p className="text-xs text-slate-600 italic mt-0.5">
                          Technologies: {proj.technologies.join(', ')}
                        </p>
                      )}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className={`mt-1.5 ${density.bulletSpace} list-disc list-outside ml-4 text-slate-800`}>
                          {proj.bullets.map((bullet, idx) => (
                            <li key={idx} className="leading-snug">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'education' && resume.education.length > 0) {
            return (
              <section key="education" className={density.sectionMargin}>
                <SectionHeading title="Education" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-2">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-950">
                          {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                        </span>
                        <span className="text-slate-700">, {edu.institution}</span>
                        {edu.gpa && <span className="text-xs text-slate-600"> (GPA: {edu.gpa})</span>}
                        {edu.highlights && <p className="text-xs text-slate-600">{edu.highlights}</p>}
                      </div>
                      <span className="text-xs text-slate-600">
                        {[edu.startDate, edu.endDate].filter(Boolean).join(' – ')}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'certifications' && resume.certifications.length > 0) {
            return (
              <section key="certifications" className={density.sectionMargin}>
                <SectionHeading title="Certifications" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-1">
                  {resume.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between text-slate-800">
                      <span className="font-semibold">{cert.name} — {cert.issuer}</span>
                      <span className="text-xs text-slate-600">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'custom' && resume.customSections.length > 0) {
            return (
              <div key="custom" className={density.space}>
                {resume.customSections.map((custom) => (
                  <section key={custom.id} className={density.sectionMargin}>
                    <SectionHeading title={custom.title} accentColor={accent} headerStyle={resume.headerStyle} />
                    <ul className={`list-disc list-outside ml-4 ${density.bulletSpace} text-slate-800`}>
                      {custom.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

// 2. MODERN TEMPLATE
export const ModernTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const fontClass = getFontClass(resume.fontFamily);
  const density = getDensity(resume.spacingDensity);
  const accent = resume.accentColor || '#4f46e5';

  return (
    <div className={`w-full bg-white text-slate-800 ${fontClass} ${density.padding} ${density.leading} ${density.textSize} shadow-sm`}>
      {/* Header with accent left border */}
      <header className="border-l-4 pl-4 mb-6" style={{ borderColor: accent }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {resume.contact.fullName || 'Candidate Name'}
        </h1>
        {resume.contact.title && (
          <p className="text-sm font-semibold mt-0.5" style={{ color: accent }}>
            {resume.contact.title}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 font-medium">
          {resume.contact.location && <span>📍 {resume.contact.location}</span>}
          {resume.contact.phone && <span>📞 {resume.contact.phone}</span>}
          {resume.contact.email && <span>✉️ {resume.contact.email}</span>}
          {resume.contact.linkedin && <span>🔗 {resume.contact.linkedin}</span>}
          {resume.contact.github && <span>💻 {resume.contact.github}</span>}
        </div>
      </header>

      {/* Sections */}
      <div className={density.space}>
        {resume.sectionOrder.map((sectionKey) => {
          if (sectionKey === 'summary' && resume.summary) {
            return (
              <section key="summary" className={density.sectionMargin}>
                <SectionHeading title="Professional Summary" accentColor={accent} headerStyle={resume.headerStyle} />
                <p className="text-slate-700 leading-relaxed pl-3 border-l" style={{ borderColor: `${accent}30` }}>
                  {resume.summary}
                </p>
              </section>
            );
          }

          if (sectionKey === 'experience' && resume.experience.length > 0) {
            return (
              <section key="experience" className={density.sectionMargin}>
                <SectionHeading title="Experience" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className={`${density.itemSpace} pl-3 border-l`} style={{ borderColor: `${accent}30` }}>
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="relative">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                          <span className="text-slate-600 font-medium"> · {exp.company}</span>
                        </div>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${accent}15`, color: accent }}
                        >
                          {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                        </span>
                      </div>
                      {exp.location && <p className="text-xs text-slate-500">{exp.location}</p>}
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className={`mt-2 ${density.bulletSpace} list-disc ml-4 text-slate-700`}>
                          {exp.bullets.map((bullet, idx) => (
                            <li key={idx} className="leading-snug">{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'skills' && resume.skills.length > 0) {
            return (
              <section key="skills" className={density.sectionMargin}>
                <SectionHeading title="Skills & Tech Stack" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-2 pl-3 border-l" style={{ borderColor: `${accent}30` }}>
                  {resume.skills.map((skillCat) => (
                    <div key={skillCat.id} className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs w-36 shrink-0">
                        {skillCat.category}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {skillCat.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-800 border border-slate-200/80 font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'projects' && resume.projects.length > 0) {
            return (
              <section key="projects" className={density.sectionMargin}>
                <SectionHeading title="Projects" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className={`${density.itemSpace} pl-3 border-l`} style={{ borderColor: `${accent}30` }}>
                  {resume.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{proj.name}</span>
                        {proj.link && <span className="text-xs font-mono" style={{ color: accent }}>{proj.link}</span>}
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <p className="text-xs text-slate-500 italic mt-0.5">
                          Technologies: {proj.technologies.join(', ')}
                        </p>
                      )}
                      {proj.bullets && (
                        <ul className={`mt-1.5 ${density.bulletSpace} list-disc ml-4 text-slate-700`}>
                          {proj.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'education' && resume.education.length > 0) {
            return (
              <section key="education" className={density.sectionMargin}>
                <SectionHeading title="Education" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-2 pl-3 border-l" style={{ borderColor: `${accent}30` }}>
                  {resume.education.map((e) => (
                    <div key={e.id} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-slate-900">{[e.degree, e.field].filter(Boolean).join(' in ')}</span>
                        <span className="text-slate-600"> — {e.institution}</span>
                        {e.gpa && <span className="text-xs text-slate-500"> (GPA: {e.gpa})</span>}
                      </div>
                      <span className="text-xs text-slate-500">{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'certifications' && resume.certifications.length > 0) {
            return (
              <section key="certifications" className={density.sectionMargin}>
                <SectionHeading title="Certifications" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-1.5 pl-3 border-l" style={{ borderColor: `${accent}30` }}>
                  {resume.certifications.map((c) => (
                    <div key={c.id} className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-900">{c.name} — {c.issuer}</span>
                      <span className="text-slate-500">{c.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

// 3. MINIMAL TEMPLATE
export const MinimalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const fontClass = getFontClass(resume.fontFamily);
  const density = getDensity(resume.spacingDensity);
  const accent = resume.accentColor || '#0f172a';

  return (
    <div className={`w-full bg-white text-slate-800 ${fontClass} ${density.padding} ${density.leading} ${density.textSize} shadow-sm`}>
      {/* Centered Minimal Header */}
      <header className="text-center pb-6 mb-6 border-b border-slate-100">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-slate-950 uppercase">
          {resume.contact.fullName || 'Candidate Name'}
        </h1>
        {resume.contact.title && (
          <p className="text-xs tracking-widest uppercase font-medium mt-1 text-slate-500">{resume.contact.title}</p>
        )}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400 mt-3">
          {resume.contact.location && <span>{resume.contact.location}</span>}
          {resume.contact.phone && <span>{resume.contact.phone}</span>}
          {resume.contact.email && <span>{resume.contact.email}</span>}
          {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
        </div>
      </header>

      {/* Sections */}
      <div className={density.space}>
        {resume.sectionOrder.map((sectionKey) => {
          if (sectionKey === 'summary' && resume.summary) {
            return (
              <section key="summary" className={density.sectionMargin}>
                <SectionHeading title="Profile" accentColor={accent} headerStyle={resume.headerStyle} />
                <p className="text-slate-600 leading-relaxed text-justify">{resume.summary}</p>
              </section>
            );
          }

          if (sectionKey === 'experience' && resume.experience.length > 0) {
            return (
              <section key="experience" className={density.sectionMargin}>
                <SectionHeading title="Experience" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className={density.itemSpace}>
                  {resume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-slate-900">{exp.role}</span>
                        <span className="text-xs text-slate-400">
                          {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' — ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{exp.company} {exp.location ? `· ${exp.location}` : ''}</p>
                      {exp.bullets && (
                        <ul className={`mt-1 ${density.bulletSpace} list-disc ml-4 text-slate-600`}>
                          {exp.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'skills' && resume.skills.length > 0) {
            return (
              <section key="skills" className={density.sectionMargin}>
                <SectionHeading title="Expertise" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-1 text-slate-600">
                  {resume.skills.map((s) => (
                    <div key={s.id} className="flex gap-2">
                      <span className="font-semibold text-slate-800 text-xs min-w-[120px]">{s.category}:</span>
                      <span>{s.items.join(' · ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'education' && resume.education.length > 0) {
            return (
              <section key="education" className={density.sectionMargin}>
                <SectionHeading title="Education" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-1.5">
                  {resume.education.map((e) => (
                    <div key={e.id} className="flex justify-between">
                      <span className="font-medium text-slate-900">{[e.degree, e.field].filter(Boolean).join(' in ')}, {e.institution}</span>
                      <span className="text-xs text-slate-400">{[e.startDate, e.endDate].filter(Boolean).join(' — ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

// 4. EXECUTIVE TEMPLATE
export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const fontClass = getFontClass(resume.fontFamily || 'serif');
  const density = getDensity(resume.spacingDensity);
  const accent = resume.accentColor || '#1e3a8a';

  return (
    <div className={`w-full bg-white text-slate-900 ${fontClass} ${density.padding} ${density.leading} ${density.textSize} shadow-sm`}>
      {/* Executive Header Banner */}
      <header className="border-b-2 pb-5 mb-6" style={{ borderColor: accent }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: accent }}>
              {resume.contact.fullName || 'Candidate Name'}
            </h1>
            {resume.contact.title && (
              <p className="text-sm font-semibold tracking-wide uppercase text-slate-600 mt-0.5">
                {resume.contact.title}
              </p>
            )}
          </div>
          <div className="text-xs text-slate-600 sm:text-right space-y-0.5">
            {resume.contact.email && <div>{resume.contact.email}</div>}
            {resume.contact.phone && <div>{resume.contact.phone}</div>}
            {resume.contact.location && <div>{resume.contact.location}</div>}
          </div>
        </div>
      </header>

      {/* Sections */}
      <div className={density.space}>
        {resume.sectionOrder.map((sectionKey) => {
          if (sectionKey === 'summary' && resume.summary) {
            return (
              <section key="summary" className={density.sectionMargin}>
                <SectionHeading title="Executive Profile" accentColor={accent} headerStyle={resume.headerStyle} />
                <p className="text-slate-800 leading-relaxed text-justify font-normal">
                  {resume.summary}
                </p>
              </section>
            );
          }

          if (sectionKey === 'experience' && resume.experience.length > 0) {
            return (
              <section key="experience" className={density.sectionMargin}>
                <SectionHeading title="Professional Experience" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className={density.itemSpace}>
                  {resume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-950 text-sm">{exp.role}</span>
                        <span className="text-xs font-semibold" style={{ color: accent }}>
                          {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-700 italic mb-1.5">
                        {exp.company}{exp.location ? `, ${exp.location}` : ''}
                      </div>
                      {exp.bullets && (
                        <ul className={`mt-1.5 ${density.bulletSpace} list-disc ml-4 text-slate-800`}>
                          {exp.bullets.map((b, i) => (
                            <li key={i} className="leading-snug">{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'skills' && resume.skills.length > 0) {
            return (
              <section key="skills" className={density.sectionMargin}>
                <SectionHeading title="Core Competencies" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                  {resume.skills.map((s) => (
                    <div key={s.id} className="text-xs">
                      <span className="font-bold text-slate-900">{s.category}: </span>
                      <span>{s.items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'education' && resume.education.length > 0) {
            return (
              <section key="education" className={density.sectionMargin}>
                <SectionHeading title="Academic Background" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-2">
                  {resume.education.map((e) => (
                    <div key={e.id} className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="font-bold text-slate-950">{[e.degree, e.field].filter(Boolean).join(' in ')}</span>
                        <span className="text-slate-700"> — {e.institution}</span>
                      </div>
                      <span className="text-slate-600">{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

// 5. TECH TEMPLATE
export const TechTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const fontClass = getFontClass(resume.fontFamily || 'mono');
  const density = getDensity(resume.spacingDensity);
  const accent = resume.accentColor || '#059669';

  return (
    <div className={`w-full bg-white text-slate-800 ${fontClass} ${density.padding} ${density.leading} ${density.textSize} shadow-sm`}>
      {/* Tech Monospace Header */}
      <header className="border-b border-slate-200 pb-5 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              {resume.contact.fullName || 'Candidate Name'}
            </h1>
            <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>
              {resume.contact.title ? `// ${resume.contact.title}` : '// Software Professional'}
            </p>
          </div>
          <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1 font-mono">
            {resume.contact.email && <span>{resume.contact.email}</span>}
            {resume.contact.github && <span>{resume.contact.github}</span>}
            {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
          </div>
        </div>
      </header>

      {/* Sections */}
      <div className={density.space}>
        {resume.sectionOrder.map((sectionKey) => {
          if (sectionKey === 'summary' && resume.summary) {
            return (
              <section key="summary" className={density.sectionMargin}>
                <SectionHeading title="README.md / Summary" accentColor={accent} headerStyle={resume.headerStyle} />
                <p className="text-slate-700 leading-relaxed">{resume.summary}</p>
              </section>
            );
          }

          if (sectionKey === 'skills' && resume.skills.length > 0) {
            return (
              <section key="skills" className={density.sectionMargin}>
                <SectionHeading title="Stack & Technologies" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-1.5">
                  {resume.skills.map((cat) => (
                    <div key={cat.id} className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-bold text-slate-900 w-32 shrink-0">{cat.category}:</span>
                      <div className="flex flex-wrap gap-1">
                        {cat.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-mono border"
                            style={{ backgroundColor: `${accent}10`, borderColor: `${accent}30`, color: accent }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'experience' && resume.experience.length > 0) {
            return (
              <section key="experience" className={density.sectionMargin}>
                <SectionHeading title="Experience / Log" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className={density.itemSpace}>
                  {resume.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{exp.role} @ {exp.company}</span>
                        <span className="text-xs font-mono text-slate-500">
                          {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' - ')}
                        </span>
                      </div>
                      {exp.bullets && (
                        <ul className={`mt-2 ${density.bulletSpace} list-disc ml-4 text-slate-700`}>
                          {exp.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'projects' && resume.projects.length > 0) {
            return (
              <section key="projects" className={density.sectionMargin}>
                <SectionHeading title="Projects & Repos" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className={density.itemSpace}>
                  {resume.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">{proj.name}</span>
                        {proj.link && <span className="text-xs text-slate-500 font-mono">{proj.link}</span>}
                      </div>
                      {proj.technologies && (
                        <p className="text-xs text-slate-500 font-mono mt-0.5">[{proj.technologies.join(', ')}]</p>
                      )}
                      {proj.bullets && (
                        <ul className={`mt-1.5 ${density.bulletSpace} list-disc ml-4 text-slate-700`}>
                          {proj.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'education' && resume.education.length > 0) {
            return (
              <section key="education" className={density.sectionMargin}>
                <SectionHeading title="Education" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-1">
                  {resume.education.map((e) => (
                    <div key={e.id} className="flex justify-between text-xs">
                      <span><strong className="text-slate-900">{[e.degree, e.field].filter(Boolean).join(' in ')}</strong>, {e.institution}</span>
                      <span className="text-slate-500 font-mono">{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

// 6. CREATIVE TEMPLATE
export const CreativeTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const fontClass = getFontClass(resume.fontFamily || 'outfit');
  const density = getDensity(resume.spacingDensity);
  const accent = resume.accentColor || '#7c3aed';

  return (
    <div className={`w-full bg-white text-slate-900 ${fontClass} ${density.padding} ${density.leading} ${density.textSize} shadow-sm`}>
      {/* Creative Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: accent }}>
          {resume.contact.fullName || 'Candidate Name'}
        </h1>
        {resume.contact.title && (
          <p className="text-sm font-semibold tracking-wide uppercase text-slate-600 mt-1">
            {resume.contact.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 mt-2 font-medium">
          {resume.contact.email && <span>{resume.contact.email}</span>}
          {resume.contact.phone && <span>{resume.contact.phone}</span>}
          {resume.contact.location && <span>{resume.contact.location}</span>}
          {resume.contact.website && <span>{resume.contact.website}</span>}
        </div>
      </header>

      {/* Sections */}
      <div className={density.space}>
        {resume.sectionOrder.map((sectionKey) => {
          if (sectionKey === 'summary' && resume.summary) {
            return (
              <section key="summary" className={density.sectionMargin}>
                <SectionHeading title="About Me" accentColor={accent} headerStyle={resume.headerStyle} />
                <p className="text-slate-700 leading-relaxed text-justify">{resume.summary}</p>
              </section>
            );
          }

          if (sectionKey === 'experience' && resume.experience.length > 0) {
            return (
              <section key="experience" className={density.sectionMargin}>
                <SectionHeading title="Career Experience" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className={density.itemSpace}>
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: accent }}>
                          {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">{exp.company} {exp.location ? `· ${exp.location}` : ''}</p>
                      {exp.bullets && (
                        <ul className={`mt-2 ${density.bulletSpace} list-disc ml-4 text-slate-700`}>
                          {exp.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'skills' && resume.skills.length > 0) {
            return (
              <section key="skills" className={density.sectionMargin}>
                <SectionHeading title="Key Skills & Tooling" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="flex flex-wrap gap-2">
                  {resume.skills.flatMap((s) => s.items).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'education' && resume.education.length > 0) {
            return (
              <section key="education" className={density.sectionMargin}>
                <SectionHeading title="Education" accentColor={accent} headerStyle={resume.headerStyle} />
                <div className="space-y-1.5">
                  {resume.education.map((e) => (
                    <div key={e.id} className="flex justify-between text-xs">
                      <span className="font-bold text-slate-900">{[e.degree, e.field].filter(Boolean).join(' in ')} — {e.institution}</span>
                      <span className="text-slate-500">{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

// MASTER TEMPLATE RENDERER
export const TemplateRenderer: React.FC<{
  templateId: ResumeTemplateId;
  resume: StructuredResume;
  atsMode?: boolean;
}> = ({ templateId, resume, atsMode }) => {
  if (atsMode || templateId === 'ats-classic') {
    return <ATSClassicTemplate resume={resume} atsMode={atsMode} />;
  }

  switch (templateId) {
    case 'modern':
      return <ModernTemplate resume={resume} />;
    case 'minimal':
      return <MinimalTemplate resume={resume} />;
    case 'executive':
      return <ExecutiveTemplate resume={resume} />;
    case 'tech':
      return <TechTemplate resume={resume} />;
    case 'creative':
      return <CreativeTemplate resume={resume} />;
    default:
      return <ATSClassicTemplate resume={resume} />;
  }
};
