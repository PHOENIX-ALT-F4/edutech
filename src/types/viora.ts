export type SkillStatus = 'proven' | 'partial' | 'claimed-only' | 'learning-gap';

export type EvidenceStrength = 'strong' | 'moderate' | 'weak' | 'none';
export type InterviewConfidence = 'high' | 'moderate' | 'untested' | 'gap';

export interface GitHubEvidenceLink {
  label: string;
  type: 'repo' | 'readme' | 'code' | 'commit' | 'test' | 'deploy';
  url?: string;
}

export interface SkillEvidenceItem {
  name: string;
  status: SkillStatus;
  evidenceStrength: EvidenceStrength;
  interviewConfidence: InterviewConfidence;
  explanation: string;
  githubLinks: GitHubEvidenceLink[];
  category: 'core' | 'framework' | 'tools' | 'practices';
  isTargetRoleRequired?: boolean;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  hasTests?: boolean;
  hasReadme?: boolean;
  hasDeployment?: boolean;
}

export interface InterviewQuestion {
  id: string;
  type: 'project_verification' | 'technology_understanding' | 'role_based' | 'problem_solving' | 'growth';
  contextTag: string;
  question: string;
  hint?: string;
  targetSkill: string;
  sourceRepo?: string;
}

export interface InterviewAnswer {
  questionId: string;
  answerText: string;
  status: 'answered' | 'skipped' | 'unsure';
}

export interface InterviewInsight {
  strongAnswers: string[];
  conceptsWellExplained: string[];
  unclearOrIncompleteAreas: string[];
  recommendedPracticeTopics: string[];
  interviewFeedbackAdvice: string;
}

export interface MatchTableRow {
  skill: string;
  projectEvidence: string;
  interviewConfidence: string;
  status: SkillStatus;
  recommendedAction: string;
}

export interface TargetRoleMatch {
  roleName: string;
  jobDescription?: string;
  readinessScore: number;
  provenSkillsCount: number;
  partialSkillsCount: number;
  missingSkillsCount: number;
  topPriorities: Array<{ skill: string; reason: string; priority: number }>;
  skillsTable: MatchTableRow[];
}

export interface GrowthTaskChecklist {
  id: string;
  text: string;
  done: boolean;
}

export interface GrowthTask {
  id: string;
  skill: string;
  roleSignificance: string;
  aiInsight: string;
  title: string;
  estimatedMinutes: number; // 20 - 40 minutes
  deliverableSteps: string[];
  expectedGithubDeliverable: string;
  checklist: GrowthTaskChecklist[];
  isCompleted: boolean;
}

export interface StudentProfile {
  name: string;
  githubUsername: string;
  resumeText: string;
  resumeFileName?: string;
  targetRole: string;
  jobDescription?: string;
  extractedSkills: string[];
  githubRepos: GitHubRepo[];
}

export interface CompleteAnalysisReport {
  studentProfile: StudentProfile;
  readinessScore: number;
  supportiveSummary: string;
  skillsEvidence: SkillEvidenceItem[];
  interviewInsights: InterviewInsight;
  targetRoleMatch: TargetRoleMatch;
  growthTasks: GrowthTask[];
  completedTasksCount: number;
  interviewAnswers: InterviewAnswer[];
  questions: InterviewQuestion[];
  createdAt: string;
}

export type AppScreen = 'landing' | 'onboarding' | 'interview' | 'dashboard';
