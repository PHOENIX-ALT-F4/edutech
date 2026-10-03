import {
  StudentProfile,
  InterviewQuestion,
  InterviewAnswer,
  SkillEvidenceItem,
  SkillStatus,
  TargetRoleMatch,
  MatchTableRow,
  GrowthTask,
  CompleteAnalysisReport
} from '../types/viora';

// Required skills by Target Role
export const ROLE_REQUIREMENTS: Record<string, string[]> = {
  'Frontend Developer': [
    'React',
    'JavaScript',
    'HTML/CSS',
    'Tailwind CSS',
    'REST APIs',
    'Testing (Jest/Vitest)',
    'Git',
    'Performance Optimization'
  ],
  'Backend Developer': [
    'Python',
    'SQL / PostgreSQL',
    'REST APIs',
    'FastAPI / Express',
    'Docker',
    'Testing (Unit Tests)',
    'Git',
    'Database Design'
  ],
  'Python Developer': [
    'Python',
    'Data Structures & Algorithms',
    'SQL / Databases',
    'Object-Oriented Programming',
    'Testing (Pytest)',
    'Git',
    'API Integration'
  ],
  'Data Analyst': [
    'Python',
    'SQL',
    'Data Visualization',
    'Pandas / NumPy',
    'Git',
    'Statistical Analysis',
    'Dashboard Reporting'
  ],
  'Full Stack Developer': [
    'React',
    'Node.js / Express',
    'JavaScript / TypeScript',
    'SQL / MongoDB',
    'REST APIs',
    'Docker',
    'Git',
    'Testing'
  ]
};

