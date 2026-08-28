import React, { useState } from 'react';
import {
  StructuredResume,
  ResumeExperienceItem,
  ResumeEducationItem,
  ResumeSkillCategory,
  ResumeProjectItem,
  ResumeCertificationItem,
  SectionType,
} from '../../types';
import {
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Check,
  X,
  FileText,
  BookOpen,
  Zap,
  HelpCircle,
  FolderPlus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AiImproveModal } from './AiImproveModal';
import { RoleBulletsDrawer } from './RoleBulletsDrawer';
import { ActionVerbSelector } from './ActionVerbSelector';
import { SAMPLE_PROFILES } from '../../data/sampleProfiles';

interface ResumeEditorPanelProps {
  resume: StructuredResume;
  jobDescription?: string;
  onChange: (updatedResume: StructuredResume) => void;
}

export const ResumeEditorPanel: React.FC<ResumeEditorPanelProps> = ({
  resume,
  jobDescription,
  onChange,
}) => {
  // Modal state for AI improvement
  const [aiModal, setAiModal] = useState<{
    isOpen: boolean;
    text: string;
    sectionType: string;
    context?: string;
    onApply: (improved: string) => void;
  }>({
    isOpen: false,
    text: '',
    sectionType: '',
    onApply: () => {},
  });

  // Bullets Library Drawer
  const [isBulletsDrawerOpen, setIsBulletsDrawerOpen] = useState(false);
  const [activeExpIdForBullets, setActiveExpIdForBullets] = useState<string | null>(null);

  // Action Verb Selector Modal
  const [isVerbSelectorOpen, setIsVerbSelectorOpen] = useState(false);
  const [verbTargetBullet, setVerbTargetBullet] = useState<{ expId: string; bulletIdx: number; currentText: string } | null>(null);

  // Section collapse states
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Reorder sections
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...resume.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    onChange({ ...resume, sectionOrder: newOrder });
  };

  // Helper to open AI modal
  const openAiModal = (
    text: string,
    sectionType: string,
    context: string | undefined,
    onApply: (improved: string) => void
  ) => {
    setAiModal({
      isOpen: true,
      text,
      sectionType,
      context,
      onApply,
    });
  };

  // Google XYZ Metric Quality Analyzer for Bullets
  const analyzeBullet = (text: string) => {
    if (!text || text.trim().length < 10) return { score: 'empty', label: 'Empty' };
    const hasMetric = /\b(\d+[%kKmMbBxX]?|\$\d+|\d+\+|\d+x|\d+\.\d+)\b/.test(text);
    const hasStrongActionVerb = /^(Architected|Spearheaded|Engineered|Orchestrated|Accelerated|Automated|Slashed|Optimized|Delivered|Pioneered|Designed|Built|Scaled|Transformed|Led|Managed|Implemented|Reduced|Increased|Generated|Established|Negotiated|Revamped)\b/i.test(
      text.trim()
    );

    if (hasMetric && hasStrongActionVerb) {
      return { score: 'high', label: 'Google XYZ High Impact', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (hasMetric) {
      return { score: 'medium', label: 'Has Metrics', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    }
    if (hasStrongActionVerb) {
      return { score: 'action', label: 'Add % or $ Metric', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
    return { score: 'weak', label: 'Needs Power Verb & Metric', color: 'text-slate-600 bg-slate-100 border-slate-200' };
  };

  // 1. Contact / Header Handlers
  const handleContactChange = (field: keyof StructuredResume['contact'], value: string) => {
    onChange({
      ...resume,
      contact: {
        ...resume.contact,
        [field]: value,
      },
    });
  };

  // 2. Summary Handlers
  const handleSummaryChange = (value: string) => {
    onChange({ ...resume, summary: value });
  };

  // 3. Experience Handlers
  const handleAddExperience = () => {
    const newExp: ResumeExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Senior Software Engineer',
      company: 'Acme Corp',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: ['Spearheaded development of core distributed service, reducing API latency by 45%.'],
    };
    onChange({ ...resume, experience: [newExp, ...resume.experience] });
  };

  const handleUpdateExperience = (id: string, updates: Partial<ResumeExperienceItem>) => {
    onChange({
      ...resume,
      experience: resume.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const handleDeleteExperience = (id: string) => {
    onChange({
      ...resume,
      experience: resume.experience.filter((e) => e.id !== id),
    });
  };

  const handleAddExpBullet = (expId: string) => {
    onChange({
      ...resume,
      experience: resume.experience.map((e) => {
        if (e.id === expId) {
          return { ...e, bullets: [...e.bullets, ''] };
        }
        return e;
      }),
    });
  };

  const handleUpdateExpBullet = (expId: string, bulletIndex: number, text: string) => {
    onChange({
      ...resume,
      experience: resume.experience.map((e) => {
        if (e.id === expId) {
          const newBullets = [...e.bullets];
          newBullets[bulletIndex] = text;
          return { ...e, bullets: newBullets };
        }
        return e;
      }),
    });
  };

  const handleDeleteExpBullet = (expId: string, bulletIndex: number) => {
    onChange({
      ...resume,
      experience: resume.experience.map((e) => {
        if (e.id === expId) {
          return { ...e, bullets: e.bullets.filter((_, idx) => idx !== bulletIndex) };
        }
        return e;
      }),
    });
  };

  const handleInsertLibraryBullets = (bulletsToAdd: string[]) => {
    if (!activeExpIdForBullets) return;
    onChange({
      ...resume,
      experience: resume.experience.map((e) => {
        if (e.id === activeExpIdForBullets) {
          // Remove empty bullets if any and append selected bullets
          const cleanExisting = e.bullets.filter((b) => b.trim().length > 0);
          return { ...e, bullets: [...cleanExisting, ...bulletsToAdd] };
        }
        return e;
      }),
    });
    setIsBulletsDrawerOpen(false);
  };

  const handleApplyVerb = (verb: string) => {
    if (!verbTargetBullet) return;
    const { expId, bulletIdx, currentText } = verbTargetBullet;
    // Replace the first word or prepend verb
    const words = currentText.trim().split(/\s+/);
    let newText = '';
    if (words.length > 0 && /^[a-zA-Z]+$/.test(words[0])) {
      words[0] = verb;
      newText = words.join(' ');
    } else {
      newText = `${verb} ${currentText}`.trim();
    }
    handleUpdateExpBullet(expId, bulletIdx, newText);
    setIsVerbSelectorOpen(false);
  };

  // 4. Skills Handlers
  const handleAddSkillCategory = () => {
    const newCat: ResumeSkillCategory = {
      id: `skill-${Date.now()}`,
      category: 'Frameworks & Tools',
      items: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS'],
    };
    onChange({ ...resume, skills: [...resume.skills, newCat] });
  };

  const handleUpdateSkillCategory = (id: string, category: string) => {
    onChange({
      ...resume,
      skills: resume.skills.map((s) => (s.id === id ? { ...s, category } : s)),
    });
  };

  const handleAddSkillItem = (catId: string, skill: string) => {
    if (!skill.trim()) return;
    onChange({
      ...resume,
      skills: resume.skills.map((s) => {
        if (s.id === catId && !s.items.includes(skill.trim())) {
          return { ...s, items: [...s.items, skill.trim()] };
        }
        return s;
      }),
    });
  };

  const handleRemoveSkillItem = (catId: string, index: number) => {
    onChange({
      ...resume,
      skills: resume.skills.map((s) => {
        if (s.id === catId) {
          return { ...s, items: s.items.filter((_, i) => i !== index) };
        }
        return s;
      }),
    });
  };

  const handleDeleteSkillCategory = (id: string) => {
    onChange({
      ...resume,
      skills: resume.skills.filter((s) => s.id !== id),
    });
  };

  // 5. Education Handlers
  const handleAddEducation = () => {
    const newEdu: ResumeEducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'University of California, Berkeley',
      degree: 'B.S.',
      field: 'Computer Science',
      startDate: '2016',
      endDate: '2020',
      gpa: '3.8',
    };
    onChange({ ...resume, education: [...resume.education, newEdu] });
  };

  const handleUpdateEducation = (id: string, updates: Partial<ResumeEducationItem>) => {
    onChange({
      ...resume,
      education: resume.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const handleDeleteEducation = (id: string) => {
    onChange({
      ...resume,
      education: resume.education.filter((e) => e.id !== id),
    });
  };

  // 6. Projects Handlers
  const handleAddProject = () => {
    const newProj: ResumeProjectItem = {
      id: `proj-${Date.now()}`,
      name: 'Open Source Distributed Cache',
      role: 'Lead Architect',
      technologies: ['Go', 'gRPC', 'Raft'],
      link: 'github.com/alexrivera/cache-raft',
      bullets: ['Built a consensus-backed distributed cache handling 50k+ QPS with sub-millisecond p99 latency.'],
    };
    onChange({ ...resume, projects: [...resume.projects, newProj] });
  };

  const handleUpdateProject = (id: string, updates: Partial<ResumeProjectItem>) => {
    onChange({
      ...resume,
      projects: resume.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const handleDeleteProject = (id: string) => {
    onChange({
      ...resume,
      projects: resume.projects.filter((p) => p.id !== id),
    });
  };

  // 7. Certifications Handlers
  const handleAddCert = () => {
    const newCert: ResumeCertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
    };
    onChange({ ...resume, certifications: [...resume.certifications, newCert] });
  };

  const handleDeleteCert = (id: string) => {
    onChange({
      ...resume,
      certifications: resume.certifications.filter((c) => c.id !== id),
    });
  };

  // Load sample profile helper
  const handleLoadSample = (profileId: string) => {
    const found = SAMPLE_PROFILES.find((p) => p.id === profileId);
    if (found) {
      onChange(JSON.parse(JSON.stringify(found.resume)));
    }
  };

  // Section Render Function
  const renderSection = (sectionKey: SectionType, index: number) => {
    const isFirst = index === 0;
    const isLast = index === resume.sectionOrder.length - 1;
    const isCollapsed = !!collapsedSections[sectionKey];

    const SectionHeader = ({ title, icon: Icon, onAdd }: { title: string; icon: any; onAdd?: () => void }) => (
      <div className="flex items-center justify-between p-3.5 bg-slate-50 border-b border-slate-200/80 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="text-[11px] px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
          <button
            type="button"
            disabled={isFirst}
            onClick={() => moveSection(index, 'up')}
            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
            title="Move Section Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => moveSection(index, 'down')}
            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
            title="Move Section Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleSection(sectionKey)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );

    if (sectionKey === 'summary') {
      return (
        <div key="summary" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <SectionHeader title="Professional Summary" icon={FileText} />
          {!isCollapsed && (
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">
                  Concise 2–4 sentence career narrative
                </span>
                <button
                  type="button"
                  onClick={() =>
                    openAiModal(
                      resume.summary,
                      'Professional Summary',
                      resume.contact.title,
                      (improved) => handleSummaryChange(improved)
                    )
                  }
                  className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Improve Summary with AI
                </button>
              </div>
              <textarea
                value={resume.summary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed font-mono-code"
                placeholder="Write a concise overview of your background, key strengths, and achievements..."
              />
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === 'experience') {
      return (
        <div key="experience" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <SectionHeader title="Work Experience" icon={Briefcase} onAdd={handleAddExperience} />
          {!isCollapsed && (
            <div className="p-4 space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleUpdateExperience(exp.id, { role: e.target.value })}
                      placeholder="Role / Title"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                      placeholder="Company"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleUpdateExperience(exp.id, { startDate: e.target.value })}
                      placeholder="Start Date (e.g. 2021)"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={exp.current ? 'Present' : exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => handleUpdateExperience(exp.id, { endDate: e.target.value })}
                        placeholder="End Date"
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 flex-1 disabled:bg-slate-100"
                      />
                      <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleUpdateExperience(exp.id, { current: e.target.checked })}
                          className="rounded text-indigo-600 focus:ring-0"
                        />
                        Current
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/70">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Achievement Bullets (Google XYZ Format)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveExpIdForBullets(exp.id);
                            setIsBulletsDrawerOpen(true);
                          }}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 hover:bg-indigo-100 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 border border-indigo-200/60 transition cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" /> Role Bullets Library
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddExpBullet(exp.id)}
                          className="text-[11px] text-slate-700 hover:text-indigo-600 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>
                    </div>

                    {exp.bullets.map((bullet, bIdx) => {
                      const analysis = analyzeBullet(bullet);
                      return (
                        <div key={bIdx} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex items-start gap-1.5">
                            <span className="text-xs text-slate-400 mt-1.5">•</span>
                            <textarea
                              value={bullet}
                              onChange={(e) => handleUpdateExpBullet(exp.id, bIdx, e.target.value)}
                              rows={2}
                              placeholder="Accomplished [X] as measured by [Y], by doing [Z]..."
                              className="flex-1 p-2 bg-slate-50/50 border border-slate-200/80 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono-code leading-relaxed"
                            />
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  openAiModal(
                                    bullet,
                                    'Work Experience Bullet',
                                    `${exp.role} at ${exp.company}`,
                                    (improved) => handleUpdateExpBullet(exp.id, bIdx, improved)
                                  )
                                }
                                className="p-1.5 rounded bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 transition cursor-pointer"
                                title="AI Polish & Quantify"
                              >
                                <Sparkles className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setVerbTargetBullet({ expId: exp.id, bulletIdx: bIdx, currentText: bullet });
                                  setIsVerbSelectorOpen(true);
                                }}
                                className="p-1.5 rounded bg-amber-50 border border-amber-100 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                                title="Power Action Verb Thesaurus"
                              >
                                <Zap className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExpBullet(exp.id, bIdx)}
                                className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                title="Delete Bullet"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Bullet Quality Badge & Quick Help */}
                          <div className="flex items-center justify-between text-[10px] pl-4">
                            <span className={`px-2 py-0.5 rounded-full border font-medium ${analysis.color}`}>
                              {analysis.label}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setVerbTargetBullet({ expId: exp.id, bulletIdx: bIdx, currentText: bullet });
                                setIsVerbSelectorOpen(true);
                              }}
                              className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                            >
                              <Zap className="w-2.5 h-2.5 text-amber-500" /> Action Verbs
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === 'skills') {
      return (
        <div key="skills" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <SectionHeader title="Skills & Competencies" icon={Wrench} onAdd={handleAddSkillCategory} />
          {!isCollapsed && (
            <div className="p-4 space-y-3">
              {resume.skills.map((skillCat) => (
                <div key={skillCat.id} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={skillCat.category}
                      onChange={(e) => handleUpdateSkillCategory(skillCat.id, e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-900 w-48"
                      placeholder="Category Name"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSkillCategory(skillCat.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {skillCat.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-800 flex items-center gap-1 font-medium"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillItem(skillCat.id, idx)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="+ Type & Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value;
                          if (val) {
                            handleAddSkillItem(skillCat.id, val);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="px-2 py-1 bg-white border border-dashed border-slate-300 rounded text-xs text-slate-700 w-28 focus:w-36 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === 'education') {
      return (
        <div key="education" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <SectionHeader title="Education" icon={GraduationCap} onAdd={handleAddEducation} />
          {!isCollapsed && (
            <div className="p-4 space-y-3">
              {resume.education.map((edu) => (
                <div key={edu.id} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                      placeholder="Degree (e.g. B.S.)"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => handleUpdateEducation(edu.id, { field: e.target.value })}
                      placeholder="Field of Study"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                      placeholder="University / College"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => handleUpdateEducation(edu.id, { startDate: e.target.value })}
                        placeholder="Start"
                        className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs w-20"
                      />
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => handleUpdateEducation(edu.id, { endDate: e.target.value })}
                        placeholder="End / Grad"
                        className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs w-20"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === 'projects') {
      return (
        <div key="projects" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <SectionHeader title="Key Projects" icon={FolderGit2} onAdd={handleAddProject} />
          {!isCollapsed && (
            <div className="p-4 space-y-3">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => handleUpdateProject(proj.id, { name: e.target.value })}
                      placeholder="Project Name"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                    />
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => handleUpdateProject(proj.id, { link: e.target.value })}
                      placeholder="GitHub / Live URL"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === 'certifications') {
      return (
        <div key="certifications" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <SectionHeader title="Certifications" icon={Award} onAdd={handleAddCert} />
          {!isCollapsed && (
            <div className="p-4 space-y-2">
              {resume.certifications.map((cert) => (
                <div key={cert.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => {
                      const updated = resume.certifications.map((c) =>
                        c.id === cert.id ? { ...c, name: e.target.value } : c
                      );
                      onChange({ ...resume, certifications: updated });
                    }}
                    placeholder="Certification Name"
                    className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => {
                      const updated = resume.certifications.map((c) =>
                        c.id === cert.id ? { ...c, issuer: e.target.value } : c
                      );
                      onChange({ ...resume, certifications: updated });
                    }}
                    placeholder="Issuer (e.g. AWS)"
                    className="w-32 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                  />
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => {
                      const updated = resume.certifications.map((c) =>
                        c.id === cert.id ? { ...c, date: e.target.value } : c
                      );
                      onChange({ ...resume, certifications: updated });
                    }}
                    placeholder="Year"
                    className="w-20 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteCert(cert.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-5">
      {/* Sample Profiles Bar */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-950">Pre-built Role Profiles:</span>
        </div>
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleLoadSample(e.target.value);
              e.target.value = '';
            }
          }}
          defaultValue=""
          className="text-xs bg-white border border-indigo-200 text-indigo-900 rounded-lg px-3 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="" disabled>
            ⚡ Load Sample Resume Profile...
          </option>
          {SAMPLE_PROFILES.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.name} — {prof.role} ({prof.experienceLevel})
            </option>
          ))}
        </select>
      </div>

      {/* 1. Header / Contact Information (Always top) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Contact & Header Details
            </span>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Name</label>
            <input
              type="text"
              value={resume.contact.fullName}
              onChange={(e) => handleContactChange('fullName', e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-indigo-500"
              placeholder="Alex Rivera"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target Professional Title</label>
            <input
              type="text"
              value={resume.contact.title}
              onChange={(e) => handleContactChange('title', e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              placeholder="Senior Software Engineer"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email Address</label>
            <input
              type="email"
              value={resume.contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              placeholder="alex.rivera@email.com"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phone Number</label>
            <input
              type="text"
              value={resume.contact.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              placeholder="(555) 342-9012"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Location (City, State / Remote)</label>
            <input
              type="text"
              value={resume.contact.location}
              onChange={(e) => handleContactChange('location', e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              placeholder="San Francisco, CA"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">LinkedIn Profile</label>
            <input
              type="text"
              value={resume.contact.linkedin}
              onChange={(e) => handleContactChange('linkedin', e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">GitHub Profile / Portfolio</label>
            <input
              type="text"
              value={resume.contact.github}
              onChange={(e) => handleContactChange('github', e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              placeholder="github.com/username"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Personal Website</label>
            <input
              type="text"
              value={resume.contact.website}
              onChange={(e) => handleContactChange('website', e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              placeholder="alexrivera.dev"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Sections based on sectionOrder */}
      <div className="space-y-4">
        {resume.sectionOrder.map((sectionKey, index) => renderSection(sectionKey, index))}
      </div>

      {/* AI Improvement Modal Dialog */}
      <AiImproveModal
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal((prev) => ({ ...prev, isOpen: false }))}
        originalText={aiModal.text}
        sectionType={aiModal.sectionType}
        context={aiModal.context}
        jobDescription={jobDescription}
        onApply={aiModal.onApply}
      />

      {/* Role Bullets Drawer */}
      <RoleBulletsDrawer
        isOpen={isBulletsDrawerOpen}
        onClose={() => setIsBulletsDrawerOpen(false)}
        onInsertBullet={(bulletText: string) => handleInsertLibraryBullets([bulletText])}
      />

      {/* Action Verb Selector Modal */}
      <ActionVerbSelector
        isOpen={isVerbSelectorOpen}
        onClose={() => setIsVerbSelectorOpen(false)}
        onSelectVerb={handleApplyVerb}
      />
    </div>
  );
};
