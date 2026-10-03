import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  MinusCircle,
  Github,
  ExternalLink,
  BookOpen,
  Radio,
  FileCode2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { SkillEvidenceItem, SkillStatus } from '../types/viora';

interface ProjectEvidenceSectionProps {
  skillsEvidence: SkillEvidenceItem[];
  onOpenEvidenceDetail: (skill: SkillEvidenceItem) => void;
}

export const ProjectEvidenceSection: React.FC<ProjectEvidenceSectionProps> = ({
  skillsEvidence,
  onOpenEvidenceDetail
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredSkills = skillsEvidence.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'proven':
        return {
          label: 'Proven',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500'
        };
      case 'partial':
        return {
          label: 'Partial',
          className: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500'
        };
      case 'claimed-only':
        return {
          label: 'Claimed-only',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400'
        };
      case 'learning-gap':
        return {
          label: 'Learning gap',
          className: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500'
        };
    }
  };

  const counts = {
    all: skillsEvidence.length,
    proven: skillsEvidence.filter(s => s.status === 'proven').length,
    partial: skillsEvidence.filter(s => s.status === 'partial').length,
    'claimed-only': skillsEvidence.filter(s => s.status === 'claimed-only').length,
    'learning-gap': skillsEvidence.filter(s => s.status === 'learning-gap').length
  };

  return (
    <div className="space-y-6">
      {/* Section Header & Explainer */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Technical Skill Evidence &amp; Verification
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Every resume claim is cross-referenced with your public GitHub repositories, code structure, commits, and interview answers.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setActiveFilter('proven')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === 'proven' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Proven ({counts.proven})
            </button>
            <button
              onClick={() => setActiveFilter('partial')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === 'partial' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              Partial ({counts.partial})
            </button>
            <button
              onClick={() => setActiveFilter('claimed-only')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === 'claimed-only' ? 'bg-slate-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Claimed-only ({counts['claimed-only']})
            </button>
            <button
              onClick={() => setActiveFilter('learning-gap')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === 'learning-gap' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              Learning gap ({counts['learning-gap']})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSkills.map((item, idx) => {
          const badge = getStatusBadge(item.status);

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Skill Name & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">
                      {item.name}
                    </span>
                    {item.isTargetRoleRequired && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Target Role
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.className}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>

                {/* Evidence & Confidence Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-3.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">
                      Project Evidence
                    </span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {item.evidenceStrength === 'none' ? 'None on GitHub' : `${item.evidenceStrength} proof`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">
                      Interview Confidence
                    </span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {item.interviewConfidence === 'gap' ? 'Needs reinforcement' : item.interviewConfidence}
                    </span>
                  </div>
                </div>

                {/* Result Explanation */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.explanation}
                </p>

                {/* Linked GitHub Evidence Chips */}
                {item.githubLinks.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Detected GitHub Artifacts
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.githubLinks.map((link, lIdx) => (
                        <a
                          key={lIdx}
                          href={link.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/70 transition-colors"
                        >
                          <Github className="w-3 h-3 text-slate-500" />
                          <span>{link.label}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {item.status === 'proven'
                    ? 'Verified by code & conversation'
                    : item.status === 'partial'
                    ? 'Expand tests to make proven'
                    : 'Target growth opportunity'}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenEvidenceDetail(item)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                >
                  <span>View Project Evidence</span>
                  &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
