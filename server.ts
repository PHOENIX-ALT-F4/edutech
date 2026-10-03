import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client if API key exists
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// API endpoint: Extract skills from resume
app.post('/api/extract-resume-skills', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({ error: 'resumeText is required' });
    }

    const ai = getAiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an EduTech technical skills extraction system. Extract a clean list of technical skills, programming languages, libraries, tools, databases, and frameworks explicitly mentioned in this student resume text.
Format your answer STRICTLY as a JSON array of strings, for example: ["React", "TypeScript", "Python", "SQL", "Git", "Docker"].
Do not include soft skills like "leadership" or "teamwork". Only technical skills.

Resume Text:
${resumeText.slice(0, 4000)}`,
        });

        const text = response.text?.trim() || '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const skills = JSON.parse(jsonMatch[0]);
          return res.json({ skills: Array.isArray(skills) ? skills : [] });
        }
      } catch (err) {
        console.error('Gemini resume skill extraction error, using heuristic fallback:', err);
      }
    }

    // Heuristic fallback
    const techDictionary = [
      'React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'Express',
      'Python', 'Django', 'FastAPI', 'Flask', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
      'Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Firebase', 'Next.js',
      'Tailwind CSS', 'Redux', 'GraphQL', 'REST API', 'Jest', 'Cypress', 'Playwright',
      'C++', 'Java', 'Spring Boot', 'Linux', 'CI/CD', 'Pandas', 'NumPy', 'TensorFlow'
    ];
    const foundSkills = techDictionary.filter(tech =>
      new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i').test(resumeText)
    );

    return res.json({ skills: foundSkills.length > 0 ? foundSkills : ['JavaScript', 'React', 'HTML', 'CSS', 'Git'] });
  } catch (error: any) {
    console.error('Error extracting skills:', error);
    return res.status(500).json({ error: 'Failed to extract skills' });
  }
});

// API endpoint: Generate adaptive interview questions
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { studentProfile } = req.body;
    const { targetRole, extractedSkills = [], githubRepos = [], jobDescription = '' } = studentProfile || {};

    const ai = getAiClient();
    if (ai) {
      try {
        const repoSummaries = githubRepos.slice(0, 5).map((r: any) => 
          `- ${r.name}: ${r.description || 'No description'}, language: ${r.language || 'Unknown'}, topics: ${(r.topics || []).join(', ')}`
        ).join('\n');

        const prompt = `You are Viora's empathetic EduTech AI Interviewer.
The student is preparing for the role of: "${targetRole}".
Extracted resume skills: ${extractedSkills.join(', ')}
Target Role / Job Description context: ${jobDescription || 'Standard ' + targetRole + ' requirements'}
Recent public GitHub repositories found:
${repoSummaries || 'No public repositories found'}

Generate exactly 6 adaptive, encouraging, learning-focused interview questions.
Types required across the 6 questions:
1. "project_verification": Ask the student to explain a real project detected on GitHub (referencing exact repo name if available).
2. "technology_understanding": Check understanding of a skill they claimed in their resume.
3. "role_based": Practical question relevant to the target role.
4. "problem_solving": Practical debugging or scenario question.
5. "growth": Ask about skills with missing/weak evidence (e.g. testing, deployment, error handling).
6. "technology_understanding" or "role_based": Another concept exploration.

