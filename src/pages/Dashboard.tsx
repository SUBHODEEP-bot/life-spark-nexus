
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  ActivitySquare, BarChart3, Bell, Calendar, CheckSquare, 
  Heart, HelpCircle, Home, MessageCircle, Newspaper, 
  Shield, Star, User, UserCog, Mic, AlertTriangle, 
  LucideIcon, Award, Wallet, Languages, Mail, Clock, Search 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredModules, setFilteredModules] = useState(modulesList);

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
      setCurrentTime(now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredModules(modulesList);
    } else {
      const filtered = modulesList.filter(
        (module) =>
          module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredModules(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="container max-w-6xl mx-auto space-y-8 py-6">
      <section className="glass-card p-6 animate-slide-up">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-poppins">
              {greeting}, <span className="gradient-text">{user?.name || 'User'}</span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-lifemate-purple" />
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} 
              <span className="text-lifemate-purple">•</span>
              <Clock className="h-4 w-4 text-lifemate-purple" /> 
              {currentTime}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="hidden md:flex shadow-glass hover:shadow-glow transition-shadow">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button className="bg-lifemate-purple hover:bg-lifemate-purple-dark shadow-glow hover:shadow-neon transition-all">
              <Calendar className="h-4 w-4 mr-2" />
              Today's Plan
            </Button>
          </div>
        </div>
      </section>

      <section className="animate-slide-up" style={{animationDelay: "0.1s"}}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold font-poppins gradient-text">All Modules</h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search modules..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-secondary/50 border-border/30 rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, index) => (
            <Card 
              key={module.id} 
              className="module-card group" 
              onClick={() => navigate(module.path)}
              style={{
                animationDelay: `${(index % 9) * 0.05}s`,
                transform: 'translateY(0px)'
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.bgGradient} rounded-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`module-icon ${module.color}`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-lifemate-purple scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-lg"></div>
            </Card>
          ))}
        </div>
        
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-4 rounded-full bg-secondary/70 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No modules found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        )}
      </section>

      <section className="animate-slide-up" style={{animationDelay: "0.2s"}}>
        <div className="bg-gradient-to-br from-lifemate-purple/20 to-lifemate-purple-dark/5 backdrop-blur-sm rounded-xl p-6 border border-lifemate-purple/20">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="p-3 bg-lifemate-purple/20 rounded-xl">
              <Star className="h-8 w-8 text-lifemate-purple animate-pulse-slow" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold font-poppins">Unlock Premium Features</h3>
              <p className="text-sm text-muted-foreground">Get access to advanced AI capabilities and personalized recommendations</p>
            </div>
            <div className="ml-auto">
              <Button className="bg-gradient-to-r from-lifemate-purple to-lifemate-purple-dark hover:from-lifemate-purple-dark hover:to-lifemate-purple transition-all shadow-glow">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
