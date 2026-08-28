import { StructuredResume, AtsAnalysisResult, AtsFormattingCheck } from '../types';

// Common strong action verbs for ATS
const STRONG_ACTION_VERBS = [
  'accelerated', 'achieved', 'advanced', 'analyzed', 'architected', 'automated', 'boosted',
  'built', 'championed', 'composed', 'consolidated', 'constructed', 'coordinated', 'created',
  'decreased', 'delivered', 'deployed', 'designed', 'developed', 'devised', 'directed',
  'doubled', 'drove', 'engineered', 'enhanced', 'established', 'executed', 'expanded',
  'expedited', 'formulated', 'fostered', 'generated', 'guided', 'implemented', 'improved',
  'increased', 'initiated', 'innovated', 'instituted', 'integrated', 'launched', 'led',
  'maximized', 'mentored', 'modernized', 'optimized', 'orchestrated', 'overhauled', 'pioneered',
  'produced', 'reduced', 'refactored', 'restructured', 'revitalized', 'saved', 'scaled',
  'secured', 'simplified', 'spearheaded', 'standardized', 'streamlined', 'strengthened',
  'surpassed', 'synthesized', 'transformed', 'upgraded', 'validated', 'yielded'
];

// Common tech & professional stop words to ignore in keyword extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but',
  'by', 'can', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
  'with', 'you', 'your', 'yours', 'yourself', 'yourselves', 'will', 'work', 'experience',
  'ability', 'responsible', 'duties', 'including', 'years', 'team', 'company', 'role', 'strong',
  'excellent', 'good', 'skills', 'knowledge', 'plus', 'preferred', 'requirements', 'qualifications'
]);

/**
 * Extracts meaningful keyword tokens from job description
 */
export function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];
  
  // Extract technical multi-words or acronyms first
  const techTerms = [
    'react 18', 'react', 'next.js', 'typescript', 'javascript', 'node.js', 'python', 'java', 'c++',
    'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'ci/cd', 'graphql', 'rest api', 'sql', 'nosql',
    'postgresql', 'mongodb', 'redis', 'tailwind css', 'system design', 'microservices',
    'agile', 'scrum', 'core web vitals', 'unit testing', 'jest', 'vitest', 'playwright', 'cypress',
    'accessibility', 'wcag', 'performance optimization', 'state management', 'redux', 'zustand',
    'product management', 'cross-functional', 'leadership', 'data analytics', 'machine learning'
  ];

  const lower = text.toLowerCase();
  const matchedTerms = new Set<string>();

  techTerms.forEach((term) => {
    if (lower.includes(term)) {
      matchedTerms.add(term);
    }
  });

  // Extract individual nouns/tech words (4+ letters)
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  const wordCounts: { [w: string]: number } = {};
  words.forEach((w) => {
    wordCounts[w] = (wordCounts[w] || 0) + 1;
  });

  // Pick high frequency words
  Object.keys(wordCounts)
    .sort((a, b) => wordCounts[b] - wordCounts[a])
    .slice(0, 25)
    .forEach((w) => matchedTerms.add(w));

  return Array.from(matchedTerms);
}

/**
 * Performs full ATS and Job Match analysis on a StructuredResume
 */
