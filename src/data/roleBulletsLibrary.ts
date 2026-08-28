export interface RoleBulletCategory {
  id: string;
  title: string;
  iconName: string;
  bullets: string[];
}

export const ROLE_BULLETS_LIBRARY: RoleBulletCategory[] = [
  {
    id: 'swe-fullstack',
    title: 'Full Stack & Software Engineering',
    iconName: 'Code',
    bullets: [
      'Architected and deployed scalable microservices in TypeScript/Node.js, reducing API p99 latency by 35% across 2M+ daily requests.',
      'Spearheaded frontend overhaul using React and Next.js, elevating Lighthouse performance score from 62 to 98 and improving retention by 18%.',
      'Engineered automated CI/CD pipeline with GitHub Actions and Docker, accelerating weekly release cycles from 4 hours to under 12 minutes.',
      'Refactored monolithic PostgreSQL database with indexed partitioning, slashing query execution time by 42% on high-volume tables.',
      'Designed end-to-end OAuth 2.0 and JWT authentication system with role-based access control, safeguarding 150K+ active enterprise users.',
      'Authored comprehensive unit and integration test suites in Jest/Playwright, boosting test coverage from 45% to 88% and eliminating regression defects.'
    ]
  },
  {
    id: 'product-management',
    title: 'Product Management',
    iconName: 'Target',
    bullets: [
      'Spearheaded product discovery and GTM launch for core SaaS feature, acquiring 45,000+ active users within first 90 days.',
      'Defined and executed 12-month product roadmap based on user telemetry and 60+ customer interviews, increasing annual recurring revenue (ARR) by $1.4M.',
      'Instituted weekly sprint prioritization and cross-functional agile rituals across 14 engineers and designers, lifting sprint velocity by 28%.',
      'Orchestrated pricing and tier restructuring initiative, improving free-to-paid conversion rate by 3.2 percentage points.',
      'Instrumented Mixpanel and Amplitude event tracking to measure funnel drop-offs, driving a 22% uplift in day-30 user activation.',
      'Led stakeholder alignment meetings with executive leadership, sales, and customer success to synthesize feature requirements and manage scope.'
    ]
  },
  {
    id: 'data-ai-ml',
    title: 'Data Science & Machine Learning',
    iconName: 'Brain',
    bullets: [
      'Trained and deployed transformer-based NLP recommendation model in PyTorch, boosting customer click-through rate (CTR) by 24%.',
      'Constructed automated ETL data pipelines in Apache Airflow processing 10TB+ daily data into Snowflake data warehouse.',
      'Engineered customer churn prediction model with XGBoost, identifying at-risk accounts with 86% precision and preserving $850K in ARR.',
      'Designed and analyzed statistical A/B test experiments on homepage redesign across 400K concurrent sessions, validating a 7.4% lift in checkouts.',
      'Standardized centralized metric reporting with dbt and Tableau dashboards, reducing weekly analytics request backlog by 50%.'
    ]
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Cloud Infrastructure',
    iconName: 'Cloud',
    bullets: [
      'Architected multi-region AWS infrastructure using Terraform and Kubernetes (EKS), maintaining 99.99% uptime across peak seasonal traffic.',
      'Optimized AWS cloud infrastructure spending by auditing idle instances and migrating workloads to Spot fleets, saving $120,000 annually.',
      'Implemented zero-trust security policies, secrets rotation, and automated vulnerability scanning, achieving SOC 2 Type II compliance.',
      'Configured centralized observability stack using Prometheus, Grafana, and Datadog, decreasing Mean Time to Detection (MTTD) by 60%.'
    ]
  },
  {
    id: 'marketing-growth',
    title: 'Marketing, Growth & SEO',
    iconName: 'TrendingUp',
    bullets: [
      'Orchestrated multi-channel paid acquisition strategy across Google Ads and LinkedIn, decreasing Customer Acquisition Cost (CAC) by 26%.',
      'Executed programmatic SEO content campaign ranking for 1,200+ high-intent keywords, doubling organic inbound traffic from 80K to 190K monthly visits.',
      'Pioneered lifecycle email onboarding workflow in HubSpot with behavioral triggers, increasing trial-to-customer conversion by 19%.',
      'Managed $350K quarterly digital advertising budget, consistently exceeding ROAS target by 1.8x.'
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX & Product Design',
    iconName: 'Palette',
    bullets: [
      'Designed unified design system in Figma encompassing 120+ accessible components, cutting frontend UI delivery time by 30%.',
      'Conducted 35+ moderated usability testing sessions and translated qualitative feedback into intuitive mobile-first navigation overhaul.',
      'Created interactive prototypes and developer handoff specifications with zero design discrepancy across iOS and Web applications.'
    ]
  },
  {
    id: 'sales-cs',
    title: 'Sales & Customer Success',
    iconName: 'Users',
    bullets: [
      'Exceeded annual quota by 135%, closing $1.8M in enterprise contracts across B2B SaaS target accounts.',
      'Managed client portfolio of 40+ strategic enterprise accounts, maintaining a 112% Net Revenue Retention (NRR) rate.',
      'Standardized onboarding journey for enterprise clients, shortening time-to-value from 45 days to 18 days and reducing year-1 churn.'
    ]
  }
];
