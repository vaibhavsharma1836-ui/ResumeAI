import {
  StructuredResume,
  ResumeContact,
  ResumeExperienceItem,
  ResumeEducationItem,
  ResumeSkillCategory,
  ResumeProjectItem,
  ResumeCertificationItem,
  ResumeCustomSection,
  SectionType,
} from '../types';

export function getDefaultStructuredResume(): StructuredResume {
  return {
    contact: {
      fullName: 'Alex Rivera',
      title: 'Senior Software Engineer',
      email: 'alex.rivera@email.com',
      phone: '(555) 342-9012',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexrivera-dev',
      github: 'github.com/alexrivera',
      website: '',
    },
    summary:
      'Accomplished Software Engineer with 6+ years specializing in high-performance web applications, modern frontend architecture, and distributed services. Proven track record leading engineering initiatives, optimizing Core Web Vitals, and scaling mission-critical platforms.',
    experience: [
      {
        id: 'exp-1',
        role: 'Senior Frontend Engineer',
        company: 'Veloce Systems',
        location: 'San Francisco, CA',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected responsive enterprise web applications using React 18, TypeScript, and Next.js, serving 250K+ monthly active users.',
          'Spearheaded client-side bundle optimization initiative, reducing JavaScript bundle size by 28% and improving Largest Contentful Paint (LCP) by 65%.',
          'Engineered reusable design system component library with strict WCAG 2.1 AA accessibility compliance across 5 products.',
          'Mentored 4 mid-level developers in modern state management best practices (Zustand, React Query) and automated test suites.',
        ],
      },
      {
        id: 'exp-2',
        role: 'Software Engineer',
        company: 'CloudApp Solutions',
        location: 'San Francisco, CA',
        startDate: '2018',
        endDate: '2021',
        current: false,
        bullets: [
          'Developed real-time analytical dashboards using React, D3.js, and WebSocket streams for enterprise operational telemetry.',
          'Designed resilient RESTful and GraphQL API endpoints in Node.js with comprehensive schema validation and error logging.',
          'Configured automated GitHub Actions CI/CD pipelines, accelerating release cycles from bi-weekly to continuous daily deployments.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of California, Davis',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2014',
        endDate: '2018',
        gpa: '3.8',
        highlights: "Dean's Honor List, Senior Capstone Project Lead",
      },
    ],
    skills: [
      {
        id: 'skill-1',
        category: 'Languages & Frameworks',
        items: ['TypeScript', 'JavaScript (ES6+)', 'React 18', 'Next.js', 'Node.js', 'GraphQL', 'HTML5/CSS3', 'Tailwind CSS'],
      },
      {
        id: 'skill-2',
        category: 'Architecture & Tools',
        items: ['Design Systems', 'State Management (Zustand/Redux)', 'REST APIs', 'Vite', 'Webpack', 'Docker', 'Git/GitHub Actions'],
      },
      {
        id: 'skill-3',
        category: 'Testing & Performance',
        items: ['Jest', 'Vitest', 'Playwright', 'Core Web Vitals', 'WCAG AA Accessibility', 'Bundle Optimization'],
      },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Enterprise Component System',
        role: 'Lead Architect',
        technologies: ['React', 'TypeScript', 'Tailwind', 'Storybook'],
        link: 'github.com/alexrivera/design-system',
        bullets: [
          'Built accessible multi-theme component library published to private npm registry, adopted by 8 engineering teams.',
          'Achieved 95%+ unit test coverage and automated visual regression testing using Playwright.',
        ],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: '2023',
      },
    ],
    customSections: [],
    sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
    accentColor: '#2563eb',
    fontFamily: 'sans',
  };
}

/**
 * Parses markdown text into a StructuredResume data model
 */
