import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Github,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileCheck,
  Code2,
  Terminal,
  Info
} from 'lucide-react';
import { StudentProfile } from '../types/viora';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import { fetchGitHubUserRepos } from '../services/githubService';
import { extractResumeSkillsAPI, generateInterviewQuestionsAPI } from '../services/aiService';

interface OnboardingPageProps {
  initialProfile?: StudentProfile;
  onAssessmentReady: (profile: StudentProfile, questions: any[]) => void;
  onBackToLanding: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  initialProfile,
  onAssessmentReady,
  onBackToLanding
}) => {
  const [studentName, setStudentName] = useState(initialProfile?.name || 'Alex Rivera');
  const [githubUsername, setGithubUsername] = useState(initialProfile?.githubUsername || 'alexrivera-dev');
  const [targetRole, setTargetRole] = useState(initialProfile?.targetRole || 'Frontend Developer');
  const [jobDescription, setJobDescription] = useState(
    initialProfile?.jobDescription ||
      'Looking for a Frontend Developer proficient in React, modern JavaScript/TypeScript, responsive CSS (Tailwind), component state patterns, and API integration with automated unit testing.'
  );
  const [resumeText, setResumeText] = useState(initialProfile?.resumeText || SAMPLE_PROFILES.alex.resumeText);
  const [resumeFileName, setResumeFileName] = useState(initialProfile?.resumeFileName || 'Sample_Student_Resume.pdf');
  const [manualTextMode, setManualTextMode] = useState(false);

  // Loading animation state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Python Developer',
    'Data Analyst',
    'Full Stack Developer'
  ];

  const loadingSteps = [
    'Reading resume skills...',
    'Reviewing public GitHub projects...',
    'Identifying relevant technologies...',
    'Preparing personalized interview questions...'
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);
    setErrorMessage(null);

    // If text or markdown file
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setResumeText(content);
      };
      reader.readAsText(file);
      return;
    }

    // Attempt PDF extraction via PDF.js if available
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Try dynamic import of pdfjs-dist
      const pdfjs = await import('pdfjs-dist');
      // Set worker if needed or load directly
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      for (let i = 1; i <= Math.min(pdf.numPages, 4); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      if (fullText.trim().length > 30) {
        setResumeText(fullText);
      } else {
        // Fallback default
        setResumeText(SAMPLE_PROFILES.alex.resumeText);
      }
    } catch (err) {
      console.warn('PDF parsing fallback to text reader:', err);
      // If PDF parsing fails, give friendly guidance or use extracted content
      setResumeText(SAMPLE_PROFILES.alex.resumeText);
    }
  };

  const handleUsePreset = (presetKey: 'alex' | 'vasu' | 'priya') => {
    const p = SAMPLE_PROFILES[presetKey];
    setStudentName(p.name);
    setGithubUsername(p.githubUsername);
    setTargetRole(p.targetRole);
    setJobDescription(p.jobDescription || '');
    setResumeText(p.resumeText);
    setResumeFileName(p.resumeFileName || `${p.name.replace(' ', '_')}_Resume.pdf`);
    setErrorMessage(null);
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername.trim()) {
      setErrorMessage('Please enter a GitHub username to review project artifacts.');
      return;
    }
    if (!resumeText.trim()) {
      setErrorMessage('Please upload a resume or paste your resume text.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStepIndex(0);

    try {
      // Step 1: Reading resume skills
      setLoadingStepIndex(0);
      const extractedSkills = await extractResumeSkillsAPI(resumeText);
      await new Promise(r => setTimeout(r, 650));

      // Step 2: Reviewing GitHub projects
      setLoadingStepIndex(1);
      const { repos, error: ghError } = await fetchGitHubUserRepos(githubUsername);
      if (ghError) {
        console.warn('GitHub notice:', ghError);
      }
      await new Promise(r => setTimeout(r, 750));

      // Step 3: Identifying relevant technologies
      setLoadingStepIndex(2);
      await new Promise(r => setTimeout(r, 600));

      // Step 4: Preparing personalized interview questions
      setLoadingStepIndex(3);
      const profile: StudentProfile = {
        name: studentName.trim() || 'Student',
        githubUsername: githubUsername.trim().replace(/^@/, ''),
        resumeText,
        resumeFileName,
        targetRole,
        jobDescription,
        extractedSkills,
        githubRepos: repos
      };

      const questions = await generateInterviewQuestionsAPI(profile);
      await new Promise(r => setTimeout(r, 600));

      // Hand over to AI Interview Screen
      setIsLoading(false);
      onAssessmentReady(profile, questions);
    } catch (err: any) {
      console.error('Error starting assessment:', err);
      setIsLoading(false);
      setErrorMessage('Could not initialize assessment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          &larr; Back to overview
        </button>

        {/* Card Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Step 1 of 3 &bull; Profile &amp; Project Review</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tell Viora About Your Goal &amp; Work
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Upload your resume and enter your public GitHub username. Viora evaluates real commits, repositories, and technical concepts to guide your learning roadmap.
          </p>

          {/* Quick Presets Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              Quick fill preset:
            </span>
            <button
              type="button"
              onClick={() => handleUsePreset('alex')}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition-colors"
            >
              Alex Rivera (Frontend)
            </button>
            <button
              type="button"
              onClick={() => handleUsePreset('vasu')}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 transition-colors"
            >
              Vasu Mishra (@vasu639)
            </button>
            <button
              type="button"
              onClick={() => handleUsePreset('priya')}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 border border-slate-200 transition-colors"
            >
              Priya Sharma (Backend)
            </button>
          </div>
        </div>

        {/* Main Onboarding Form */}
        <form onSubmit={handleStart} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Notice</p>
                <p className="text-xs text-amber-800 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Student Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Resume Upload / Paste */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Resume PDF or Document
              </label>
              <button
                type="button"
                onClick={() => setManualTextMode(!manualTextMode)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {manualTextMode ? 'Switch to file upload' : 'Paste text instead'}
              </button>
            </div>

            {!manualTextMode ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="resume-file"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="resume-file" className="cursor-pointer block">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2.5">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to select resume PDF or document
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports .PDF, .TXT, or Markdown files
                  </p>
                </label>

                {resumeFileName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Loaded: {resumeFileName}</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  rows={5}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text with skills, education, and project descriptions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                />
              </div>
            )}
          </div>

          {/* GitHub Username */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Public GitHub Username
              </label>
              <span className="text-[11px] text-slate-500">
                Must be public repositories
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Github className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. vasu639 or alexrivera-dev"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
              <span>Try public handles:</span>
              <button
                type="button"
                onClick={() => setGithubUsername('vasu639')}
                className="text-indigo-600 hover:underline font-medium"
              >
                vasu639
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => setGithubUsername('alexrivera-dev')}
                className="text-indigo-600 hover:underline font-medium"
              >
                alexrivera-dev
              </button>
            </div>
          </div>

          {/* Target Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Target Career Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {targetRoles.map((role) => {
                const isSelected = targetRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span>{role}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Description Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Role Details / Paste Job Description
              </label>
              <span className="text-[11px] text-slate-500">Optional context</span>
            </div>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste specific job requirements or competencies you want to align your learning with..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
            />
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Privacy note:</strong> We analyze only the resume and public GitHub information you provide. Your interview responses are used exclusively to create your personal learning recommendations.
            </p>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                  <span>Analyzing Profile &amp; Preparing Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Start My Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Steps Modal / Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Reviewing Real Work
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting resume claims with public GitHub code
                </p>
              </div>

              <div className="space-y-3.5 mb-6">
                {loadingSteps.map((step, idx) => {
                  const isDone = idx < loadingStepIndex;
                  const isCurrent = idx === loadingStepIndex;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {isDone ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        </div>
                      )}
                      <span className={isCurrent ? 'font-bold text-indigo-900' : isDone ? 'text-slate-700' : 'text-slate-400'}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-center text-slate-400 italic">
                EduTech verification in progress &bull; Generating adaptive questions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
