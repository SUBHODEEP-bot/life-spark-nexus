import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { initializeSampleNotifications, startPeriodicNotifications } from "@/utils/notificationInitializer";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Layout = () => {
  const {
    isAuthenticated,
    isLoading,
    theme
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const [notificationsInitialized, setNotificationsInitialized] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && mounted) {
      navigate("/auth", {
        state: {
          from: location.pathname
        }
      });
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin h-12 w-12 text-lifemate-purple" />
          <p className="text-lifemate-purple font-medium animate-pulse">Loading LifeMate X...</p>
        </div>
      </div>;
  }
  
  return <div className={`min-h-screen flex flex-col bg-background transition-colors duration-300`}>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300
            ${pageTransition ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <Outlet />
        </main>
      </div>
    </div>;
};

export default Layout;
