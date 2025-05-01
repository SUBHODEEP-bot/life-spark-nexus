
import { Bell, Menu, Moon, Search, Settings, Sun, User, HelpCircle, Languages } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Prevent hydration mismatch by only showing theme elements after mount
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-30 backdrop-blur-md border-b transition-all duration-300
        ${scrolled ? 'bg-secondary/80 shadow-md' : 'bg-transparent border-transparent'}`}
    >
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="md:hidden hover:bg-lifemate-purple/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-lifemate-purple to-lifemate-purple-dark flex items-center justify-center shadow-glow">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="hidden md:inline-flex text-xl font-bold gradient-text font-poppins">
              LifeMate X
            </span>
          </div>
        </div>

        <div className="hidden md:flex relative max-w-md w-full mx-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search LifeMate X..."
            className="w-full bg-background/50 rounded-full py-2 pl-10 pr-4 text-sm border border-border/40 focus:outline-none focus:ring-1 focus:ring-lifemate-purple transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="rounded-full hover:bg-lifemate-purple/10"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full hover:bg-lifemate-purple/10 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-lifemate-orange rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-lifemate-purple/10 transition-all"
              >
                {user?.name ? (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lifemate-purple to-lifemate-purple-dark flex items-center justify-center text-white font-medium shadow-md">
                    {user.name.charAt(0)}
                  </div>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 backdrop-blur-md bg-card/90 border-border/40">
              <div className="p-2 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lifemate-purple to-lifemate-purple-dark flex items-center justify-center text-white font-medium shadow-md">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-medium">{user?.name || 'User'}</h3>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Languages className="h-4 w-4" /> Language
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <HelpCircle className="h-4 w-4" /> Help Center
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