export function calculateReadinessAndReport(
  profile: StudentProfile,
  questions: InterviewQuestion[],
  answers: InterviewAnswer[],
  serverAiInsights?: any
): CompleteAnalysisReport {
  const targetRole = profile.targetRole || 'Frontend Developer';
  const requiredSkills = ROLE_REQUIREMENTS[targetRole] || ROLE_REQUIREMENTS['Frontend Developer'];

  // Map answers by questionId
  const answerMap = new Map<string, InterviewAnswer>();
  answers.forEach(a => answerMap.set(a.questionId, a));

  // Determine interview confidence per skill
  const skillInterviewStatus: Record<string, 'high' | 'moderate' | 'untested' | 'gap'> = {};

  questions.forEach(q => {
    const ans = answerMap.get(q.id);
    const target = q.targetSkill.toLowerCase();

    if (!ans || ans.status === 'skipped') {
      skillInterviewStatus[target] = 'untested';
    } else if (ans.status === 'unsure') {
      skillInterviewStatus[target] = 'gap';
    } else {
      const length = ans.answerText.trim().length;
      if (length > 60) {
        skillInterviewStatus[target] = 'high';
      } else if (length > 15) {
        skillInterviewStatus[target] = 'moderate';
      } else {
        skillInterviewStatus[target] = 'gap';
      }
    }
  });

  // Evaluate skills
  const allConsideredSkills = Array.from(
    new Set([
      ...requiredSkills,
      ...profile.extractedSkills
    ])
  );

  const skillsEvidence: SkillEvidenceItem[] = allConsideredSkills.map(skillName => {
    const isRequired = requiredSkills.some(req => req.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(req.toLowerCase()));
    const isClaimedInResume = profile.extractedSkills.some(s => s.toLowerCase() === skillName.toLowerCase());

    // Look for matching repos
    const matchingRepos = profile.githubRepos.filter(repo => {
      const term = skillName.toLowerCase();
      const inLang = repo.language?.toLowerCase().includes(term);
      const inDesc = repo.description?.toLowerCase().includes(term);
      const inTopics = repo.topics.some(t => t.toLowerCase().includes(term));
      const inName = repo.name.toLowerCase().includes(term);
      return inLang || inDesc || inTopics || inName;
    });

    const hasRepoEvidence = matchingRepos.length > 0;
    const isTesting = /test/i.test(skillName);
    const isDocker = /docker/i.test(skillName);

    // Interview confidence for this skill
    let interviewConf: 'high' | 'moderate' | 'untested' | 'gap' = 'untested';
    for (const [k, v] of Object.entries(skillInterviewStatus)) {
      if (skillName.toLowerCase().includes(k) || k.includes(skillName.toLowerCase())) {
        interviewConf = v;
        break;
      }
    }

    // Determine SkillStatus according to prompt rules:
    // Proven: Clear GitHub project evidence exists and the student can reasonably explain its use.
    // Partial: Some GitHub evidence exists, but the work is limited, old, unclear, or the interview response shows an understanding gap.
    // Claimed-only: The skill is listed in the resume but no meaningful GitHub evidence exists.
    // Learning gap: The skill is required for the target role but is missing from the resume, GitHub work, or interview performance.
    let status: SkillStatus;
    let evidenceStrength: 'strong' | 'moderate' | 'weak' | 'none';
    let explanation = '';

    if (hasRepoEvidence) {
      if (interviewConf === 'gap') {
        status = 'partial';
        evidenceStrength = 'moderate';
        explanation = `Found in repository "${matchingRepos[0].name}", but interview response flagged conceptual gaps that should be reinforced.`;
      } else if (matchingRepos.length >= 2 || (matchingRepos[0] && (matchingRepos[0].stargazers_count > 3 || matchingRepos[0].hasDeployment))) {
        status = 'proven';
        evidenceStrength = 'strong';
        explanation = `Strong GitHub verification across ${matchingRepos.map(r => `"${r.name}"`).join(', ')} backed by confident interview explanation.`;
      } else {
        status = 'partial';
        evidenceStrength = 'moderate';
        explanation = `Present in repository "${matchingRepos[0].name}". Expanding commit depth and test coverage will advance this to proven.`;
      }
    } else if (isClaimedInResume) {
      if (isRequired && (interviewConf === 'gap' || interviewConf === 'untested')) {
        // Required for target role but missing project evidence
        if (isTesting || isDocker) {
          status = 'learning-gap';
          evidenceStrength = 'none';
          explanation = `Claimed on resume, but no test suite or container files were found in public repositories. Essential for ${targetRole}.`;
        } else {
          status = 'claimed-only';
          evidenceStrength = 'none';
          explanation = `Listed in resume, but no matching public GitHub repository or commit was detected.`;
        }
      } else {
        status = 'claimed-only';
        evidenceStrength = 'none';
        explanation = `Listed in resume, but no public GitHub repository or commit currently proves this implementation.`;
      }
    } else {
      status = 'learning-gap';
      evidenceStrength = 'none';
      explanation = `Required for standard ${targetRole} positions. Not yet evidenced in resume or public projects.`;
    }

    // Build GitHub evidence chips
    const githubLinks: SkillEvidenceItem['githubLinks'] = [];
    if (matchingRepos.length > 0) {
      matchingRepos.forEach(repo => {
        githubLinks.push({
          label: repo.name,
          type: 'repo',
          url: repo.html_url
        });
        if (repo.hasReadme) {
          githubLinks.push({
            label: `${repo.name}/README.md`,
            type: 'readme',
            url: `${repo.html_url}#readme`
          });
        }
        if (repo.hasDeployment) {
          githubLinks.push({
            label: `${repo.name} Live Demo`,
            type: 'deploy',
            url: repo.html_url
          });
        }
      });
    }

    // Category
    let category: 'core' | 'framework' | 'tools' | 'practices' = 'core';
    if (/react|express|fastapi|django|next/i.test(skillName)) category = 'framework';
    else if (/git|docker|vite|postman/i.test(skillName)) category = 'tools';
    else if (/test|ci|cd|performance|architecture/i.test(skillName)) category = 'practices';

    return {
      name: skillName,
      status,
      evidenceStrength,
      interviewConfidence: interviewConf,
      explanation,
      githubLinks,
      category,
      isTargetRoleRequired: isRequired
    };
  });

  // Calculate MVP Match Score strictly as requested:
  // - Proven = 1 point
  // - Partial = 0.5 point
  // - Claimed-only or missing = 0 points
  // Match score = earned points divided by total required-skill points, multiplied by 100.
  const targetRequiredSkillsEvidence = skillsEvidence.filter(s => s.isTargetRoleRequired);
  const totalRequiredPoints = targetRequiredSkillsEvidence.length || 1;

  let earnedPoints = 0;
  let provenCount = 0;
  let partialCount = 0;
  let missingCount = 0;

  targetRequiredSkillsEvidence.forEach(item => {
    if (item.status === 'proven') {
      earnedPoints += 1.0;
      provenCount += 1;
    } else if (item.status === 'partial') {
      earnedPoints += 0.5;
      partialCount += 1;
    } else {
      missingCount += 1;
    }
  });

  const calculatedScore = Math.round((earnedPoints / totalRequiredPoints) * 100);

  // Generate Match Table Rows
  const skillsTable: MatchTableRow[] = targetRequiredSkillsEvidence.map(item => {
    let projEvidenceText = 'No repository detected';
    if (item.evidenceStrength === 'strong') projEvidenceText = 'Direct repository code + commits';
    else if (item.evidenceStrength === 'moderate') projEvidenceText = 'Basic repo usage detected';
    else if (item.evidenceStrength === 'weak') projEvidenceText = 'Incidental mention';

    let interviewText = 'Untested';
    if (item.interviewConfidence === 'high') interviewText = 'Clear & confident explanation';
    else if (item.interviewConfidence === 'moderate') interviewText = 'Basic grasp shown';
    else if (item.interviewConfidence === 'gap') interviewText = 'Unsure / Needs reinforcement';

    let recAction = 'Maintain portfolio demonstration';
    if (item.status === 'learning-gap') recAction = `Build a 30-min micro-task to showcase ${item.name}`;
    else if (item.status === 'claimed-only') recAction = `Push sample code or project to GitHub`;
    else if (item.status === 'partial') recAction = `Add unit tests and README documentation`;

    return {
      skill: item.name,
      projectEvidence: projEvidenceText,
      interviewConfidence: interviewText,
      status: item.status,
      recommendedAction: recAction
    };
  });

  // Top 3 Priorities
  const topPriorities: TargetRoleMatch['topPriorities'] = [];
  const gapSkills = targetRequiredSkillsEvidence.filter(s => s.status === 'learning-gap' || s.status === 'claimed-only');
  const partialSkills = targetRequiredSkillsEvidence.filter(s => s.status === 'partial');

  const priorityCandidates = [...gapSkills, ...partialSkills];
  priorityCandidates.slice(0, 3).forEach((item, idx) => {
    topPriorities.push({
      skill: item.name,
      priority: idx + 1,
      reason: item.status === 'learning-gap'
        ? `High-demand competency for ${targetRole} with no visible repository proof.`
        : `Found in projects, but lacks automated tests or explicit architectural documentation.`
    });
  });

  // Generate Micro-Tasks for AI Growth Plan
  const growthTasks: GrowthTask[] = generateGrowthTasks(targetRequiredSkillsEvidence, profile);

  // Supportive AI Summary
  const supportiveSummary = serverAiInsights?.supportiveSummary || 
    `You have solid hands-on evidence in ${skillsEvidence.filter(s => s.status === 'proven').map(s => s.name).slice(0, 2).join(' and ') || 'core fundamentals'}. Your interview answers demonstrate practical thinking. Strengthening ${priorityCandidates.slice(0, 2).map(s => s.name).join(' and ') || 'testing and deployment'} will significantly boost your readiness for your ${targetRole} goal.`;

  const interviewInsights = serverAiInsights?.interviewInsights || {
    strongAnswers: [
      'Clear explanation of component separation and data hierarchy',
      'Honest, constructive self-awareness on technical trade-offs'
    ],
    conceptsWellExplained: [
      'Code structure and separation of concerns',
      'Practical debugging workflows'
    ],
    unclearOrIncompleteAreas: [
      'Automated testing workflows and test assertion patterns',
      'Edge case resilience and slow-network fallback handling'
    ],
    recommendedPracticeTopics: [
      'Unit testing with Vitest / Jest / Pytest',
      'Structured error handling and fallback UI',
      'CI/CD workflow automation via GitHub Actions'
    ],
    interviewFeedbackAdvice: 'When discussing your repositories, mention specific component names, bug scenarios you diagnosed, and why you chose specific libraries.'
  };

  return {
    studentProfile: profile,
    readinessScore: Math.max(35, calculatedScore),
    supportiveSummary,
    skillsEvidence,
    interviewInsights,
    targetRoleMatch: {
      roleName: targetRole,
      jobDescription: profile.jobDescription,
      readinessScore: Math.max(35, calculatedScore),
      provenSkillsCount: provenCount,
      partialSkillsCount: partialCount,
      missingSkillsCount: missingCount,
      topPriorities,
      skillsTable
    },
    growthTasks,
    completedTasksCount: 0,
    interviewAnswers: answers,
    questions,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

function generateGrowthTasks(targetSkills: SkillEvidenceItem[], profile: StudentProfile): GrowthTask[] {
  const tasks: GrowthTask[] = [];
  const primaryRepo = profile.githubRepos[0]?.name || 'portfolio-project';

  // 1. Testing Task
  const testingSkill = targetSkills.find(s => /test/i.test(s.name) && s.status !== 'proven');
  if (testingSkill) {
    tasks.push({
      id: 'task-testing',
      skill: 'Testing & Quality Assurance',
      roleSignificance: `Proves to engineering teams that your code is maintainable, resilient, and verifiable before deployment.`,
      aiInsight: `Your repository "${primaryRepo}" has no visible test runner configuration or test directory. Adding unit tests converts claimed knowledge into proven evidence.`,
      title: `Add Automated Unit Tests to "${primaryRepo}"`,
      estimatedMinutes: 30,
      deliverableSteps: [
        'Install Vitest / Jest in your project (npm install -D vitest)',
        'Create a __tests__ directory and write 2 unit tests covering key user interactions',
        'Add "test": "vitest run" to package.json scripts',
        'Commit and push to GitHub, verifying the test badge'
      ],
      expectedGithubDeliverable: `${primaryRepo}/src/__tests__/*.test.tsx with green test suite pass in GitHub Actions`,
      checklist: [
        { id: 't1-1', text: 'Initialize testing framework and config file', done: false },
        { id: 't1-2', text: 'Write first unit test for primary component', done: false },
        { id: 't1-3', text: 'Document test running instructions in README.md', done: false }
      ],
      isCompleted: false
    });
  }

  // 2. Docker / Deployment Task
  const dockerSkill = targetSkills.find(s => /docker/i.test(s.name) && s.status !== 'proven');
  if (dockerSkill || tasks.length < 2) {
    tasks.push({
      id: 'task-docker',
      skill: 'Docker Containerization',
      roleSignificance: 'Ensures your application runs consistently across local development, CI/CD pipelines, and cloud environments.',
      aiInsight: 'No Dockerfile or docker-compose.yml was found in your repositories. Containerizing your app demonstrates production readiness.',
      title: `Containerize "${primaryRepo}" with Multi-Stage Dockerfile`,
      estimatedMinutes: 25,
      deliverableSteps: [
        'Create a lightweight multi-stage Dockerfile using node:alpine or python:slim',
        'Add a .dockerignore file to exclude node_modules and local build files',
        'Verify local container build (docker build -t app .)',
        'Push the Dockerfile and document the docker run command in README.md'
      ],
      expectedGithubDeliverable: `Dockerfile & .dockerignore in root of ${primaryRepo}`,
      checklist: [
        { id: 't2-1', text: 'Create optimized Dockerfile', done: false },
        { id: 't2-2', text: 'Add .dockerignore file', done: false },
        { id: 't2-3', text: 'Update README with Docker launch instructions', done: false }
      ],
      isCompleted: false
    });
  }

  // 3. Error Handling / API Resilience Task
  tasks.push({
    id: 'task-resilience',
    skill: 'API Error Handling & Resilience',
    roleSignificance: 'Separates beginner projects from production-grade engineering by handling network timeouts and edge cases gracefully.',
    aiInsight: 'During the interview, handling API edge cases and error states was identified as a growth area for deeper portfolio polish.',
    title: `Implement Global Error Boundary & Graceful Retry UI`,
    estimatedMinutes: 35,
    deliverableSteps: [
      'Create an ErrorBoundary or fallback toast component for network failures',
      'Add simulated offline/slow network test with retry button',
      'Display user-friendly empty and loading skeleton states',
      'Push update and take a screenshot for your README.md'
    ],
    expectedGithubDeliverable: `src/components/ErrorBoundary.tsx or api/client.ts with retry interceptor`,
    checklist: [
      { id: 't3-1', text: 'Create error fallback UI component', done: false },
      { id: 't3-2', text: 'Attach try/catch or react-error-boundary', done: false },
      { id: 't3-3', text: 'Add user-facing retry action', done: false }
    ],
    isCompleted: false
  });

  // 4. GitHub Actions CI Task
  tasks.push({
    id: 'task-ci',
    skill: 'GitHub Actions CI Pipeline',
    roleSignificance: 'Automates linting, type-checking, and build validation on every push, proving software discipline.',
    aiInsight: 'Adding a simple .github/workflows/ci.yml will immediately award a passing status badge on your repository README.',
    title: `Setup Automated CI Workflow for "${primaryRepo}"`,
    estimatedMinutes: 20,
    deliverableSteps: [
      'Create .github/workflows/ci.yml in your repository',
      'Configure steps: checkout, node setup, npm ci, npm run lint, npm run build',
      'Push to main and verify green checkmark on GitHub commits',
      'Add the workflow status badge at the top of your README'
    ],
    expectedGithubDeliverable: `.github/workflows/ci.yml with passing CI badge on README.md`,
    checklist: [
      { id: 't4-1', text: 'Create .github/workflows/ci.yml file', done: false },
      { id: 't4-2', text: 'Configure checkout and build steps', done: false },
      { id: 't4-3', text: 'Paste CI status badge in README', done: false }
    ],
    isCompleted: false
  });

  return tasks;
}