export function parseMarkdownToStructuredResume(markdown: string): StructuredResume {
  const defaultResume = getDefaultStructuredResume();
  if (!markdown || !markdown.trim()) {
    return defaultResume;
  }

  const lines = markdown.split('\n');
  const result: StructuredResume = {
    contact: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    customSections: [],
    sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
    accentColor: '#2563eb',
    fontFamily: 'sans',
  };

  let currentSection: string | null = null;
  let summaryLines: string[] = [];
  let currentExp: Partial<ResumeExperienceItem> | null = null;
  let currentEdu: Partial<ResumeEducationItem> | null = null;
  let currentProj: Partial<ResumeProjectItem> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) continue;

    // Header 1: Candidate Name
    if (line.startsWith('# ') && !result.contact.fullName) {
      result.contact.fullName = line.replace(/^#\s+/, '').trim();
      continue;
    }

    // Check contact info line (usually right under name, e.g. email | phone | location)
    if (!currentSection && (line.includes('@') || line.includes('|') || line.includes('http') || line.includes('linkedin.com'))) {
      const parts = line.split('|').map((p) => p.trim());
      parts.forEach((part) => {
        if (part.includes('@')) {
          result.contact.email = part;
        } else if (part.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)) {
          result.contact.phone = part;
        } else if (part.toLowerCase().includes('linkedin.com')) {
          result.contact.linkedin = part;
        } else if (part.toLowerCase().includes('github.com')) {
          result.contact.github = part;
        } else if (part.toLowerCase().includes('http') || part.includes('.com') || part.includes('.io') || part.includes('.me')) {
          result.contact.website = part;
        } else if (!result.contact.location && part.length < 50 && !part.startsWith('#')) {
          result.contact.location = part;
        }
      });
      continue;
    }

    // Section Headers (## Section Name)
    if (line.startsWith('## ')) {
      // Commit pending items
      if (currentExp && currentExp.role) {
        result.experience.push({
          id: `exp-${result.experience.length + 1}`,
          role: currentExp.role || 'Role',
          company: currentExp.company || 'Company',
          location: currentExp.location || '',
          startDate: currentExp.startDate || '',
          endDate: currentExp.endDate || '',
          current: !!currentExp.current,
          bullets: currentExp.bullets || [],
        });
        currentExp = null;
      }
      if (currentEdu && currentEdu.institution) {
        result.education.push({
          id: `edu-${result.education.length + 1}`,
          institution: currentEdu.institution || 'University',
          degree: currentEdu.degree || 'Degree',
          field: currentEdu.field || '',
          startDate: currentEdu.startDate || '',
          endDate: currentEdu.endDate || '',
          gpa: currentEdu.gpa,
          highlights: currentEdu.highlights,
        });
        currentEdu = null;
      }
      if (currentProj && currentProj.name) {
        result.projects.push({
          id: `proj-${result.projects.length + 1}`,
          name: currentProj.name || 'Project',
          role: currentProj.role,
          technologies: currentProj.technologies || [],
          link: currentProj.link,
          bullets: currentProj.bullets || [],
        });
        currentProj = null;
      }

      const secName = line.replace(/^##\s+/, '').trim().toLowerCase();
      if (secName.includes('summary') || secName.includes('profile') || secName.includes('about')) {
        currentSection = 'summary';
      } else if (secName.includes('experience') || secName.includes('work') || secName.includes('employment') || secName.includes('history')) {
        currentSection = 'experience';
      } else if (secName.includes('skill')) {
        currentSection = 'skills';
      } else if (secName.includes('education') || secName.includes('academic')) {
        currentSection = 'education';
      } else if (secName.includes('project')) {
        currentSection = 'projects';
      } else if (secName.includes('certif') || secName.includes('license')) {
        currentSection = 'certifications';
      } else {
        currentSection = 'custom_' + secName;
      }
      continue;
    }

    // Inside Summary
    if (currentSection === 'summary') {
      summaryLines.push(line);
      continue;
    }

    // Inside Experience
    if (currentSection === 'experience') {
      // Check for Role / Company line (e.g. ### Senior Developer | Company | 2021 - Present)
      if (line.startsWith('### ') || (line.includes('|') && !line.startsWith('- ') && !line.startsWith('* '))) {
        if (currentExp && currentExp.role) {
          result.experience.push({
            id: `exp-${result.experience.length + 1}`,
            role: currentExp.role || 'Role',
            company: currentExp.company || 'Company',
            location: currentExp.location || '',
            startDate: currentExp.startDate || '',
            endDate: currentExp.endDate || '',
            current: !!currentExp.current,
            bullets: currentExp.bullets || [],
          });
        }
        const cleanHeader = line.replace(/^###\s+/, '').trim();
        const parts = cleanHeader.split('|').map((s) => s.trim());
        const role = parts[0] || 'Role';
        const company = parts[1] || '';
        const dates = parts[2] || '';
        
        let startDate = '';
        let endDate = '';
        let isCurrent = false;

        if (dates) {
          const dateParts = dates.split(/[-–—]/).map((d) => d.trim());
          startDate = dateParts[0] || '';
          endDate = dateParts[1] || '';
          isCurrent = endDate.toLowerCase().includes('present') || endDate.toLowerCase().includes('current');
        }

        currentExp = {
          role,
          company,
          location: parts[3] || '',
          startDate,
          endDate,
          current: isCurrent,
          bullets: [],
        };
        continue;
      }

      if ((line.startsWith('- ') || line.startsWith('* ')) && currentExp) {
        currentExp.bullets = currentExp.bullets || [];
        currentExp.bullets.push(line.replace(/^[-*]\s+/, '').trim());
        continue;
      }
    }

    // Inside Skills
    if (currentSection === 'skills') {
      if (line.includes(':')) {
        const [category, itemsStr] = line.split(':');
        const items = itemsStr
          .split(',')
          .map((i) => i.trim().replace(/^[-*]\s+/, ''))
          .filter(Boolean);
        result.skills.push({
          id: `skill-${result.skills.length + 1}`,
          category: category.replace(/^[-*]\s+/, '').trim(),
          items,
        });
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const clean = line.replace(/^[-*]\s+/, '').trim();
        const items = clean.split(',').map((i) => i.trim()).filter(Boolean);
        result.skills.push({
          id: `skill-${result.skills.length + 1}`,
          category: 'Core Competencies',
          items: items.length > 0 ? items : [clean],
        });
      }
      continue;
    }

    // Inside Education
    if (currentSection === 'education') {
      if (line.startsWith('### ') || line.includes('|')) {
        if (currentEdu && currentEdu.institution) {
          result.education.push({
            id: `edu-${result.education.length + 1}`,
            institution: currentEdu.institution,
            degree: currentEdu.degree || 'Degree',
            field: currentEdu.field || '',
            startDate: currentEdu.startDate || '',
            endDate: currentEdu.endDate || '',
            gpa: currentEdu.gpa,
            highlights: currentEdu.highlights,
          });
        }
        const clean = line.replace(/^###\s+/, '').trim();
        const parts = clean.split('|').map((s) => s.trim());
        currentEdu = {
          institution: parts[0] || 'University',
          degree: parts[1] || 'Degree',
          field: parts[2] || '',
          startDate: '',
          endDate: parts[3] || '',
        };
        continue;
      } else if (!currentEdu) {
        currentEdu = {
          institution: line,
          degree: 'Degree',
          field: '',
          startDate: '',
          endDate: '',
        };
      }
      continue;
    }

    // Inside Projects
    if (currentSection === 'projects') {
      if (line.startsWith('### ') || (!line.startsWith('- ') && line.includes('|'))) {
        if (currentProj && currentProj.name) {
          result.projects.push({
            id: `proj-${result.projects.length + 1}`,
            name: currentProj.name,
            role: currentProj.role,
            technologies: currentProj.technologies || [],
            link: currentProj.link,
            bullets: currentProj.bullets || [],
          });
        }
        const clean = line.replace(/^###\s+/, '').trim();
        const parts = clean.split('|').map((s) => s.trim());
        currentProj = {
          name: parts[0] || 'Project',
          link: parts[1] || '',
          technologies: parts[2] ? parts[2].split(',').map((t) => t.trim()) : [],
          bullets: [],
        };
        continue;
      }
      if ((line.startsWith('- ') || line.startsWith('* ')) && currentProj) {
        currentProj.bullets = currentProj.bullets || [];
        currentProj.bullets.push(line.replace(/^[-*]\s+/, '').trim());
      }
      continue;
    }

    // Inside Certifications
    if (currentSection === 'certifications') {
      const clean = line.replace(/^[-*]\s+/, '').trim();
      const parts = clean.split('|').map((s) => s.trim());
      result.certifications.push({
        id: `cert-${result.certifications.length + 1}`,
        name: parts[0] || clean,
        issuer: parts[1] || '',
        date: parts[2] || '',
      });
      continue;
    }
  }

  // Final commits
  if (summaryLines.length > 0) {
    result.summary = summaryLines.join(' ');
  }
  if (currentExp && currentExp.role) {
    result.experience.push({
      id: `exp-${result.experience.length + 1}`,
      role: currentExp.role || 'Role',
      company: currentExp.company || 'Company',
      location: currentExp.location || '',
      startDate: currentExp.startDate || '',
      endDate: currentExp.endDate || '',
      current: !!currentExp.current,
      bullets: currentExp.bullets || [],
    });
  }
  if (currentEdu && currentEdu.institution) {
    result.education.push({
      id: `edu-${result.education.length + 1}`,
      institution: currentEdu.institution,
      degree: currentEdu.degree || 'Degree',
      field: currentEdu.field || '',
      startDate: currentEdu.startDate || '',
      endDate: currentEdu.endDate || '',
      gpa: currentEdu.gpa,
      highlights: currentEdu.highlights,
    });
  }
  if (currentProj && currentProj.name) {
    result.projects.push({
      id: `proj-${result.projects.length + 1}`,
      name: currentProj.name,
      role: currentProj.role,
      technologies: currentProj.technologies || [],
      link: currentProj.link,
      bullets: currentProj.bullets || [],
    });
  }

  // If parsing didn't find any experience or summary, fallback gracefully
  if (!result.contact.fullName) result.contact.fullName = defaultResume.contact.fullName;
  if (!result.summary && !result.experience.length) {
    return defaultResume;
  }

  return result;
}

/**
 * Serializes a StructuredResume back to clean ATS-compliant Markdown
 */
export function serializeStructuredResumeToMarkdown(resume: StructuredResume): string {
  const parts: string[] = [];

  // 1. Header & Contact
  parts.push(`# ${resume.contact.fullName || 'Candidate Name'}`);
  if (resume.contact.title) {
    parts.push(`**${resume.contact.title}**`);
  }

  const contactItems: string[] = [];
  if (resume.contact.location) contactItems.push(resume.contact.location);
  if (resume.contact.phone) contactItems.push(resume.contact.phone);
  if (resume.contact.email) contactItems.push(resume.contact.email);
  if (resume.contact.linkedin) contactItems.push(resume.contact.linkedin);
  if (resume.contact.github) contactItems.push(resume.contact.github);
  if (resume.contact.website) contactItems.push(resume.contact.website);

  if (contactItems.length > 0) {
    parts.push(contactItems.join(' | '));
  }
  parts.push('');

  // 2. Sections based on sectionOrder
  const sections = resume.sectionOrder || ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'];

  sections.forEach((sec) => {
    if (sec === 'summary' && resume.summary) {
      parts.push('## Professional Summary');
      parts.push(resume.summary.trim());
      parts.push('');
    }

    if (sec === 'experience' && resume.experience.length > 0) {
      parts.push('## Work Experience');
      resume.experience.forEach((exp) => {
        const dates = [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ');
        const headerParts = [exp.role, exp.company, exp.location, dates].filter(Boolean);
        parts.push(`### ${headerParts.join(' | ')}`);
        if (exp.bullets && exp.bullets.length > 0) {
          exp.bullets.forEach((b) => {
            if (b.trim()) parts.push(`- ${b.trim()}`);
          });
        }
        parts.push('');
      });
    }

    if (sec === 'skills' && resume.skills.length > 0) {
      parts.push('## Skills');
      resume.skills.forEach((cat) => {
        if (cat.items.length > 0) {
          parts.push(`- **${cat.category}**: ${cat.items.join(', ')}`);
        }
      });
      parts.push('');
    }

    if (sec === 'projects' && resume.projects.length > 0) {
      parts.push('## Key Projects');
      resume.projects.forEach((proj) => {
        const headerParts = [proj.name, proj.role, proj.link].filter(Boolean);
        parts.push(`### ${headerParts.join(' | ')}`);
        if (proj.technologies && proj.technologies.length > 0) {
          parts.push(`*Tech Stack: ${proj.technologies.join(', ')}*`);
        }
        if (proj.bullets && proj.bullets.length > 0) {
          proj.bullets.forEach((b) => {
            if (b.trim()) parts.push(`- ${b.trim()}`);
          });
        }
        parts.push('');
      });
    }

    if (sec === 'education' && resume.education.length > 0) {
      parts.push('## Education');
      resume.education.forEach((edu) => {
        const degField = [edu.degree, edu.field].filter(Boolean).join(' in ');
        const dates = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
        const headerParts = [degField, edu.institution, dates].filter(Boolean);
        parts.push(`### ${headerParts.join(' | ')}`);
        if (edu.gpa) parts.push(`- GPA: ${edu.gpa}`);
        if (edu.highlights) parts.push(`- ${edu.highlights}`);
        parts.push('');
      });
    }

    if (sec === 'certifications' && resume.certifications.length > 0) {
      parts.push('## Certifications');
      resume.certifications.forEach((cert) => {
        const certParts = [cert.name, cert.issuer, cert.date].filter(Boolean);
        parts.push(`- ${certParts.join(' | ')}`);
      });
      parts.push('');
    }

    if (sec.startsWith('custom_') || sec === 'custom') {
      const custom = resume.customSections.find((c) => `custom_${c.id}` === sec || c.id === sec);
      if (custom) {
        parts.push(`## ${custom.title}`);
        custom.items.forEach((item) => {
          parts.push(`- ${item}`);
        });
        parts.push('');
      }
    }
  });

  return parts.join('\n');
}
