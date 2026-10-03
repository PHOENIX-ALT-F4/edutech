import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OnboardingPage } from './components/OnboardingPage';
import { InterviewPage } from './components/InterviewPage';
import { DashboardPage } from './components/DashboardPage';
import { ShareableModal } from './components/ShareableModal';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import {
  AppScreen,
  StudentProfile,
  InterviewQuestion,
  InterviewAnswer,
  CompleteAnalysisReport
} from './types/viora';
import { calculateReadinessAndReport } from './services/scoringService';
import { evaluateInterviewAPI } from './services/aiService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [activeProfile, setActiveProfile] = useState<StudentProfile>(SAMPLE_PROFILES.alex);
  const [activeQuestions, setActiveQuestions] = useState<InterviewQuestion[]>([]);
  const [activeReport, setActiveReport] = useState<CompleteAnalysisReport | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Navigate to Onboarding with selected profile or blank
  const handleStartAssessment = () => {
    setCurrentScreen('onboarding');
  };

  const handleSelectSampleProfile = (profile: StudentProfile) => {
    setActiveProfile(profile);
    setCurrentScreen('onboarding');
  };

  // Called after Onboarding finishes reading resume, fetching GitHub & generating questions
  const handleAssessmentReady = (profile: StudentProfile, questions: InterviewQuestion[]) => {
    setActiveProfile(profile);
    setActiveQuestions(questions);
    setCurrentScreen('interview');
  };

  // Called when AI Interview is finished/skipped/submitted
  const handleFinishInterview = async (answers: InterviewAnswer[]) => {
    // Optionally call AI evaluation endpoint for deep insights
    const serverAiInsights = await evaluateInterviewAPI(activeProfile, activeQuestions, answers);

    // Compute combined evidence, transparent match score, and growth plan
    const report = calculateReadinessAndReport(
      activeProfile,
      activeQuestions,
      answers,
      serverAiInsights
    );

    setActiveReport(report);
    setCurrentScreen('dashboard');
  };

  const handleReset = () => {
    setCurrentScreen('landing');
    setActiveReport(null);
    setActiveQuestions([]);
  };

  const handleUpdateReport = (updated: CompleteAnalysisReport) => {
    setActiveReport(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onReset={handleReset}
        onOpenShare={() => setIsShareModalOpen(true)}
        studentName={activeProfile?.name}
        hasReport={!!activeReport}
      />

      {/* Screen Views */}
      <main className="flex-1">
        {currentScreen === 'landing' && (
          <LandingPage
            onStartAssessment={handleStartAssessment}
            onSelectSampleProfile={handleSelectSampleProfile}
          />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingPage
            initialProfile={activeProfile}
            onAssessmentReady={handleAssessmentReady}
            onBackToLanding={() => setCurrentScreen('landing')}
          />
        )}

        {currentScreen === 'interview' && (
          <InterviewPage
            studentProfile={activeProfile}
            questions={activeQuestions}
            onFinishInterview={handleFinishInterview}
          />
        )}

        {currentScreen === 'dashboard' && activeReport && (
          <DashboardPage
            report={activeReport}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onUpdateReport={handleUpdateReport}
          />
        )}
      </main>

      {/* Shareable Modal */}
      {activeReport && (
        <ShareableModal
          report={activeReport}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