export function analyzeResumeForAts(
  resume: StructuredResume,
  jobDescription?: string
): AtsAnalysisResult {
  const checks: AtsFormattingCheck[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];

  // Combine full resume text for search
  const allBullets = [
    ...resume.experience.flatMap((e) => e.bullets),
    ...resume.projects.flatMap((p) => p.bullets),
  ];
  const allSkills = resume.skills.flatMap((s) => s.items).map((i) => i.toLowerCase());
  const allText = [
    resume.contact.fullName,
    resume.contact.title,
    resume.summary,
    ...resume.experience.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...resume.education.flatMap((e) => [e.institution, e.degree, e.field, e.highlights || '']),
    ...allSkills,
    ...resume.projects.flatMap((p) => [p.name, ...p.bullets, ...(p.technologies || [])]),
    ...resume.certifications.map((c) => c.name),
  ]
    .join(' ')
    .toLowerCase();

  // 1. Check Contact Info
  const hasEmail = Boolean(resume.contact.email && resume.contact.email.includes('@'));
  const hasPhone = Boolean(resume.contact.phone && resume.contact.phone.length >= 7);
  const hasLocation = Boolean(resume.contact.location && resume.contact.location.length >= 2);
  const hasName = Boolean(resume.contact.fullName && resume.contact.fullName.length >= 3);

  checks.push({
    id: 'contact-complete',
    name: 'Contact Information Completeness',
    passed: hasEmail && hasPhone && hasName,
    message: hasEmail && hasPhone && hasName
      ? 'Complete contact details (Name, Email, Phone) detected.'
      : 'Missing key contact information (ensure Email, Phone, and Name are filled).',
    severity: hasEmail && hasPhone ? 'good' : 'critical',
  });

  if (hasEmail && hasPhone) {
    strengths.push('Professional contact header includes direct phone and email channels.');
  } else {
    recommendations.push('Add missing contact information (phone number or email address).');
  }

  // 2. Check Professional Summary
  const summaryWordCount = resume.summary ? resume.summary.trim().split(/\s+/).length : 0;
  const hasGoodSummary = summaryWordCount >= 20 && summaryWordCount <= 90;

  checks.push({
    id: 'summary-length',
    name: 'Executive Summary Length & Density',
    passed: hasGoodSummary,
    message: hasGoodSummary
      ? `Well-balanced summary length (${summaryWordCount} words).`
      : summaryWordCount === 0
      ? 'No summary found. A 2-4 sentence summary increases recruiter retention.'
      : summaryWordCount < 20
      ? 'Summary is slightly brief; aim for 30-60 punchy words.'
      : 'Summary is too long (over 90 words); condense for ATS readability.',
    severity: hasGoodSummary ? 'good' : 'warning',
  });

  // 3. Check Work Experience Bullets & Quantifiable Metrics
  let metricBulletCount = 0;
  let actionVerbBulletCount = 0;

  allBullets.forEach((bullet) => {
    const trimmed = bullet.trim().toLowerCase();
    // Check metric (numbers, percentages, dollar signs, x multipliers)
    if (/\d+%|\$\d+|\b\d{2,}\b|\b\d+k\b|\b\d+x\b/i.test(bullet)) {
      metricBulletCount++;
    }
    // Check action verb at start
    const firstWord = trimmed.split(/\s+/)[0];
    if (STRONG_ACTION_VERBS.includes(firstWord)) {
      actionVerbBulletCount++;
    }
  });

  const bulletCount = allBullets.length;
  const hasMetrics = bulletCount > 0 && metricBulletCount / bulletCount >= 0.35;
  const hasActionVerbs = bulletCount > 0 && actionVerbBulletCount / bulletCount >= 0.5;

  checks.push({
    id: 'action-verbs',
    name: 'Action Verbs Usage',
    passed: hasActionVerbs,
    message: hasActionVerbs
      ? `${actionVerbBulletCount} of ${bulletCount} bullets start with high-impact action verbs.`
      : `Only ${actionVerbBulletCount} of ${bulletCount} bullets start with recognized strong action verbs. Use the 'Strengthen' AI tool on bullet points.`,
    severity: hasActionVerbs ? 'good' : 'warning',
  });

  checks.push({
    id: 'quantifiable-impact',
    name: 'Measurable Metrics & Results',
    passed: hasMetrics,
    message: hasMetrics
      ? `Strong quantifiable evidence: ${metricBulletCount} bullets contain specific metrics (%, $, numbers).`
      : `Add more quantifiable metrics (e.g. "reduced latency by 35%", "scaled to 100k users").`,
    severity: hasMetrics ? 'good' : 'warning',
  });

  if (hasMetrics) {
    strengths.push('High concentration of quantifiable metrics throughout work experience.');
  } else {
    recommendations.push('Include more concrete numbers, percentages, and scale metrics in your accomplishments.');
  }

  // 4. Check Skills Categorization
  const totalSkillsCount = allSkills.length;
  const hasCategorizedSkills = resume.skills.length >= 2 && totalSkillsCount >= 6;

  checks.push({
    id: 'skills-section',
    name: 'Categorized Skills Section',
    passed: hasCategorizedSkills,
    message: hasCategorizedSkills
      ? `Detected ${totalSkillsCount} structured skills across ${resume.skills.length} categories.`
      : 'Group skills into clear logical categories (e.g. Languages, Tools, Methodologies).',
    severity: hasCategorizedSkills ? 'good' : 'warning',
  });

  // 5. Standard Section Headers Check
  const standardSectionsPresent = ['experience', 'skills', 'education'].every((sec) =>
    resume.sectionOrder.includes(sec as any)
  );

  checks.push({
    id: 'standard-headers',
    name: 'Standard ATS Section Headers',
    passed: standardSectionsPresent,
    message: standardSectionsPresent
      ? 'Standardized ATS hierarchy (Experience, Skills, Education) verified.'
      : 'Ensure standard headers (Experience, Skills, Education) are present for parser compatibility.',
    severity: standardSectionsPresent ? 'good' : 'critical',
  });

  // 6. Keywords & Job Match Calculation
  let jdKeywords = jobDescription ? extractKeywordsFromText(jobDescription) : [];
  if (jdKeywords.length === 0) {
    // If no JD provided, extract from summary & experience
    jdKeywords = extractKeywordsFromText(resume.summary + ' ' + allBullets.join(' '));
  }

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdKeywords.forEach((kw) => {
    if (allText.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordMatchPercent = jdKeywords.length > 0
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 85;

  // Skills Alignment
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  jdKeywords.forEach((kw) => {
    if (allSkills.some((s) => s.includes(kw.toLowerCase()) || kw.toLowerCase().includes(s))) {
      matchedSkills.push(kw);
    } else if (kw.length >= 4 && !matchedKeywords.includes(kw)) {
      missingSkills.push(kw);
    }
  });

  // Calculate Overall ATS Score (0 - 100)
  let baseScore = 60;
  if (hasEmail && hasPhone && hasName) baseScore += 10;
  if (hasGoodSummary) baseScore += 8;
  if (hasActionVerbs) baseScore += 8;
  if (hasMetrics) baseScore += 8;
  if (hasCategorizedSkills) baseScore += 6;
  if (standardSectionsPresent) baseScore += 5;

  // Keyword match influence
  const jobMatchScore = Math.min(100, Math.max(40, Math.round(keywordMatchPercent * 0.95 + 5)));
  const overallAtsScore = Math.min(98, Math.max(45, Math.round((baseScore * 0.55) + (jobMatchScore * 0.45))));

  // Formatting Compatibility Score
  const passedChecksCount = checks.filter((c) => c.passed).length;
  const formattingScore = Math.round((passedChecksCount / checks.length) * 100);

  if (missingKeywords.length > 0) {
    recommendations.push(
      `Consider incorporating supported target keywords: ${missingKeywords.slice(0, 4).join(', ')}.`
    );
  }

  return {
    overallAtsScore,
    jobMatchScore,
    keywordCoverage: {
      matched: matchedKeywords,
      missing: missingKeywords.slice(0, 10),
      totalIdentified: jdKeywords.length,
      matchPercentage: keywordMatchPercent,
    },
    skillsAlignment: {
      matched: matchedSkills,
      missingFromResume: missingSkills.slice(0, 8),
      alignmentPercentage: Math.min(100, Math.round((matchedSkills.length / Math.max(1, matchedSkills.length + missingSkills.length)) * 100)),
    },
    formattingCompatibility: {
      score: formattingScore,
      checks,
    },
    actionableRecommendations: recommendations,
    strengths,
  };
}
