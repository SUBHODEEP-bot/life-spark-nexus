
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  ActivitySquare, BarChart3, Bell, Calendar, CheckSquare, 
  Heart, HelpCircle, Home, MessageCircle, 
  Newspaper, Shield, Star, User, UserCog, Mic, AlertTriangle,
  LucideIcon, Award, Wallet, Languages, Mail, Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color?: string;
  bgGradient?: string;
}

const modulesList: Module[] = [
  {
    id: "daily-planner",
    title: "AI Daily Planner",
    description: "Plan your day with AI assistance, manage tasks & reminders",
    icon: Calendar,
    path: "/daily-planner",
    color: "text-blue-400",
    bgGradient: "from-blue-500/10 to-transparent"
  },
  {
    id: "health-assistant",
    title: "Personal Health Assistant",
    description: "Manage medications, appointments & monitor health metrics",
    icon: Heart,
    path: "/health-assistant",
    color: "text-red-400",
    bgGradient: "from-red-500/10 to-transparent"
  },
  {
    id: "yoga",
    title: "YOUR YOGA",
    description: "Daily yoga routines, pose detection & progress tracking",
    icon: ActivitySquare,
    path: "/yoga",
    color: "text-green-400",
    bgGradient: "from-green-500/10 to-transparent"
  },
  {
    id: "email-summary",
    title: "AI Voice Summary of Emails",
    description: "Audio summaries of your emails & important notifications",
    icon: Mail,
    path: "/email-summary",
    bgGradient: "from-indigo-500/10 to-transparent"
  },
  {
    id: "daily-motivation",
    title: "Daily Motivation & Quote Generator",
    description: "AI-generated quotes to inspire & motivate you every day",
    icon: Star,
    path: "/daily-motivation",
    color: "text-yellow-400",
    bgGradient: "from-yellow-500/10 to-transparent"
  },
  {
    id: "finance-tracker",
    title: "Finance & Budget Tracker",
    description: "Track expenses, manage budget & get saving suggestions",
    icon: Wallet,
    path: "/finance-tracker",
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/10 to-transparent"
  },
  {
    id: "problem-solver",
    title: "Daily Life Problem Solver",
    description: "Get AI suggestions for daily decisions & activities",
    icon: HelpCircle,
    path: "/problem-solver",
    bgGradient: "from-slate-500/10 to-transparent"
  },
  {
    id: "task-reminder",
    title: "Task Reminder & Suggestion AI",
    description: "Smart reminders that adapt to your habits & schedule",
    icon: Bell,
    path: "/task-reminder",
    bgGradient: "from-fuchsia-500/10 to-transparent"
  },
  {
    id: "app-integration",
    title: "App Integration Panel",
    description: "Connect with Gmail, Calendar, WhatsApp & more",
    icon: UserCog,
    path: "/app-integration",
    bgGradient: "from-violet-500/10 to-transparent"
  },
  {
    id: "chat-companion",
    title: "AI Chat Companion",
    description: "Talk with your AI friend about emotions, journal & more",
    icon: MessageCircle,
    path: "/chat-companion",
    color: "text-purple-400",
    bgGradient: "from-purple-500/10 to-transparent"
  },
  {
    id: "life-scheduler",
    title: "AI Auto Life Scheduler",
    description: "AI-powered scheduling suggestions & time management",
    icon: CheckSquare,
    path: "/life-scheduler",
    bgGradient: "from-sky-500/10 to-transparent"
  },
  {
    id: "news-digest",
    title: "Social & News Digest",
    description: "Curated news articles & social media trends",
    icon: Newspaper,
    path: "/news-digest",
    bgGradient: "from-neutral-500/10 to-transparent"
  },
  {
    id: "career-coach",
    title: "Career & Study Coach",
    description: "Study plans, exam preparation & career advice",
    icon: User,
    path: "/career-coach",
    bgGradient: "from-zinc-500/10 to-transparent"
  },
  {
    id: "family-sync",
    title: "Family Sync System",
    description: "Share calendars, tasks & location with family members",
    icon: User,
    path: "/family-sync",
    bgGradient: "from-blue-800/10 to-transparent"
  },
  {
    id: "life-analyzer",
    title: "Life Analyzer AI Report",
    description: "Get insights into your lifestyle, habits & productivity",
    icon: BarChart3,
    path: "/life-analyzer",
    color: "text-indigo-400",
    bgGradient: "from-indigo-500/10 to-transparent"
  },
  {
    id: "wish-grant-system",
    title: "AI Wish Grant System",
    description: "Set goals, track progress & get motivation boosts",
    icon: Star,
    path: "/wish-grant-system",
    color: "text-amber-400",
    bgGradient: "from-amber-500/10 to-transparent"
  },
  {
    id: "emergency-alert",
    title: "Emergency & Disaster Alert",
    description: "Critical alerts, emergency checklists & GPS sharing",
    icon: AlertTriangle,
    path: "/emergency-alert",
    color: "text-orange-400",
    bgGradient: "from-orange-500/10 to-transparent"
  },
  {
    id: "celebration-tracker",
    title: "Celebration Tracker",
    description: "Track achievements & celebrate life's special moments",
    icon: Award,
    path: "/celebration-tracker",
    color: "text-pink-400",
    bgGradient: "from-pink-500/10 to-transparent"
  },
  {
    id: "voice-translator",
    title: "Real-Time Voice Translator",
    description: "Translate between languages in real-time with voice input",
    icon: Mic,
    path: "/voice-translator",
    color: "text-cyan-400",
    bgGradient: "from-cyan-500/10 to-transparent"
  },
  {
    id: "privacy-guardian",
    title: "Privacy Guardian",
    description: "Protect your data, check for leaks & get security tips",
    icon: Shield,
    path: "/privacy-guardian",
    color: "text-teal-400",
    bgGradient: "from-teal-500/10 to-transparent"
  }
];

const Dashboard = () => {
  const { user, theme } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container max-w-6xl mx-auto space-y-8">
      <section className="glass-card p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {greeting}, {user?.name || 'User'}
            </h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="hidden md:flex">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button className="bg-lifemate-purple hover:bg-lifemate-purple-dark">
              <Calendar className="h-4 w-4 mr-2" />
              Today's Plan
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">All Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulesList.map((module) => (
            <Card
              key={module.id}
              className="module-card group"
              onClick={() => navigate(module.path)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.bgGradient} rounded-lg opacity-50`}></div>
              <div className="relative z-10">
                <div className={`module-icon ${module.color}`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-lifemate-purple scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-lg"></div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