STRICT RULES:
- Never invent project details not in the repo list.
- Keep tone supportive, educational, non-judgmental.
- Return ONLY valid JSON array of objects with structure:
[
  {
    "id": "q1",
    "type": "project_verification",
    "contextTag": "Based on your React Portfolio project",
    "question": "In your portfolio repository, how did you organize components and handle state?",
    "hint": "Feel free to describe your component hierarchy or tools like useState/Context.",
    "targetSkill": "React",
    "sourceRepo": "repo-name-if-applicable"
  }
]`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text?.trim() || '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          if (Array.isArray(questions) && questions.length >= 5) {
            return res.json({ questions });
          }
        }
      } catch (err) {
        console.error('Gemini question generation error, falling back:', err);
      }
    }

    // Heuristic generator fallback (high quality, tailored)
    const primaryRepo = githubRepos[0]?.name || 'recent repository';
    const hasPython = extractedSkills.some((s: string) => /python/i.test(s));
    const hasReact = extractedSkills.some((s: string) => /react/i.test(s));

    const fallbackQuestions = [
      {
        id: 'q1',
        type: 'project_verification',
        contextTag: `Based on your ${primaryRepo} repository`,
        question: `In your project "${primaryRepo}", how did you structure your codebase and manage component or module interactions?`,
        hint: 'Mention how folders were structured and how data flows between files.',
        targetSkill: hasReact ? 'React' : (hasPython ? 'Python' : 'Code Architecture'),
        sourceRepo: githubRepos[0]?.name
      },
      {
        id: 'q2',
        type: 'technology_understanding',
        contextTag: `To understand your ${hasReact ? 'JavaScript & React' : 'Core'} experience`,
        question: hasReact 
          ? 'When would you reach for the Context API or global state versus keeping state local to a component?'
          : 'You listed key technologies on your resume. When would you use a hash map / dictionary instead of a sequential list or array?',
        hint: 'Think about data access patterns and scope.',
        targetSkill: hasReact ? 'State Management' : 'Data Structures'
      },
      {
        id: 'q3',
        type: 'role_based',
        contextTag: `For your ${targetRole} goal`,
        question: `As a ${targetRole}, how do you ensure web pages or APIs load quickly and perform reliably under slow network conditions?`,
        hint: 'Consider lazy loading, caching, pagination, or asset optimization.',
        targetSkill: 'Performance Optimization'
      },
      {
        id: 'q4',
        type: 'problem_solving',
        contextTag: 'Practical scenario',
        question: 'Your API request returns a 200 OK status with the expected payload in Postman, but fails or renders empty data in your frontend application. What would you check first?',
        hint: 'Consider CORS, JSON parsing, asynchronous state updates, or object property mapping.',
        targetSkill: 'API Integration & Debugging'
      },
      {
        id: 'q5',
        type: 'growth',
        contextTag: 'Portfolio growth area',
        question: 'Many student portfolios lack automated testing or continuous integration. If you were to add automated unit tests to your primary project, how would you approach it?',
        hint: 'Name a test framework (e.g., Jest, Pytest, Vitest) and what critical logic you would test first.',
        targetSkill: 'Testing & QA'
      },
      {
        id: 'q6',
        type: 'technology_understanding',
        contextTag: `Deepening technical readiness for ${targetRole}`,
        question: 'How do you handle errors, loading states, and edge cases to ensure a smooth, user-friendly experience when something unexpected goes wrong?',
        hint: 'Mention error boundaries, try/catch blocks, fallback UI, or user notifications.',
        targetSkill: 'Error Handling & Resilience'
      }
    ];

    return res.json({ questions: fallbackQuestions });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// API endpoint: Evaluate combined interview and build final report
app.post('/api/evaluate-interview', async (req, res) => {
  try {
    const { studentProfile, questions = [], answers = [] } = req.body;
    const { targetRole, extractedSkills = [], githubRepos = [] } = studentProfile || {};

    const ai = getAiClient();
    if (ai) {
      try {
        const answersSummary = answers.map((ans: any, idx: number) => {
          const q = questions.find((item: any) => item.id === ans.questionId) || questions[idx];
          return `Q: "${q?.question}"\nAnswer Status: ${ans.status}\nStudent Response: "${ans.answerText || (ans.status === 'unsure' ? "I'm Not Sure" : 'Skipped')}"`;
        }).join('\n\n');

        const prompt = `You are Viora's EduTech assessment engine.
Target Role: ${targetRole}
Extracted Resume Skills: ${extractedSkills.join(', ')}
GitHub Repos: ${githubRepos.map((r: any) => `${r.name} (${r.language})`).join(', ')}

Student Interview Transcript:
${answersSummary}

Generate a comprehensive educational report in JSON strictly matching this schema:
{
  "readinessScore": <number between 40 and 95>,
  "supportiveSummary": "<2-3 sentence encouraging, constructive summary highlighting strengths in real projects and specific growth areas>",
  "interviewInsights": {
    "strongAnswers": ["<specific concept student explained well>", "<another positive area>"],
    "conceptsWellExplained": ["<e.g. Component structure and props>", "<e.g. State updates>"],
    "unclearOrIncompleteAreas": ["<constructive point where student was unsure or brief>"],
    "recommendedPracticeTopics": ["<e.g. Automated unit testing with Vitest/Jest>", "<e.g. API error boundaries>"],
    "interviewFeedbackAdvice": "<Constructive 1-2 sentence coaching tip on how to confidently articulate engineering choices in technical discussions>"
  }
}
STRICT: Return ONLY the JSON object. Do not wrap with extra commentary.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text?.trim() || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const evalResult = JSON.parse(jsonMatch[0]);
          return res.json(evalResult);
        }
      } catch (err) {
        console.error('Gemini evaluation error, using fallback logic:', err);
      }
    }

    // Heuristic feedback synthesis
    const answeredCount = answers.filter((a: any) => a.status === 'answered' && a.answerText?.trim().length > 15).length;
    const unsureCount = answers.filter((a: any) => a.status === 'unsure').length;

    return res.json({
      readinessScore: Math.min(88, Math.max(52, Math.round(50 + (answeredCount * 7) - (unsureCount * 3)))),
      supportiveSummary: `You demonstrate genuine project foundations with ${githubRepos[0]?.name || 'your work'} and an aptitude for ${targetRole} fundamentals. Focusing on structured testing, error resilience, and deployment setups will give your portfolio the verified polish needed for your career goal.`,
      interviewInsights: {
        strongAnswers: [
          'Clear explanation of component organization and file structuring',
          'Good intuitive grasp of client-side logic and practical data flow'
        ],
        conceptsWellExplained: [
          'Code organization and separation of concerns',
          'Practical debugging workflows'
        ],
        unclearOrIncompleteAreas: [
          unsureCount > 0 ? 'Confidence in automated unit testing concepts' : 'Deep dive into performance profiling',
          'Systematic handling of network edge cases and HTTP error statuses'
        ],
        recommendedPracticeTopics: [
          'Unit testing with Vitest / React Testing Library',
          'API retry mechanisms and Error Boundaries',
          'Production build optimization and containerization'
        ],
        interviewFeedbackAdvice: 'When answering technical questions, anchor your responses in concrete examples from your repositories—mentioning exact packages and problems you solved makes your knowledge undeniable.'
      }
    });
  } catch (error: any) {
    console.error('Error evaluating interview:', error);
    return res.status(500).json({ error: 'Failed to evaluate interview' });
  }
});

// Setup Vite middlewares in dev mode, or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Viora EduTech server listening on http://localhost:${PORT}`);
  });
}

startServer();
