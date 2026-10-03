import React, { useState } from 'react';
import {
  MessageSquareCode,
  Sparkles,
  Send,
  HelpCircle,
  SkipForward,
  Flag,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { InterviewQuestion, InterviewAnswer, StudentProfile } from '../types/viora';

interface InterviewPageProps {
  studentProfile: StudentProfile;
  questions: InterviewQuestion[];
  onFinishInterview: (answers: InterviewAnswer[]) => void;
}

export const InterviewPage: React.FC<InterviewPageProps> = ({
  studentProfile,
  questions,
  onFinishInterview
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [history, setHistory] = useState<Array<{ role: 'ai' | 'student'; text: string; tag?: string; status?: string }>>([
    {
      role: 'ai',
      text: questions[0]?.question || 'Welcome to your Viora AI Interview. Let\'s explore your projects!',
      tag: questions[0]?.contextTag
    }
  ]);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length || 6;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0;

  const handleNextOrSubmit = (status: 'answered' | 'skipped' | 'unsure') => {
    let finalAnswerText = currentAnswer.trim();
    if (status === 'skipped') finalAnswerText = '[Skipped question]';
    if (status === 'unsure') finalAnswerText = "I'm Not Sure — I'd like to learn more about this.";

    const newAnswer: InterviewAnswer = {
      questionId: currentQ.id,
      answerText: finalAnswerText,
      status
    };

    const updatedAnswers = [...answers.filter(a => a.questionId !== currentQ.id), newAnswer];
    setAnswers(updatedAnswers);

    // Update conversational transcript history
    const studentEntry = {
      role: 'student' as const,
      text: finalAnswerText,
      status
    };

    // If more questions remain and not manually finishing
    if (currentIndex + 1 < totalQuestions) {
      const nextQ = questions[currentIndex + 1];
      const nextAiEntry = {
        role: 'ai' as const,
        text: nextQ.question,
        tag: nextQ.contextTag
      };

      setHistory(prev => [...prev, studentEntry, nextAiEntry]);
      setCurrentIndex(prev => prev + 1);
      setCurrentAnswer('');
    } else {
      // Last question reached
      setHistory(prev => [...prev, studentEntry]);
      finishUp(updatedAnswers);
    }
  };

  const finishUp = async (finalAnswers: InterviewAnswer[]) => {
    setIsFinishing(true);
    await new Promise(r => setTimeout(r, 1200));
    onFinishInterview(finalAnswers);
  };

  const handleEarlyFinish = () => {
    // Fill remaining as skipped if any
    const finalAnswers = [...answers];
    for (let i = currentIndex; i < totalQuestions; i++) {
      const q = questions[i];
      if (!finalAnswers.some(a => a.questionId === q.id)) {
        finalAnswers.push({
          questionId: q.id,
          answerText: '[Skipped during early finish]',
          status: 'skipped'
        });
      }
    }
    finishUp(finalAnswers);
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center shadow-xl border border-slate-200">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Synthesizing Your Report
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            “Thank you. Viora is now combining your project evidence and responses to create your personal growth report.”
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div className="bg-indigo-600 h-full rounded-full animate-pulse w-3/4" />
          </div>
          <p className="text-xs text-slate-400">
            Evaluating GitHub commits, interview depth, and target role readiness...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col min-h-[85vh]">
        {/* Top Header & Context */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                AI Learning Interview
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Goal: <strong className="text-slate-800">{studentProfile.targetRole}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Conversational, adaptive, and focused on learning—not judgment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-extrabold text-slate-900">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <button
              onClick={handleEarlyFinish}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Finish Interview
            </button>
          </div>
        </div>

        {/* Chat / Question Transcript Container */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-4 overflow-y-auto space-y-4 max-h-[52vh]">
          {history.map((msg, idx) => {
            const isAi = msg.role === 'ai';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isAi && msg.tag && (
                    <div className="inline-block text-[11px] font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-md mb-2">
                      {msg.tag}
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {!isAi && msg.status && msg.status !== 'answered' && (
                    <span className="inline-block text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-indigo-700/60 text-indigo-100 mt-2">
                      {msg.status === 'unsure' ? "Marked as 'Not Sure'" : 'Question Skipped'}
                    </span>
                  )}
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current Active Question Input Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5">
          {/* Context Tag and Hint */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              {currentQ.contextTag}
            </span>

            {currentQ.hint && (
              <span className="text-xs text-slate-500 italic flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Hint: {currentQ.hint}
              </span>
            )}
          </div>

          {/* Large text answer field */}
          <textarea
            rows={4}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your response here... Explain how you built this, the reasoning behind your choices, or how you would approach the scenario."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder:text-slate-400 resize-none"
          />

          {/* Answer length hint and Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3 pt-2">
            <div className="text-xs text-slate-400">
              <span>{wordCount} words</span>
              {wordCount > 0 && wordCount < 20 && (
                <span className="text-amber-600 ml-2 font-medium">
                  &bull; Tip: 2-3 sentences with concrete examples give richer insight
                </span>
              )}
              {wordCount >= 20 && (
                <span className="text-emerald-600 ml-2 font-medium">
                  &bull; Great depth!
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {/* Not sure button */}
              <button
                type="button"
                onClick={() => handleNextOrSubmit('unsure')}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Don't worry! We will provide helpful learning resources after the interview."
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>I'm Not Sure</span>
              </button>

              {/* Skip button */}
              <button
                type="button"
                onClick={() => handleNextOrSubmit('skipped')}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5 text-slate-400" />
                <span>Skip</span>
              </button>

              {/* Submit / Next Question */}
              <button
                type="button"
                disabled={!currentAnswer.trim()}
                onClick={() => handleNextOrSubmit('answered')}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <span>{currentIndex + 1 === totalQuestions ? 'Finish Interview' : 'Submit Answer'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
