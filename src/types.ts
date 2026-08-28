export interface SectionImprovement {
  section: string;
  improvements: string;
}

export interface OptimizationSummary {
  matchScoreEstimate: number;
  keywordsIdentified: string[];
  skillsEmphasized: string[];
  sectionsImproved: SectionImprovement[];
  keyHighlights: string[];
}

export interface OptimizationResult {
  optimizedResume: string;
  summary: OptimizationSummary;
}

export interface SamplePreset {
  id: string;
  title: string;
  role: string;
  resumeText: string;
  jobDescription: string;
}

export type ViewMode = 'rendered' | 'raw';
export type ResumeFont = 'sans' | 'serif' | 'mono' | 'outfit' | 'playfair';
export type SpacingDensity = 'compact' | 'normal' | 'spacious';
export type HeaderStyle = 'underline' | 'pill' | 'accent-bar' | 'minimal' | 'shaded';

// ================== RESUME STUDIO TYPES ==================

export type ResumeTemplateId =
  | 'ats-classic'
  | 'modern'
  | 'minimal'
  | 'executive'
  | 'tech'
  | 'creative';

export interface ResumeContact {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface ResumeExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ResumeEducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string;
}

export interface ResumeSkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface ResumeProjectItem {
  id: string;
  name: string;
  role?: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface ResumeCertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  items: string[];
}

export type SectionType =
  | 'summary'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'custom';

export interface StructuredResume {
  contact: ResumeContact;
  summary: string;
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  skills: ResumeSkillCategory[];
  projects: ResumeProjectItem[];
  certifications: ResumeCertificationItem[];
  customSections: ResumeCustomSection[];
  sectionOrder: SectionType[];
  accentColor?: string;
  fontFamily?: ResumeFont;
  spacingDensity?: SpacingDensity;
  headerStyle?: HeaderStyle;
}

export interface CoverLetterData {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  salutation: string;
  opening: string;
  bodyParagraphs: string[];
  closing: string;
  signature: string;
}

export interface AtsFormattingCheck {
  id: string;
  name: string;
  passed: boolean;
  message: string;
  severity: 'good' | 'warning' | 'critical';
}

export interface AtsAnalysisResult {
  overallAtsScore: number;
  jobMatchScore: number;
  keywordCoverage: {
    matched: string[];
    missing: string[];
    totalIdentified: number;
    matchPercentage: number;
  };
  skillsAlignment: {
    matched: string[];
    missingFromResume: string[];
    alignmentPercentage: number;
  };
  formattingCompatibility: {
    score: number;
    checks: AtsFormattingCheck[];
  };
  actionableRecommendations: string[];
  strengths: string[];
}

// ================== JOB MATCH ENGINE TYPES ==================

export interface JobMatchSkills {
  matched: string[];
  missing: string[];
  potential: string[];
}

export interface SemanticMatchItem {
  jobTerm: string;
  resumeEquivalent: string;
  notes?: string;
}

export interface KeywordAnalysisData {
  matched: string[];
  missing: string[];
  semantic: SemanticMatchItem[];
}

export interface ExperienceMatchItem {
  area: string;
  evidence: string;
}

export interface PartialExperienceItem {
  area: string;
  candidateBackground: string;
  gap: string;
}

export interface InsufficientEvidenceItem {
  requirement: string;
  note: string;
}

export interface ExperienceAlignmentData {
  strongMatches: ExperienceMatchItem[];
  partialMatches: PartialExperienceItem[];
  insufficientEvidence: InsufficientEvidenceItem[];
}

export interface EducationCertMatchData {
  matched: string[];
  missing: string[];
  notMentioned: string[];
  analysis: string;
}

export interface ActionPlanItem {
  category: 'bullet' | 'skill' | 'project' | 'section' | 'general';
  title: string;
  recommendation: string;
  exampleOrTip?: string;
}

export interface JobMatchBreakdown {
  overall: number;
  skills: number;
  experience: number;
  keywords: number;
  education: number;
}

export interface JobMatchAnalysisResult {
  overallScore: number;
  tier: string;
  summaryVerdict: string;
  breakdown: JobMatchBreakdown;
  skillsMatch: JobMatchSkills;
  keywordAnalysis: KeywordAnalysisData;
  experienceAlignment: ExperienceAlignmentData;
  educationAndCerts: EducationCertMatchData;
  strengths: string[];
  gaps: string[];
  actionPlan: ActionPlanItem[];
  analyzedAt?: string;
}

export interface BeforeAfterComparisonData {
  originalScore: number;
  optimizedScore: number;
  scoreDelta: number;
  originalText: string;
  optimizedText: string;
  newKeywordsAdded: string[];
  improvedBulletsCount: number;
  keyEnhancements: string[];
}


