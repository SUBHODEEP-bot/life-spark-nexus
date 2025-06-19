import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { initializeSampleNotifications, startPeriodicNotifications } from "@/utils/notificationInitializer";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Loader, HelpCircle, X, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const { isAuthenticated, isLoading, theme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const [showAssistantDialog, setShowAssistantDialog] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, message: string}[]>([
    { role: "assistant", message: "Hello! I'm your AI Assistant. How can I help you today?" }
  ]);
  const [notificationsInitialized, setNotificationsInitialized] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && mounted) {
      navigate("/auth", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, mounted]);

  // Initialize notifications system when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !notificationsInitialized) {
      // Initialize sample notifications for demo
      setTimeout(() => {
        initializeSampleNotifications();
        startPeriodicNotifications();
      }, 2000); // Delay to allow UI to load
      
      setNotificationsInitialized(true);
    }
  }, [isAuthenticated, notificationsInitialized]);

  // Page transition effect
  useEffect(() => {
    setPageTransition(true);
    const timer = setTimeout(() => setPageTransition(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleHelpClick = () => {
    setShowAssistantDialog(true);
  };

  const handleSendMessage = () => {
    if (!userQuery.trim()) return;
    
    // Add user message to chat history
    setChatHistory([...chatHistory, { role: "user", message: userQuery }]);
    
    // Reset input field
    setUserQuery("");
    
    // Simulate assistant typing
    setAssistantTyping(true);
    
    // Pre-defined responses based on keywords
    const responses = [
      {
        keywords: ["hello", "hi", "hey", "greetings"],
        response: "Hello there! How can I assist you with LifeMate X today?"
      },
      {
        keywords: ["notification", "alert", "remind"],
        response: "The notification system keeps you updated on all your LifeMate X activities. You can customize notification settings in your profile. Is there a specific type of notification you'd like to learn about?"
      },
      {
        keywords: ["help", "confused", "understand", "how to"],
        response: "I'd be happy to help! LifeMate X has many modules like Daily Planner, Health Assistant, and more. What specific feature would you like to learn about?"
      },
      {
        keywords: ["planner", "schedule", "calendar", "plan"],
        response: "The Daily Planner module helps you organize your day. You can create tasks, set reminders, and view your schedule. Would you like me to navigate you there?"
      },
      {
        keywords: ["health", "medical", "doctor", "appointment"],
        response: "The Health Assistant module helps track medications, appointments, and health metrics. It can send reminders for your medications and doctor visits."
      },
      {
        keywords: ["email", "mail", "message"],
        response: "The Email Summary module provides audio summaries of your important emails, so you can listen to your emails instead of reading them."
      },
      {
        keywords: ["theme", "dark", "light", "mode", "color"],
        response: "You can change the theme by clicking the theme toggle button in the top-right corner of the app. LifeMate X supports Light, Dark, and System themes."
      },
      {
        keywords: ["thanks", "thank you", "appreciate"],
        response: "You're welcome! I'm happy I could help. Feel free to ask if you need anything else!"
      }
    ];
    
    // Find matching response or use default
    let responseText = "I'm sorry, I don't have specific information about that. Would you like me to help you navigate to a particular module instead?";
    
    const lowerCaseQuery = userQuery.toLowerCase();
    for (const item of responses) {
      if (item.keywords.some(keyword => lowerCaseQuery.includes(keyword))) {
        responseText = item.response;
        break;
      }
    }
    
    // Simulate delayed response
    setTimeout(() => {
      setAssistantTyping(false);
      setChatHistory(prev => [...prev, { role: "assistant", message: responseText }]);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin h-12 w-12 text-lifemate-purple" />
          <p className="text-lifemate-purple font-medium animate-pulse">Loading LifeMate X...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-background transition-colors duration-300`}>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main 
          className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300
            ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
          <Outlet />
        </main>
      </div>
      
      {/* Assistant Bubble - Floating help button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="bg-lifemate-purple text-white p-4 rounded-full shadow-glow hover:shadow-neon transition-all duration-300 hover:scale-110"
          aria-label="Get assistance"
          onClick={handleHelpClick}
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>
      
      {/* AI Assistant Dialog */}
      <Dialog open={showAssistantDialog} onOpenChange={setShowAssistantDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col dropdown-content">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-lifemate-purple" />
              AI Assistant
            </DialogTitle>
            <DialogDescription>
              Ask me anything about LifeMate X features
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[50vh]">
            {chatHistory.map((item, index) => (
              <div 
                key={index}
                className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    item.role === 'user' 
                      ? 'bg-lifemate-purple text-white' 
                      : 'bg-secondary/70'
                  }`}
                >
                  {item.message}
                </div>
              </div>
            ))}
            
            {assistantTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-secondary/70 rounded-lg p-3 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-lifemate-purple"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!userQuery.trim() || assistantTyping}>
              Send
            </Button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mt-2">
            This is a simulated AI assistant for demonstration purposes
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;
