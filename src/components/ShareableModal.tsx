import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Github,
  Compass,
  Award,
  Sparkles,
  ExternalLink,
  Printer
} from 'lucide-react';
import { CompleteAnalysisReport } from '../types/viora';

interface ShareableModalProps {
  report: CompleteAnalysisReport;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareableModal: React.FC<ShareableModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const provenSkills = report.skillsEvidence.filter(s => s.status === 'proven');
  const completedTasks = report.growthTasks.filter(t => t.isCompleted);
  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Toolbar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Mentor &amp; Recruiter Shareable View
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              title="Print or save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Share Link Banner */}
        <div className="px-6 py-3 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between gap-3 text-xs">
          <span className="text-indigo-900 truncate">
            Public link: <strong className="font-mono text-[11px]">{shareUrl}</strong>
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shrink-0 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Printable/Shareable Card */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Card */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Verified Student Learning Portfolio</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {report.studentProfile.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>Target: <strong>{report.studentProfile.targetRole}</strong></span>
                <span>&bull;</span>
                <a
                  href={`https://github.com/${report.studentProfile.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <Github className="w-3 h-3" />
                  <span>@{report.studentProfile.githubUsername}</span>
                </a>
              </div>
            </div>

            {/* Circular Readiness Score */}
            <div className="text-center p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 min-w-[110px]">
              <div className="text-2xl font-black text-indigo-950">
                {report.readinessScore}%
              </div>
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">
                Readiness
              </span>
            </div>
          </div>

          {/* Supportive AI Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed italic">
            &ldquo;{report.supportiveSummary}&rdquo;
          </div>

          {/* Proven Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Proven Technical Skills (GitHub Verified)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {provenSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{s.name}</span>
                </span>
              ))}
              {provenSkills.length === 0 && (
                <span className="text-xs text-slate-500">Skills are currently in learning / partial verification stage.</span>
              )}
            </div>
          </div>

          {/* Selected GitHub Repositories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Github className="w-4 h-4 text-slate-700" />
              <span>Verified Public Repositories</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.studentProfile.githubRepos.slice(0, 4).map((repo, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/40 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 truncate">
                      {repo.name}
                    </span>
                    <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                      {repo.language || 'Code'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {repo.description || 'Public student project'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Growth Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Completed Growth Micro-Tasks ({completedTasks.length})</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {completedTasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{t.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Generated by Viora &bull; EduTech Learning Engine</span>
            <span>{report.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
