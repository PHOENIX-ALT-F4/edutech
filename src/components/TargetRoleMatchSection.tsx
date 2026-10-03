import React from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  HelpCircle,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { TargetRoleMatch, SkillStatus } from '../types/viora';

interface TargetRoleMatchSectionProps {
  matchData: TargetRoleMatch;
  onNavigateToGrowth: () => void;
}

export const TargetRoleMatchSection: React.FC<TargetRoleMatchSectionProps> = ({
  matchData,
  onNavigateToGrowth
}) => {
  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'proven':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Proven (1.0 pt)
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Partial (0.5 pt)
          </span>
        );
      case 'claimed-only':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Claimed-only (0 pt)
          </span>
        );
      case 'learning-gap':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Learning gap (0 pt)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Card: Goal Summary & Transparent Formula */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full w-fit mb-2 border border-indigo-100">
              <Target className="w-3.5 h-3.5" />
              <span>Target Role Alignment</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Learning Match: {matchData.roleName}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              &ldquo;You are building strong foundations for your {matchData.roleName} goal. Focus next on testing, Docker, and deployment to make your portfolio more complete.&rdquo;
            </p>
          </div>

          {/* Readiness gauge banner */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 text-center sm:min-w-[200px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 block">
              Readiness Score
            </span>
            <div className="text-3xl font-extrabold text-indigo-950 mt-0.5">
              {matchData.readinessScore}%
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 font-medium">
              Your current readiness for this learning goal
            </span>
          </div>
        </div>

        {/* Transparent scoring explanation */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Transparent calculation formula:</strong> Proven = 1.0 point, Partial = 0.5 point, Claimed-only / Missing = 0 points. Match score = earned points &divide; total required skills &times; 100. This is an educational progress indicator, never a hiring score or decision.
          </p>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Proven Skills</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
            {matchData.provenSkillsCount}
          </span>
          <span className="text-[11px] text-slate-400">Verifiable in code</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Partial Evidence</span>
          <span className="text-2xl font-extrabold text-amber-500 mt-1 block">
            {matchData.partialSkillsCount}
          </span>
          <span className="text-[11px] text-slate-400">Needs depth / tests</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Learning Gaps</span>
          <span className="text-2xl font-extrabold text-purple-600 mt-1 block">
            {matchData.missingSkillsCount}
          </span>
          <span className="text-[11px] text-slate-400">Target role prerequisites</span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Top Focus Areas</span>
          <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">
            {matchData.topPriorities.length}
          </span>
          <span className="text-[11px] text-slate-400">Immediate micro-tasks</span>
        </div>
      </div>

      {/* Top 3 Priorities */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">
              Top 3 Learning Priorities
            </h3>
          </div>
          <button
            onClick={onNavigateToGrowth}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
          >
            <span>View Micro-Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matchData.topPriorities.map((p) => (
            <div
              key={p.priority}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/30 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                    Priority #{p.priority}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  {p.skill}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Role Match Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">
            Required Technical Skills Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed matrix comparing public GitHub evidence, interview explanations, and recommended actions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Required Skill</th>
                <th className="py-3 px-4">Project Evidence</th>
                <th className="py-3 px-4">Interview Confidence</th>
                <th className="py-3 px-4">Overall Status</th>
                <th className="py-3 px-4">Recommended Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {matchData.skillsTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {row.skill}
                  </td>
                  <td className="py-3.5 px-4">
                    {row.projectEvidence}
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    {row.interviewConfidence}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-700 font-medium">
                    {row.recommendedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
