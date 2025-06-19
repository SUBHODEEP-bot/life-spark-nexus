import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import Layout from "./components/layout/Layout";

// Module Pages
import DailyPlanner from "./pages/modules/DailyPlanner";
import HealthAssistant from "./pages/modules/HealthAssistant";
import YogaModule from "./pages/modules/YogaModule";
import EmailSummary from "./pages/modules/EmailSummary";
import DailyMotivation from "./pages/modules/DailyMotivation";
import FinanceTracker from "./pages/modules/FinanceTracker";
import ProblemSolver from "./pages/modules/ProblemSolver";
import TaskReminder from "./pages/modules/TaskReminder";
import AppIntegration from "./pages/modules/AppIntegration";
import ChatCompanion from "./pages/modules/ChatCompanion";
import LifeScheduler from "./pages/modules/LifeScheduler";
import NewsDigest from "./pages/modules/NewsDigest";
import CareerCoach from "./pages/modules/CareerCoach";
import FamilySync from "./pages/modules/FamilySync";
import LifeAnalyzer from "./pages/modules/LifeAnalyzer";
import WishGrantSystem from "./pages/modules/WishGrantSystem";
import EmergencyAlert from "./pages/modules/EmergencyAlert";
import CelebrationTracker from "./pages/modules/CelebrationTracker";
import VoiceTranslator from "./pages/modules/VoiceTranslator";
import PrivacyGuardian from "./pages/modules/PrivacyGuardian";
import AIStudyMaster from "./pages/modules/AIStudyMaster";
import FloatingChatbot from "./components/chat/FloatingChatbot";

const queryClient = new QueryClient();

const App = () => {
  // Debug log to track app rendering and persistent login
  useEffect(() => {
    console.log('🚀 App mounted, auth checking will begin shortly');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/daily-planner" element={<DailyPlanner />} />
                <Route path="/health-assistant" element={<HealthAssistant />} />
                <Route path="/yoga" element={<YogaModule />} />
                <Route path="/email-summary" element={<EmailSummary />} />
                <Route path="/daily-motivation" element={<DailyMotivation />} />
                <Route path="/finance-tracker" element={<FinanceTracker />} />
                <Route path="/problem-solver" element={<ProblemSolver />} />
                <Route path="/task-reminder" element={<TaskReminder />} />
                <Route path="/app-integration" element={<AppIntegration />} />
                <Route path="/chat-companion" element={<ChatCompanion />} />
                <Route path="/life-scheduler" element={<LifeScheduler />} />
                <Route path="/news-digest" element={<NewsDigest />} />
                <Route path="/career-coach" element={<CareerCoach />} />
                <Route path="/family-sync" element={<FamilySync />} />
                <Route path="/life-analyzer" element={<LifeAnalyzer />} />
                <Route path="/wish-grant-system" element={<WishGrantSystem />} />
                <Route path="/emergency-alert" element={<EmergencyAlert />} />
                <Route path="/celebration-tracker" element={<CelebrationTracker />} />
                <Route path="/voice-translator" element={<VoiceTranslator />} />
                <Route path="/privacy-guardian" element={<PrivacyGuardian />} />
                <Route path="/ai-study-master" element={<AIStudyMaster />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Floating Chatbot - Available on all pages */}
            <FloatingChatbot />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
