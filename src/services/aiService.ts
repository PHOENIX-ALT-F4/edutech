import { StudentProfile, InterviewQuestion, InterviewAnswer } from '../types/viora';

export async function extractResumeSkillsAPI(resumeText: string): Promise<string[]> {
  try {
    const res = await fetch('/api/extract-resume-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.skills) && data.skills.length > 0) {
        return data.skills;
      }
    }
  } catch (err) {
    console.warn('Backend extract call failed, using client-side parser:', err);
  }

  // Client-side extraction fallback
  const techDictionary = [
    'React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'Express',
    'Python', 'Django', 'FastAPI', 'Flask', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Firebase', 'Next.js',
    'Tailwind CSS', 'Redux', 'Redux Toolkit', 'GraphQL', 'REST APIs', 'Jest', 'Cypress',
    'Playwright', 'Vitest', 'C++', 'Java', 'Spring Boot', 'Linux', 'CI/CD', 'Pandas',
    'NumPy', 'TensorFlow', 'Postman', 'Vite'
  ];

  const found = techDictionary.filter(tech =>
    new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i').test(resumeText)
  );

  return found.length > 0 ? found : ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Git', 'REST APIs'];
}

export async function generateInterviewQuestionsAPI(profile: StudentProfile): Promise<InterviewQuestion[]> {
  try {
    const res = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentProfile: profile }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length >= 5) {
        return data.questions;
      }
    }
  } catch (err) {
    console.warn('Backend questions call failed, using local adaptive generator:', err);
  }

  // Local adaptive generation
  const primaryRepo = profile.githubRepos[0]?.name || 'recent repository';
  const hasReact = profile.extractedSkills.some(s => /react/i.test(s));
  const hasPython = profile.extractedSkills.some(s => /python/i.test(s));
  const role = profile.targetRole || 'Frontend Developer';

  return [
    {
      id: 'q1',
      type: 'project_verification',
      contextTag: `Based on your "${primaryRepo}" project`,
      question: `In your "${primaryRepo}" repository, how did you organize your components or modules and manage data flow between them?`,
      hint: 'Describe your directory structure, component hierarchy, or how data moves across parts of the application.',
      targetSkill: hasReact ? 'React' : (hasPython ? 'Python' : 'Code Architecture'),
      sourceRepo: profile.githubRepos[0]?.name
    },
    {
      id: 'q2',
      type: 'technology_understanding',
      contextTag: `To understand your ${hasReact ? 'React & State' : 'Core Data'} experience`,
      question: hasReact
        ? 'You listed React on your resume. When would you use local component state versus a global state manager (like Context or Redux)?'
        : 'You listed Python on your resume. When would you use a dictionary / hash map instead of a list, and why?',
      hint: 'Think about performance, prop drilling, and access frequency.',
      targetSkill: hasReact ? 'State Management' : 'Data Structures'
    },
    {
      id: 'q3',
      type: 'role_based',
      contextTag: `For your ${role} goal`,
      question: `As someone targeting ${role}, how would you diagnose and improve loading speed or responsiveness in your application?`,
      hint: 'Mention code splitting, image/asset optimization, caching, or reducing re-renders.',
      targetSkill: 'Performance Optimization'
    },
    {
      id: 'q4',
      type: 'problem_solving',
      contextTag: 'Practical scenario',
      question: 'Your API request succeeds in Postman with status 200, but fails or renders blank in your frontend application. What are the first three things you would check?',
      hint: 'Consider CORS errors, asynchronous state updates, JSON response structure mismatches, or network tab inspection.',
      targetSkill: 'API Integration & Debugging'
    },
    {
      id: 'q5',
      type: 'growth',
      contextTag: 'Evidence growth question',
      question: `Your public GitHub repositories show interesting features, but limited automated testing. If you were to add unit tests to "${primaryRepo}", which component or function would you test first and how?`,
      hint: 'Pick a critical user interaction or calculation, and describe what inputs and expected outputs you would assert.',
      targetSkill: 'Testing & QA'
    },
    {
      id: 'q6',
      type: 'role_based',
      contextTag: `Deepening technical readiness for ${role}`,
      question: 'How do you structure error boundaries and fallback states so that when a server or unexpected bug occurs, the student or user still receives a friendly, graceful interface?',
      hint: 'Mention try/catch blocks, error boundary components, fallback skeletons, or friendly status notifications.',
      targetSkill: 'Error Handling & Resilience'
    }
  ];
}

export async function evaluateInterviewAPI(
  profile: StudentProfile,
  questions: InterviewQuestion[],
  answers: InterviewAnswer[]
): Promise<any> {
  try {
    const res = await fetch('/api/evaluate-interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentProfile: profile, questions, answers }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend evaluation call failed, using fallback synthesizer:', err);
  }

  return null;
}
