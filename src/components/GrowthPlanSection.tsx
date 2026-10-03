import React, { useState } from 'react';
import {
  Hammer,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  GitBranch,
  RefreshCw,
  FolderPlus,
  FileCheck,
  ChevronRight,
  Trophy,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GrowthTask } from '../types/viora';

interface GrowthPlanSectionProps {
  initialTasks: GrowthTask[];
  onTasksUpdated?: (tasks: GrowthTask[]) => void;
  onRecheckProjects: () => void;
  isRechecking: boolean;
}

export const GrowthPlanSection: React.FC<GrowthPlanSectionProps> = ({
  initialTasks,
  onTasksUpdated,
  onRecheckProjects,
  isRechecking
}) => {
  const [tasks, setTasks] = useState<GrowthTask[]>(initialTasks);

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleChecklistItem = (taskId: string, checklistId: string) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const updatedChecklist = t.checklist.map(item => {
        if (item.id === checklistId) {
          return { ...item, done: !item.done };
        }
        return item;
      });
      // If all items done, mark task completed
      const allDone = updatedChecklist.every(i => i.done);
      return {
        ...t,
        checklist: updatedChecklist,
        isCompleted: allDone
      };
    });

    setTasks(updated);
    onTasksUpdated?.(updated);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const newStatus = !t.isCompleted;
      const newChecklist = t.checklist.map(item => ({ ...item, done: newStatus }));
      return {
        ...t,
        isCompleted: newStatus,
        checklist: newChecklist
      };
    });

    setTasks(updated);
    onTasksUpdated?.(updated);

    // Trigger confetti on completion
    const targetTask = updated.find(t => t.id === taskId);
    if (targetTask?.isCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress Tracker */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full w-fit mb-2 border border-teal-100">
              <Hammer className="w-3.5 h-3.5" />
              <span>Personalized Learning Roadmap</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Growth Plan &amp; Micro-Projects
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Targeted, 20–40 minute practical assignments. Each task turns a detected learning gap or unverified claim into verifiable code in your public GitHub repositories.
            </p>
          </div>

          {/* Recheck My Projects Button */}
          <button
            onClick={onRecheckProjects}
            disabled={isRechecking}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-colors shrink-0 shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRechecking ? 'animate-spin' : ''}`} />
            <span>{isRechecking ? 'Verifying Repositories...' : 'Recheck My Projects'}</span>
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Portfolio Strengthening Progress</span>
            </span>
            <span className="font-extrabold text-indigo-700">
              {completedCount} of {totalCount} tasks completed ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="space-y-5">
        {tasks.map((task) => {
          return (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                task.isCompleted
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200 shadow-xs hover:border-indigo-300'
              }`}
            >
              {/* Top metadata */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Skill: {task.skill}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.estimatedMinutes} minutes</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {task.title}
                  </h3>
                </div>

                {/* Mark as Complete button */}
                <button
                  type="button"
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    task.isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                      : 'border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{task.isCompleted ? 'Completed' : 'Mark as Complete'}</span>
                </button>
              </div>

              {/* Why it matters & AI insight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    Why it matters for your role:
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {task.roleSignificance}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-indigo-900 block mb-1">
                    AI Insight from your GitHub review:
                  </span>
                  <p className="text-slate-600 leading-relaxed italic">
                    &ldquo;{task.aiInsight}&rdquo;
                  </p>
                </div>
              </div>

              {/* Build Steps */}
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Clear Build Steps:
                </span>
                <ol className="space-y-1.5 text-xs text-slate-700 pl-4 list-decimal">
                  {task.deliverableSteps.map((step, sIdx) => (
                    <li key={sIdx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Expected Deliverable Artifact */}
              <div className="mb-4 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs flex items-start gap-2 text-indigo-950">
                <GitBranch className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Expected GitHub Deliverable: </span>
                  <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200/60 font-mono text-slate-800 text-[11px]">
                    {task.expectedGithubDeliverable}
                  </code>
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Completion Checklist:
                </span>
                <div className="space-y-2">
                  {task.checklist.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChecklistItem(task.id, item.id)}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-left transition-colors group"
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          item.done ? 'line-through text-slate-400 font-normal' : 'text-slate-800 font-medium'
                        }`}
                      >
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
