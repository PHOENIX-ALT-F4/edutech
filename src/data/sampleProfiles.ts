import { StudentProfile } from '../types/viora';

export const SAMPLE_PROFILES: Record<string, StudentProfile> = {
  alex: {
    name: 'Alex Rivera',
    githubUsername: 'alexrivera-dev',
    resumeFileName: 'Alex_Rivera_Frontend_Resume.pdf',
    targetRole: 'Frontend Developer',
    jobDescription: 'Frontend Developer with strong React, JavaScript, modern CSS, component state management, responsive UI, REST API integration, and automated unit testing.',
    extractedSkills: [
      'React',
      'JavaScript',
      'TypeScript',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'Redux Toolkit',
      'REST APIs',
      'Git',
      'Jest',
      'Docker'
    ],
    resumeText: `ALEX RIVERA
Email: alex.rivera@edu.example.com | Portfolio: alexrivera.dev | GitHub: alexrivera-dev

EDUCATION
B.S. in Computer Science - State Tech University (Expected 2026)

TECHNICAL SKILLS
Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
Frameworks & Libraries: React, Redux Toolkit, Tailwind CSS, Next.js, Node.js
Tools & Platforms: Git, GitHub, Vite, Postman, Jest, Docker, Netlify

PROJECTS
1. E-Commerce Showcase (React, Tailwind CSS, Context API)
- Developed responsive shopping interface with persistent cart, category filtering, and mock checkout.
- Optimized bundle size using dynamic imports and lazy loading.

2. DevLog - Developer Notes App (TypeScript, React, LocalStorage)
- Built tag-based markdown note organizer with dark/light mode and instant search.

3. Weather Explorer (JavaScript, Fetch API, OpenWeather API)
- Real-time weather dashboard with 5-day forecast and geolocation fallback.`,
    githubRepos: [
      {
        name: 'e-commerce-showcase',
        description: 'Responsive React e-commerce catalog with search, cart state, and Tailwind CSS',
        language: 'TypeScript',
        topics: ['react', 'tailwind', 'ecommerce', 'cart-state'],
        stargazers_count: 7,
        forks_count: 2,
        updated_at: '2026-08-14T10:00:00Z',
        html_url: 'https://github.com/alexrivera-dev/e-commerce-showcase',
        hasTests: false,
        hasReadme: true,
        hasDeployment: true
      },
      {
        name: 'devlog-notes',
        description: 'Tag-based Markdown developer notes application with instant filtering',
        language: 'TypeScript',
        topics: ['react', 'typescript', 'notes', 'markdown'],
        stargazers_count: 12,
        forks_count: 3,
        updated_at: '2026-07-22T14:20:00Z',
        html_url: 'https://github.com/alexrivera-dev/devlog-notes',
        hasTests: false,
        hasReadme: true,
        hasDeployment: true
      },
      {
        name: 'weather-explorer',
        description: 'Clean responsive dashboard displaying global forecast data via OpenWeather API',
        language: 'JavaScript',
        topics: ['javascript', 'api-integration', 'css'],
        stargazers_count: 4,
        forks_count: 0,
        updated_at: '2026-06-05T09:12:00Z',
        html_url: 'https://github.com/alexrivera-dev/weather-explorer',
        hasTests: false,
        hasReadme: true,
        hasDeployment: false
      }
    ]
  },
  vasu: {
    name: 'Vasu Mishra',
    githubUsername: 'vasu639',
    resumeFileName: 'Vasu_Mishra_FullStack_Resume.pdf',
    targetRole: 'Full Stack Developer',
    jobDescription: 'Full Stack Developer skilled in React, Node.js, REST API design, database schemas, responsive UI, version control, and collaborative architecture.',
    extractedSkills: [
      'React',
      'JavaScript',
      'TypeScript',
      'Node.js',
      'Express',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'SQL',
      'MongoDB',
      'Git'
    ],
    resumeText: `VASU MISHRA
GitHub: github.com/vasu639 | EduTech & Full-Stack Developer

SUMMARY
Passionate software developer building intelligent, student-centric web applications and carbon impact tools. Experienced in React, Node.js, and modern full-stack workflows.

SKILLS
- Frontend: React, JavaScript, TypeScript, Tailwind CSS, HTML/CSS
- Backend: Node.js, Express, REST APIs, JSON APIs
- Databases: PostgreSQL, MongoDB, SQL
- Tools: Git, GitHub, Vite, Postman, Linux

FEATURED WORK
1. CARBONBRIDGE / Carbon_bridge: Full-stack platform calculating and bridging supply-chain carbon offsets.
2. Edvora: EduTech student learning platform and curriculum organizer.
3. GOALMATES: Peer accountability and collaborative goal-tracking web application.`,
    githubRepos: [
      {
        name: 'CARBONBRIDGE',
        description: 'Carbon emissions tracking and verifiable offset bridge for organizations',
        language: 'JavaScript',
        topics: ['react', 'fullstack', 'carbon-offset', 'sustainability'],
        stargazers_count: 6,
        forks_count: 1,
        updated_at: '2026-09-18T12:00:00Z',
        html_url: 'https://github.com/vasu639/CARBONBRIDGE',
        hasTests: false,
        hasReadme: true,
        hasDeployment: true
      },
      {
        name: 'Edvora-',
        description: 'EduTech student learning companion and portfolio curriculum repository',
        language: 'TypeScript',
        topics: ['edutech', 'student-learning', 'portfolio-growth'],
        stargazers_count: 3,
        forks_count: 0,
        updated_at: '2026-10-02T22:20:00Z',
        html_url: 'https://github.com/vasu639/Edvora-',
        hasTests: false,
        hasReadme: false,
        hasDeployment: false
      },
      {
        name: 'GOALMATES',
        description: 'Collaborative milestone sharing and goal alignment web app for students',
        language: 'JavaScript',
        topics: ['collaboration', 'goals', 'react', 'nodejs'],
        stargazers_count: 5,
        forks_count: 2,
        updated_at: '2026-08-01T15:10:00Z',
        html_url: 'https://github.com/vasu639/GOALMATES',
        hasTests: false,
        hasReadme: true,
        hasDeployment: false
      }
    ]
  },
  priya: {
    name: 'Priya Sharma',
    githubUsername: 'priyasharma-code',
    resumeFileName: 'Priya_Sharma_Backend_Resume.pdf',
    targetRole: 'Backend Developer',
    jobDescription: 'Backend Engineer proficient in Python, FastAPI, relational databases (SQL/PostgreSQL), Docker containerization, REST API design, and asynchronous background tasks.',
    extractedSkills: [
      'Python',
      'FastAPI',
      'SQL',
      'PostgreSQL',
      'Docker',
      'Git',
      'REST APIs',
      'Redis',
      'Pytest'
    ],
    resumeText: `PRIYA SHARMA
Backend Software Engineer | Python & Distributed Services
GitHub: priyasharma-code

TECHNICAL SKILLS
Languages: Python, SQL, Bash
Frameworks: FastAPI, Flask, SQLAlchemy, Pydantic
Databases: PostgreSQL, SQLite, Redis
DevOps & Tools: Docker, Git, Postman, Pytest, Linux

PROJECTS
1. FastMetrics API (FastAPI, PostgreSQL, Redis)
- High-throughput analytics ingestion API serving 1,000 requests/sec with Redis caching.
2. TaskQueue Microservice (Python, Celery, Docker)
- Background job processing worker for batch image resizing and report compilation.`,
    githubRepos: [
      {
        name: 'fastmetrics-api',
        description: 'Scalable FastAPI metrics service with PostgreSQL backend and Redis cache layer',
        language: 'Python',
        topics: ['python', 'fastapi', 'postgresql', 'redis'],
        stargazers_count: 15,
        forks_count: 4,
        updated_at: '2026-09-02T18:00:00Z',
        html_url: 'https://github.com/priyasharma-code/fastmetrics-api',
        hasTests: true,
        hasReadme: true,
        hasDeployment: true
      },
      {
        name: 'taskqueue-worker',
        description: 'Background task processor using Python, Celery, and Docker containers',
        language: 'Python',
        topics: ['python', 'celery', 'docker'],
        stargazers_count: 8,
        forks_count: 1,
        updated_at: '2026-07-15T11:00:00Z',
        html_url: 'https://github.com/priyasharma-code/taskqueue-worker',
        hasTests: false,
        hasReadme: true,
        hasDeployment: false
      }
    ]
  }
};
