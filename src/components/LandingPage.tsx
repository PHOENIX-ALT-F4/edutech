import React from 'react';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Github,
  MessageSquareCode,
  LineChart,
  Hammer,
  ShieldCheck,
  Target,
  Lightbulb,
  CheckCircle2,
  Code2,
  Play
} from 'lucide-react';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import { StudentProfile } from '../types/viora';

interface LandingPageProps {
  onStartAssessment: () => void;
  onSelectSampleProfile: (profile: StudentProfile) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onSelectSampleProfile
}) => {
  const steps = [
    {
      num: '01',
      title: 'Upload Resume & Add GitHub',
      desc: 'Submit your student resume and public GitHub handle. Viora extracts claimed skills and analyzes real public commits, repos, and code structure.',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      num: '02',
      title: 'Complete Personalized AI Interview',
      desc: 'Engage in an adaptive, encouraging text-based chat. Questions probe your real projects, role-specific problem solving, and architecture decisions.',
      icon: MessageSquareCode,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      num: '03',
      title: 'Understand Your Skills & Gaps',
      desc: 'Explore your transparent readiness score, skill proof badges (Proven, Partial, Claimed-only, Learning gap), and constructive interview insights.',
      icon: LineChart,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    },
    {
      num: '04',
      title: 'Build Portfolio-Strengthening Projects',
      desc: 'Take on actionable 20–40 minute micro-tasks and learning roadmap steps designed to turn your unproven skills into verifiable GitHub artifacts.',
      icon: Hammer,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    }
  ];

  const benefits = [
    {
      title: 'Understand what your projects really demonstrate',
      desc: 'See exactly which technical skills your GitHub code proves, which are partial, and which are currently unverified claims.',
      icon: ShieldCheck
    },
    {
      title: 'Practise explaining your technical work',
      desc: 'Build confidence talking about component hierarchy, state design, edge cases, and architectural trade-offs without anxiety.',
      icon: MessageSquareCode
    },
    {
      title: 'Find gaps for your target role',
      desc: 'Identify the exact missing ingredients (like automated testing, Docker containers, or CI/CD pipelines) needed for your target career role.',
      icon: Target
    },
    {
      title: 'Receive AI-generated project suggestions',
      desc: 'Get personalized, realistic 20-40 minute micro-projects with step-by-step deliverable criteria, not generic tutorials.',
      icon: Lightbulb
    },
    {
      title: 'Build stronger, verifiable portfolio evidence',
      desc: 'Push concrete code to GitHub, complete checklist tasks, and watch your readiness score elevate through verifiable work.',
      icon: Code2
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/20 text-slate-800">
      {/* EduTech Banner Notice */}
      <div className="bg-indigo-50/80 border-b border-indigo-100/80 py-2 px-4 text-center text-xs font-medium text-indigo-900">
        <span className="font-semibold text-indigo-700">EduTech Learning Platform:</span> Viora is built for student portfolio growth and technical self-discovery—not an ATS, job board, or hiring gatekeeper.
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 text-indigo-800 text-xs font-semibold mb-6 border border-indigo-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>EduTech Student Growth &amp; Portfolio Verification</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
          Turn Your Projects <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
            Into Proof.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Viora reviews your resume, GitHub projects, and technical understanding to create a personalized learning path for your career goal.
        </p>

        {/* Primary CTA and Secondary */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onStartAssessment}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span>Start My Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 font-semibold text-base border border-slate-200 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <span>See How It Works</span>
          </a>
        </div>

        {/* Quick Demo Selector */}
        <div className="bg-white/95 rounded-2xl p-5 border border-slate-200 shadow-sm max-w-2xl mx-auto text-left">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              Instant Demo Profiles (1-Click Exploration)
            </span>
            <span className="text-[11px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded">
              Ready to test
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onSelectSampleProfile(SAMPLE_PROFILES.alex)}
              className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all group"
            >
              <div className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600">
                Alex Rivera
              </div>
              <div className="text-xs text-slate-500">Frontend Developer</div>
              <div className="text-[11px] text-indigo-700 font-medium mt-1">React, TS, Tailwind &rarr;</div>
            </button>

            <button
              onClick={() => onSelectSampleProfile(SAMPLE_PROFILES.vasu)}
              className="p-3 rounded-xl border border-slate-200/80 hover:border-teal-400 hover:bg-teal-50/40 text-left transition-all group"
            >
              <div className="font-semibold text-sm text-slate-900 group-hover:text-teal-700">
                Vasu Mishra
              </div>
              <div className="text-xs text-slate-500">Full Stack Developer</div>
              <div className="text-[11px] text-teal-700 font-medium mt-1">@vasu639 repos &rarr;</div>
            </button>

            <button
              onClick={() => onSelectSampleProfile(SAMPLE_PROFILES.priya)}
              className="p-3 rounded-xl border border-slate-200/80 hover:border-purple-400 hover:bg-purple-50/40 text-left transition-all group"
            >
              <div className="font-semibold text-sm text-slate-900 group-hover:text-purple-600">
                Priya Sharma
              </div>
              <div className="text-xs text-slate-500">Backend Developer</div>
              <div className="text-[11px] text-purple-700 font-medium mt-1">Python, FastAPI, SQL &rarr;</div>
            </button>
          </div>
        </div>

        {/* Central Credo Quote */}
        <div className="mt-14 max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-teal-50/60 border border-indigo-100/70 text-slate-700 italic text-sm sm:text-base leading-relaxed">
          &ldquo;Turn your projects, knowledge, and potential into a clear learning path. Viora reviews your real work, asks the right questions, identifies your skill gaps, and helps you build what comes next.&rdquo;
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            How Viora Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
            A Transparent 4-Step Learning Pathway
          </h2>
          <p className="text-slate-600 text-base">
            No mock test trivia or arbitrary quiz scores. We review real student artifacts to recommend practical, career-aligned improvements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {st.num}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${st.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {st.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Built for Growth Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900 text-white rounded-3xl my-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mb-14">
          <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
            Core Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-4 tracking-tight">
            Built for Growth, Not Just Evaluation
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Most tools filter students out with black-box resumes and keyword filters. Viora guides students forward by turning incomplete evidence into actionable portfolio milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-indigo-400/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4 border border-indigo-500/30">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}

          {/* Call to action card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-200 mb-2">
                Ready to take action?
              </div>
              <h3 className="text-xl font-extrabold mb-3">
                Begin Your Personalized Assessment
              </h3>
              <p className="text-sm text-indigo-100 leading-relaxed mb-6">
                Takes ~8 minutes. No camera or video required. Get your full readiness score and micro-task growth plan.
              </p>
            </div>
            <button
              onClick={onStartAssessment}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700 mb-1">
          Viora &bull; Student Learning &amp; Portfolio Growth Platform
        </p>
        <p>Built exclusively for educational development and verifiable student portfolio empowerment.</p>
      </footer>
    </div>
  );
};
