import React from 'react';
import {
  X,
  ShieldCheck,
  Github,
  ExternalLink,
  BookOpen,
  FileCode2,
  Terminal,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { SkillEvidenceItem } from '../types/viora';

interface ProjectEvidenceModalProps {
  skill: SkillEvidenceItem | null;
  onClose: () => void;
}

export const ProjectEvidenceModal: React.FC<ProjectEvidenceModalProps> = ({
  skill,
  onClose
}) => {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {skill.name} Evidence Deep-Dive
              </h3>
              <span className="text-[11px] text-slate-500 capitalize">
                Category: {skill.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Status */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Status Classification:</span>
            <span className="font-bold uppercase tracking-wider text-slate-800">
              {skill.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">GitHub Proof Depth:</span>
            <span className="font-semibold text-slate-800 capitalize">
              {skill.evidenceStrength}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Interview Confidence:</span>
            <span className="font-semibold text-slate-800 capitalize">
              {skill.interviewConfidence}
            </span>
          </div>
        </div>

        {/* Explanation */}
        <div className="mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Verification Rationale
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/70">
            {skill.explanation}
          </p>
        </div>

        {/* Linked Repositories & Artifacts */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Linked GitHub Artifacts
          </h4>
          {skill.githubLinks.length > 0 ? (
            <div className="space-y-2">
              {skill.githubLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Github className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-medium text-slate-800">{link.label}</span>
                  </div>
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No matching public repository artifact detected yet. Follow the AI Growth Plan micro-project to add code proof to your GitHub profile!
            </p>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
        >
          Close Detail View
        </button>
      </div>
    </div>
  );
};
