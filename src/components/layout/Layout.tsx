
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Loader } from "lucide-react";

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && mounted) {
      navigate("/auth", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, mounted]);

  // Page transition effect
  useEffect(() => {
    setPageTransition(true);
    const timer = setTimeout(() => setPageTransition(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-lifemate-dark to-black">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin h-12 w-12 text-lifemate-purple" />
          <p className="text-lifemate-purple font-medium animate-pulse">Loading LifeMate X...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/30">
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
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Layout;
