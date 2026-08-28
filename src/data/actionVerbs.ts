export interface ActionVerbCategory {
  category: string;
  description: string;
  verbs: string[];
}

export const ACTION_VERB_CATEGORIES: ActionVerbCategory[] = [
  {
    category: 'Leadership & Management',
    description: 'When leading teams, initiatives, or driving organizational direction',
    verbs: [
      'Spearheaded', 'Orchestrated', 'Championed', 'Directed', 'Mobilized',
      'Cultivated', 'Mentored', 'Empowered', 'Steered', 'Formulated',
      'Galvanized', 'Fostered', 'Navigated', 'Supervised', 'Unified'
    ]
  },
  {
    category: 'Engineering & Architecture',
    description: 'When building, coding, architecting, or designing technical systems',
    verbs: [
      'Architected', 'Engineered', 'Constructed', 'Implemented', 'Refactored',
      'Deployed', 'Configured', 'Automated', 'Devised', 'Prototyped',
      'Integrated', 'Standardized', 'Overhauled', 'Programmed', 'Containerized'
    ]
  },
  {
    category: 'Optimization & Efficiency',
    description: 'When improving speed, reducing costs, or eliminating bottlenecks',
    verbs: [
      'Accelerated', 'Streamlined', 'Optimized', 'Maximized', 'Consolidated',
      'Minimized', 'Eliminated', 'Restructured', 'Audited', 'Yielded',
      'Augmented', 'Amplified', 'Elevated', 'Curtailed', 'Expedited'
    ]
  },
  {
    category: 'Growth & Business Impact',
    description: 'When increasing revenue, conversion, user acquisition, or engagement',
    verbs: [
      'Generated', 'Scaled', 'Doubled', 'Captured', 'Monetized',
      'Outperformed', 'Acquired', 'Propelled', 'Retained', 'Boosted',
      'Expanded', 'Penetrated', 'Secured', 'Leveraged', 'Converted'
    ]
  },
  {
    category: 'Analysis & Research',
    description: 'When diagnosing issues, evaluating metrics, or uncovering insights',
    verbs: [
      'Discovered', 'Quantified', 'Synthesized', 'Extracted', 'Forecasted',
      'Benchmarked', 'Deciphered', 'Surveyed', 'Correlated', 'Diagnosed',
      'Analyzed', 'Evaluated', 'Pinpointed', 'Uncovered', 'Modeled'
    ]
  },
  {
    category: 'Communication & Collaboration',
    description: 'When aligning stakeholders, presenting data, or building consensus',
    verbs: [
      'Articulated', 'Negotiated', 'Advocated', 'Partnered', 'Presented',
      'Coordinated', 'Facilitated', 'Authored', 'Clarified', 'Briefed',
      'Liaised', 'Mediated', 'Evangelized', 'Engaged', 'Published'
    ]
  }
];

export const WEAK_VERBS_MAP: Record<string, string[]> = {
  'worked on': ['Spearheaded', 'Engineered', 'Delivered', 'Implemented'],
  'responsible for': ['Managed', 'Directed', 'Orchestrated', 'Oversaw'],
  'helped with': ['Collaborated on', 'Facilitated', 'Supported', 'Accelerated'],
  'did': ['Executed', 'Accomplished', 'Produced', 'Completed'],
  'made': ['Created', 'Architected', 'Formulated', 'Engineered'],
  'tried': ['Piloted', 'Pioneered', 'Spearheaded', 'Prototyped'],
  'handled': ['Resolved', 'Administered', 'Managed', 'Steered'],
  'assisted': ['Partnered with', 'Coordinated', 'Reinforced', 'Bolstered'],
  'fixed': ['Resolved', 'Remediated', 'Rectified', 'Overhauled'],
  'changed': ['Transformed', 'Modernized', 'Restructured', 'Refactored']
};

export interface BulletStrengthScore {
  score: number; // 0 to 100
  hasActionVerb: boolean;
  hasMetric: boolean;
  hasImpact: boolean;
  detectedVerb?: string;
  isWeakVerb: boolean;
  weakVerbMatch?: string;
  feedback: string[];
}

export function evaluateBulletStrength(bulletText: string): BulletStrengthScore {
  const text = bulletText.trim();
  if (!text) {
    return {
      score: 0,
      hasActionVerb: false,
      hasMetric: false,
      hasImpact: false,
      isWeakVerb: false,
      feedback: ['Add an achievement bullet']
    };
  }

  const feedback: string[] = [];
  let score = 30; // base for content

  // 1. Check for metric / numbers (%, $, x-times, numbers)
  const metricRegex = /(\d+[\.,]?\d*[%kKmMbBxX]?|\$\d+[\.,]?\d*|\b(doubled|tripled|halved|hundreds|thousands)\b)/i;
  const hasMetric = metricRegex.test(text);
  if (hasMetric) {
    score += 35;
  } else {
    feedback.push('Add measurable metrics (e.g. +25%, $50K, 10x faster) to prove your impact');
  }

  // 2. Check for weak verbs
  let isWeakVerb = false;
  let weakVerbMatch = '';
  const lowerText = text.toLowerCase();
  for (const weak in WEAK_VERBS_MAP) {
    if (lowerText.startsWith(weak) || lowerText.includes(` ${weak} `)) {
      isWeakVerb = true;
      weakVerbMatch = weak;
      score -= 15;
      feedback.push(`Replace weak phrase "${weak}" with strong power verb (${WEAK_VERBS_MAP[weak].slice(0, 2).join(', ')})`);
      break;
    }
  }

  // 3. Check for strong action verb at start
  const firstWord = text.split(/\s+/)[0]?.replace(/[^a-zA-Z]/g, '');
  let detectedVerb: string | undefined = undefined;
  let hasActionVerb = false;

  const allPowerVerbs = ACTION_VERB_CATEGORIES.flatMap(c => c.verbs);
  const matchedVerb = allPowerVerbs.find(v => v.toLowerCase() === firstWord.toLowerCase());
  
  if (matchedVerb) {
    hasActionVerb = true;
    detectedVerb = matchedVerb;
    score += 25;
  } else if (!isWeakVerb && /^[A-Z][a-z]+ed\b/.test(firstWord)) {
    // Other past-tense verb
    hasActionVerb = true;
    detectedVerb = firstWord;
    score += 20;
  } else if (!isWeakVerb) {
    feedback.push('Start with a strong past-tense action verb (e.g. "Spearheaded", "Engineered", "Optimized")');
  }

  // 4. Check for result/outcome keywords (by, resulting in, improving, reducing, delivering, saving)
  const impactRegex = /\b(resulting in|improving|reducing|increasing|enhancing|delivering|saving|yielding|leading to|driving|boosting)\b/i;
  const hasImpact = impactRegex.test(text) || (hasMetric && text.length > 50);
  if (hasImpact) {
    score += 10;
  } else {
    feedback.push('Include the business outcome using the XYZ formula: Accomplished [X] measured by [Y] by doing [Z]');
  }

  // Normalize score
  const finalScore = Math.min(100, Math.max(10, score));

  return {
    score: finalScore,
    hasActionVerb,
    hasMetric,
    hasImpact,
    detectedVerb,
    isWeakVerb,
    weakVerbMatch,
    feedback: feedback.length > 0 ? feedback : ['Strong, metrics-driven bullet point adhering to Google XYZ formula!']
  };
}
