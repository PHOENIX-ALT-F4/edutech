import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { InterviewInsight, InterviewAnswer, InterviewQuestion } from '../types/viora';

interface InterviewInsightsSectionProps {
  insights: InterviewInsight;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
}

export const InterviewInsightsSection: React.FC<InterviewInsightsSectionProps> = ({
  insights,
  questions,
  answers
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full w-fit mb-2 border border-teal-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Constructive Technical Coaching</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Interview Insights &amp; Articulation Feedback
        </h2>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Reflective analysis of your technical explanations, problem-solving reasoning, and suggestions for articulating engineering decisions in future interviews.
        </p>

        {/* Coach tip box */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-teal-50/80 via-indigo-50/60 to-purple-50/40 border border-teal-200/60 text-xs text-slate-700 leading-relaxed">
          <strong className="text-teal-900 block font-bold mb-1">
            Coach Feedback &amp; Project Articulation Advice:
          </strong>
          {insights.interviewFeedbackAdvice}
        </div>
      </div>

      {/* 2x2 Grid of Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strong Answers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Strong Answers &amp; Strengths
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {insights.strongAnswers.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Concepts Explained Well */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Concepts You Explained Well
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {insights.conceptsWellExplained.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas Unclear or Incomplete */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Areas Where Answers Were Unclear or Incomplete
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {insights.unclearOrIncompleteAreas.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Topics to Practise */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Recommended Topics to Practise Next
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {insights.recommendedPracticeTopics.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transcript Review Accordion */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>Interview Transcript &amp; Review</span>
        </h3>
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const ans = answers.find(a => a.questionId === q.id);
            return (
              <div key={q.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-slate-800">
                    Q{idx + 1}: {q.question}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    ans?.status === 'answered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ans?.status === 'unsure'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {ans?.status || 'unanswered'}
                  </span>
                </div>
                <div className="mt-2 text-slate-600 pl-3 border-l-2 border-indigo-200 italic">
                  {ans?.answerText || 'No answer provided'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
