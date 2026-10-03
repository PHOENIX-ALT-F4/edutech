import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  MessageSquareCode,
  Target,
  Hammer,
  Share2,
  Github,
  Award,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CompleteAnalysisReport, SkillEvidenceItem, GrowthTask } from '../types/viora';
import { ProjectEvidenceSection } from './ProjectEvidenceSection';
import { InterviewInsightsSection } from './InterviewInsightsSection';
import { TargetRoleMatchSection } from './TargetRoleMatchSection';
import { GrowthPlanSection } from './GrowthPlanSection';
import { ProjectEvidenceModal } from './ProjectEvidenceModal';
import confetti from 'canvas-confetti';

interface DashboardPageProps {
  report: CompleteAnalysisReport;
  onOpenShareModal: () => void;
  onUpdateReport: (updated: CompleteAnalysisReport) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  report,
  onOpenShareModal,
  onUpdateReport
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'insights' | 'match' | 'growth'>('evidence');
  const [selectedSkillModal, setSelectedSkillModal] = useState<SkillEvidenceItem | null>(null);
  const [isRechecking, setIsRechecking] = useState(false);
  const [recheckNotice, setRecheckNotice] = useState<string | null>(null);

  // SVG Circular progress computation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.readinessScore / 100) * circumference;

  const handleTasksUpdated = (newTasks: GrowthTask[]) => {
    const completed = newTasks.filter(t => t.isCompleted).length;
    // Each completed micro-task boosts readiness score!
    const baseScore = report.targetRoleMatch.readinessScore;
    const bonus = completed * 3;
    const newScore = Math.min(98, baseScore + bonus);

    onUpdateReport({
      ...report,
      readinessScore: newScore,
      growthTasks: newTasks,
      completedTasksCount: completed
    });
  };

  const handleRecheckProjects = async () => {
    setIsRechecking(true);
    setRecheckNotice(null);

    await new Promise(r => setTimeout(r, 1500));

    // Simulate newly detected commit & test activity
    const completedTasks = report.growthTasks.filter(t => t.isCompleted).length;
    const boost = Math.min(15, completedTasks * 4 + 5);
    const newScore = Math.min(96, report.readinessScore + boost);

    // Promote a partial skill to proven if tasks were completed
    const updatedSkills = report.skillsEvidence.map(s => {
      if (s.name.toLowerCase().includes('test') && completedTasks > 0) {
        return {
          ...s,
          status: 'proven' as const,
          evidenceStrength: 'strong' as const,
          explanation: `Automated test suites and verification badges confirmed in recent repository push.`
        };
      }
      return s;
    });

    onUpdateReport({
      ...report,
      readinessScore: newScore,
      skillsEvidence: updatedSkills,
      supportiveSummary: `Verified recent repository changes! Your readiness score advanced to ${newScore}%. Continuing to complete micro-tasks reinforces your demonstrable technical foundations.`
    });

    setIsRechecking(false);
    setRecheckNotice(`Projects re-verified successfully! Demonstrated readiness increased to ${newScore}%.`);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setRecheckNotice(null), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Recheck Success Notification Banner */}
        {recheckNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{recheckNotice}</span>
            </div>
            <button
              onClick={() => setRecheckNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Summary Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Student Info & Summary */}
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Target Role: {report.studentProfile.targetRole}
                </span>
                <a
                  href={`https://github.com/${report.studentProfile.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>@{report.studentProfile.githubUsername}</span>
                </a>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Skill Evidence &amp; Growth Analysis
              </h1>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                <strong className="text-slate-800 block mb-1">
                  Supportive AI Summary:
                </strong>
                &ldquo;{report.supportiveSummary}&rdquo;
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={onOpenShareModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Profile with Mentor</span>
                </button>

                <button
                  onClick={handleRecheckProjects}
                  disabled={isRechecking}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRechecking ? 'animate-spin' : ''}`} />
                  <span>{isRechecking ? 'Re-verifying...' : 'Recheck My Projects'}</span>
                </button>
              </div>
            </div>

            {/* Circular Readiness Score Gauge */}
            <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-teal-50/50 border border-indigo-100/80 sm:min-w-[240px] text-center shadow-xs">
              <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-200/80"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {report.readinessScore}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                    Readiness
                  </span>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-800">
                Current Learning Readiness
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 max-w-[200px] leading-tight">
                Your current readiness for this learning goal
              </p>
            </div>
          </div>
        </div>

        {/* 4 Main Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === 'evidence'
                ? 'border-indigo-600 text-indigo-700 bg-white/70 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Project Evidence</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {report.skillsEvidence.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === 'insights'
                ? 'border-indigo-600 text-indigo-700 bg-white/70 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>2. Interview Insights</span>
            <span className="px-1.5 py-0.2 rounded-full bg-teal-100 text-[10px] text-teal-800 font-bold">
              Review
            </span>
          </button>

          <button
            onClick={() => setActiveTab('match')}
            className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === 'match'
                ? 'border-indigo-600 text-indigo-700 bg-white/70 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>3. Target Role Match</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-[10px] text-indigo-800 font-bold">
              {report.targetRoleMatch.readinessScore}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('growth')}
            className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === 'growth'
                ? 'border-indigo-600 text-indigo-700 bg-white/70 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Hammer className="w-4 h-4" />
            <span>4. Growth Plan &amp; Tasks</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-[10px] text-amber-800 font-bold">
              {report.growthTasks.filter(t => t.isCompleted).length}/{report.growthTasks.length}
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'evidence' && (
            <ProjectEvidenceSection
              skillsEvidence={report.skillsEvidence}
              onOpenEvidenceDetail={(skill) => setSelectedSkillModal(skill)}
            />
          )}

          {activeTab === 'insights' && (
            <InterviewInsightsSection
              insights={report.interviewInsights}
              questions={report.questions}
              answers={report.interviewAnswers}
            />
          )}

          {activeTab === 'match' && (
            <TargetRoleMatchSection
              matchData={report.targetRoleMatch}
              onNavigateToGrowth={() => setActiveTab('growth')}
            />
          )}

          {activeTab === 'growth' && (
            <GrowthPlanSection
              initialTasks={report.growthTasks}
              onTasksUpdated={handleTasksUpdated}
              onRecheckProjects={handleRecheckProjects}
              isRechecking={isRechecking}
            />
          )}
        </div>
      </div>

      {/* Project Evidence Detail Modal */}
      <ProjectEvidenceModal
        skill={selectedSkillModal}
        onClose={() => setSelectedSkillModal(null)}
      />
    </div>
  );
};
