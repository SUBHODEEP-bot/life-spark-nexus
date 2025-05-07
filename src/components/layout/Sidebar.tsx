
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ActivitySquare, BarChart3, Bell, Calendar, CheckSquare, 
  Heart, HelpCircle, Home, ListChecks, MessageCircle, 
  Newspaper, Shield, Star, User, UserCog, Mic, AlertTriangle,
  LucideIcon, X, Award, Wallet, Languages, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface NavItem {
  title: string;
  icon: LucideIcon;
  path: string;
  color?: string;
}

const moduleNavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Daily Planner",
    icon: Calendar,
    path: "/daily-planner",
    color: "text-blue-400",
  },
  {
    title: "Health Assistant",
    icon: Heart,
    path: "/health-assistant",
    color: "text-red-400",
  },
  {
    title: "YOUR YOGA",
    icon: ActivitySquare,
    path: "/yoga",
    color: "text-green-400",
  },
  {
    title: "Email Summary",
    icon: MessageCircle,
    path: "/email-summary",
  },
  {
    title: "Daily Motivation",
    icon: Star,
    path: "/daily-motivation",
    color: "text-yellow-400",
  },
  {
    title: "Finance Tracker",
    icon: Wallet,
    path: "/finance-tracker",
    color: "text-emerald-400",
  },
  {
    title: "Problem Solver",
    icon: HelpCircle,
    path: "/problem-solver",
  },
  {
    title: "Task Reminder",
    icon: Bell,
    path: "/task-reminder",
  },
  {
    title: "App Integration",
    icon: UserCog,
    path: "/app-integration",
  },
  {
    title: "Chat Companion",
    icon: MessageCircle,
    path: "/chat-companion",
    color: "text-purple-400",
  },
  {
    title: "Life Scheduler",
    icon: CheckSquare,
    path: "/life-scheduler",
  },
  {
    title: "News Digest",
    icon: Newspaper,
    path: "/news-digest",
  },
  {
    title: "Career Coach",
    icon: User,
    path: "/career-coach",
  },
  {
    title: "Family Sync",
    icon: User,
    path: "/family-sync",
  },
  {
    title: "Life Analyzer",
    icon: BarChart3,
    path: "/life-analyzer",
    color: "text-indigo-400",
  },
  {
    title: "Wish Grant System",
    icon: Star,
    path: "/wish-grant-system",
    color: "text-amber-400",
  },
  {
    title: "Emergency Alert",
    icon: AlertTriangle,
    path: "/emergency-alert",
    color: "text-orange-400",
  },
  {
    title: "Celebration Tracker",
    icon: Award,
    path: "/celebration-tracker",
    color: "text-pink-400",
  },
  {
    title: "Voice Translator",
    icon: Mic,
    path: "/voice-translator",
    color: "text-cyan-400",
  },
  {
    title: "Privacy Guardian",
    icon: Shield,
    path: "/privacy-guardian",
    color: "text-teal-400",
  },
  {
    title: "AI Study Master",
    icon: BookOpen,
    path: "/ai-study-master",
    color: "text-blue-600",
  },
];

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={closeSidebar}
        />
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card/95 backdrop-blur-sm w-64 transform transition-transform duration-200 ease-in-out border-r border-border/40 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-0"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-lifemate-purple flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-lifemate-purple to-lifemate-purple-dark text-transparent bg-clip-text">
              LifeMate X
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeSidebar}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Separator />
        
        <ScrollArea className="flex-1 px-2 py-4">
          <div className="flex flex-col gap-1">
            {moduleNavItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "justify-start gap-3 h-10",
                  location.pathname === item.path && "bg-lifemate-purple/10 text-lifemate-purple font-medium"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className={cn("h-4 w-4", item.color)} />
                <span className="truncate">{item.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border/40">
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              LifeMate X Version 1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
