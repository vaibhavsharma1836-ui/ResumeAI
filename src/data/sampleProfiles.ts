import { StructuredResume } from '../types';

export interface SampleProfile {
  id: string;
  name: string;
  role: string;
  experienceLevel: string;
  resume: StructuredResume;
  targetJobDescription: string;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'software-engineer',
    name: 'Alex Rivera',
    role: 'Senior Full Stack Software Engineer',
    experienceLevel: '6+ Years Experience',
    resume: {
      contact: {
        fullName: 'Alex Rivera',
        title: 'Senior Full Stack Engineer',
        email: 'alex.rivera.dev@gmail.com',
        phone: '+1 (415) 890-2341',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexrivera-dev',
        github: 'github.com/alexrivera-tech',
        website: 'alexrivera.io'
      },
      summary: 'Results-driven Senior Full Stack Engineer with 6+ years of experience architecting resilient distributed web systems and high-throughput microservices. Proven expertise in React, TypeScript, Node.js, and AWS cloud environments. Passionate about engineering velocity, sub-second API performance, and building accessible, customer-obsessed user interfaces.',
      accentColor: '#4f46e5',
      fontFamily: 'sans',
      spacingDensity: 'normal',
      headerStyle: 'accent-bar',
      sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
      experience: [
        {
          id: 'exp-1',
          role: 'Senior Software Engineer',
          company: 'Starlight Cloud Platforms',
          location: 'San Francisco, CA',
          startDate: 'Mar 2022',
          endDate: '',
          current: true,
          bullets: [
            'Architected and deployed high-throughput event processing pipeline using Node.js, Kafka, and Redis, processing 4.5M+ events/day with 99.99% uptime.',
            'Spearheaded frontend migration from legacy SPA to modern React/Next.js architecture, improving Core Web Vitals and cutting initial bundle size by 44%.',
            'Engineered automated CI/CD deployment pipelines on GitHub Actions with containerized Docker runners, slashing deployment time from 35 mins to 8 mins.',
            'Mentored 5 junior and mid-level engineers through structured bi-weekly code reviews and technical architecture design workshops.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Full Stack Software Engineer',
          company: 'Nexus FinTech Solutions',
          location: 'San Jose, CA',
          startDate: 'Jun 2019',
          endDate: 'Feb 2022',
          current: false,
          bullets: [
            'Engineered real-time financial transaction dashboard using React, TypeScript, and WebSocket feeds serving 85,000+ daily active institutional traders.',
            'Optimized PostgreSQL query schemas and added composite indexing, reducing p95 database response latency by 38% under high load.',
            'Constructed secure REST and GraphQL APIs adhering to PCI-DSS compliance standards and strict token authorization workflows.'
          ]
        }
      ],
      skills: [
        {
          id: 'skill-1',
          category: 'Languages & Frameworks',
          items: ['TypeScript', 'JavaScript (ES6+)', 'React', 'Next.js', 'Node.js', 'Python', 'Go', 'GraphQL']
        },
        {
          id: 'skill-2',
          category: 'Cloud & DevOps',
          items: ['AWS (ECS, Lambda, S3, RDS)', 'Docker', 'Kubernetes', 'CI/CD (GitHub Actions)', 'Terraform', 'PostgreSQL', 'Redis']
        },
        {
          id: 'skill-3',
          category: 'Testing & Tooling',
          items: ['Jest', 'Playwright', 'Vitest', 'Webpack/Vite', 'Git', 'Datadog', 'RESTful API Design']
        }
      ],
      projects: [
        {
          id: 'proj-1',
          name: 'HyperScale Metrics Visualizer',
          role: 'Lead Architect',
          technologies: ['React', 'TypeScript', 'D3.js', 'Go', 'WebSockets'],
          link: 'github.com/alexrivera-tech/hyperscale-metrics',
          bullets: [
            'Open-source telemetry dashboard rendering 100,000+ concurrent data points at 60 FPS using HTML5 Canvas and WebGL acceleration.',
            'Acquired 1,200+ GitHub stars and adopted by 14 startup developer teams for cluster monitoring.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2015',
          endDate: '2019',
          gpa: '3.82 / 4.0',
          highlights: 'Dean’s Honor List (4 semesters), President of ACM Student Chapter'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          date: '2023'
        },
        {
          id: 'cert-2',
          name: 'Certified Kubernetes Application Developer (CKAD)',
          issuer: 'Cloud Native Computing Foundation',
          date: '2022'
        }
      ],
      customSections: []
    },
    targetJobDescription: `We are looking for a Senior Full Stack Software Engineer to build and scale our next-generation cloud collaboration platform. 

Requirements:
- 5+ years of experience with modern TypeScript, React, and Node.js
- Strong background in distributed systems, microservices, and event-driven architecture (Kafka/Redis)
- Hands-on experience with AWS cloud infrastructure, Docker, and CI/CD pipelines
- Proven ability to write clean, tested, maintainable code with high performance benchmarks
- Experience mentoring junior engineers and conducting architectural reviews
- Familiarity with PostgreSQL optimization and GraphQL APIs`
  },
  {
    id: 'product-manager',
    name: 'Sophia Chen',
    role: 'Lead Product Manager',
    experienceLevel: '7+ Years Experience',
    resume: {
      contact: {
        fullName: 'Sophia Chen',
        title: 'Lead Product Manager',
        email: 'sophia.chen.pm@gmail.com',
        phone: '+1 (206) 555-0194',
        location: 'Seattle, WA',
        linkedin: 'linkedin.com/in/sophiachen-pm',
        github: '',
        website: 'sophiachen.co'
      },
      summary: 'Data-informed Lead Product Manager with 7+ years of track record driving product discovery, customer journey optimization, and revenue scaling in high-growth B2B SaaS. Proven leader in cross-functional team alignment, agile product delivery, and experimentation frameworks that translate user friction into multi-million dollar business outcomes.',
      accentColor: '#059669',
      fontFamily: 'sans',
      spacingDensity: 'normal',
      headerStyle: 'pill',
      sectionOrder: ['summary', 'experience', 'skills', 'education', 'certifications', 'projects'],
      experience: [
        {
          id: 'exp-1',
          role: 'Lead Product Manager',
          company: 'Elevate Cloud SaaS',
          location: 'Seattle, WA',
          startDate: 'Jan 2022',
          endDate: '',
          current: true,
          bullets: [
            'Spearheaded the zero-to-one launch of Enterprise Collaboration Hub, acquiring 65,000+ active users and generating $2.8M ARR in year one.',
            'Instituted continuous customer discovery cadence with 80+ customer interviews and usability tests, defining high-impact quarterly roadmap priorities.',
            'Championed pricing & packaging tier overhaul across self-serve and enterprise funnels, lifting overall free-to-paid conversion rate by 22%.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Senior Product Manager',
          company: 'Vanguard Analytics',
          location: 'Seattle, WA',
          startDate: 'May 2018',
          endDate: 'Dec 2021',
          current: false,
          bullets: [
            'Led cross-functional scrum squad of 12 engineers and 2 product designers, consistently delivering sprint commitments on schedule across 18 release cycles.',
            'Instrumented Amplitude and Mixpanel event telemetry to identify onboarding bottlenecks, resulting in a 19% increase in 30-day user retention.',
            'Conducted competitive benchmarking and market research to position automated reporting product line against industry leaders.'
          ]
        }
      ],
      skills: [
        {
          id: 'skill-1',
          category: 'Product Strategy & Discovery',
          items: ['Product Roadmap', 'User Journey Mapping', 'GTM Strategy', 'A/B Testing & Experimentation', 'Customer Discovery Interviews']
        },
        {
          id: 'skill-2',
          category: 'Analytics & Tools',
          items: ['SQL', 'Mixpanel', 'Amplitude', 'Google Analytics 4', 'Jira', 'Figma', 'Tableau', 'Linear']
        },
        {
          id: 'skill-3',
          category: 'Leadership & Methodology',
          items: ['Agile / Scrum', 'Cross-Functional Leadership', 'Sprint Planning', 'Stakeholder Management', 'OKRs']
        }
      ],
      projects: [],
      education: [
        {
          id: 'edu-1',
          institution: 'University of Washington',
          degree: 'Bachelor of Science',
          field: 'Informatics & Human-Computer Interaction',
          startDate: '2014',
          endDate: '2018',
          gpa: '3.89 / 4.0'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'Certified Scrum Product Owner (CSPO)',
          issuer: 'Scrum Alliance',
          date: '2021'
        },
        {
          id: 'cert-2',
          name: 'Reforge Product Strategy Certificate',
          issuer: 'Reforge',
          date: '2022'
        }
      ],
      customSections: []
    },
    targetJobDescription: `We are seeking an experienced Lead Product Manager to guide our flagship SaaS platform.

Key Responsibilities:
- Lead product vision, strategy, and execution for core workflows
- Partner with Engineering, Design, and Marketing to ship high-impact features
- Use qualitative feedback and quantitative product analytics (Mixpanel/Amplitude/SQL) to drive roadmaps
- Manage sprint prioritization in Agile environments and measure OKR success metrics`
  },
  {
    id: 'data-scientist',
    name: 'Marcus Vance',
    role: 'Staff Data Scientist & ML Engineer',
    experienceLevel: '8+ Years Experience',
    resume: {
      contact: {
        fullName: 'Marcus Vance, Ph.D.',
        title: 'Staff Data Scientist & ML Engineer',
        email: 'marcus.vance.data@gmail.com',
        phone: '+1 (617) 495-1000',
        location: 'Boston, MA',
        linkedin: 'linkedin.com/in/marcusvance-data',
        github: 'github.com/marcusvance-ml',
        website: 'marcusvance.ai'
      },
      summary: 'Staff Data Scientist and Machine Learning Engineer with 8+ years of experience engineering production predictive models, deep learning architectures, and scalable data infrastructure. Proven track record turning petabyte-scale data into actionable business intelligence, customer propensity models, and automated algorithmic pipelines.',
      accentColor: '#1e3a8a',
      fontFamily: 'sans',
      spacingDensity: 'normal',
      headerStyle: 'shaded',
      sectionOrder: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications'],
      experience: [
        {
          id: 'exp-1',
          role: 'Staff Data Scientist',
          company: 'Aura AI Technologies',
          location: 'Boston, MA',
          startDate: 'Feb 2021',
          endDate: '',
          current: true,
          bullets: [
            'Architected real-time recommendation engine in PyTorch and Triton Server, elevating customer personalization CTR by 31% across 10M+ sessions.',
            'Engineered automated feature store and training pipeline using Apache Spark, Snowflake, and MLflow, reducing model iteration cycle time by 60%.',
            'Mentored a team of 6 Data Scientists on statistical rigorous A/B testing methodologies and Bayesian inference.'
          ]
        },
        {
          id: 'exp-2',
          role: 'Senior Machine Learning Scientist',
          company: 'QuantEdge Analytics',
          location: 'Cambridge, MA',
          startDate: 'Sep 2017',
          endDate: 'Jan 2021',
          current: false,
          bullets: [
            'Developed supervised gradient-boosted ensemble models (XGBoost/LightGBM) to forecast churn risk, preserving $1.9M in recurring subscriptions.',
            'Implemented automated data cleaning and anomaly detection pipelines in Python processing 4TB daily streaming records.'
          ]
        }
      ],
      skills: [
        {
          id: 'skill-1',
          category: 'Machine Learning & AI',
          items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'LLMs', 'Transformer Models', 'NLP', 'Computer Vision']
        },
        {
          id: 'skill-2',
          category: 'Data & Big Data Engineering',
          items: ['Python', 'SQL', 'Apache Spark', 'Snowflake', 'dbt', 'Airflow', 'Kafka', 'Pandas', 'NumPy']
        },
        {
          id: 'skill-3',
          category: 'Cloud & MLOps',
          items: ['AWS (SageMaker, S3, EMR)', 'MLflow', 'Docker', 'Kubernetes', 'Git', 'CI/CD']
        }
      ],
      projects: [],
      education: [
        {
          id: 'edu-1',
          institution: 'Massachusetts Institute of Technology (MIT)',
          degree: 'Ph.D. in Computational Science & Engineering',
          field: 'Machine Learning & Statistical Modeling',
          startDate: '2013',
          endDate: '2017',
          gpa: '3.96 / 4.0'
        }
      ],
      certifications: [],
      customSections: []
    },
    targetJobDescription: `Looking for a Senior/Staff Data Scientist to build production machine learning systems, recommendation models, and predictive analytics pipelines using Python, PyTorch, SQL, and AWS.`
  }
];
