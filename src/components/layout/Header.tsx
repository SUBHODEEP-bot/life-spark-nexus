
import { useState } from "react";
import { Bell, Menu, Moon, Search, Settings, Sun, User, HelpCircle, Languages, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Weekly Report",
      message: "Your weekly activity report is ready to view",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Appointment Reminder",
      message: "You have a doctor's appointment tomorrow at 2:00 PM",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Task Completed",
      message: "Your scheduled backup task has completed successfully",
      time: "3 hours ago",
      read: true,
    }
  ]);

  // Prevent hydration mismatch by only showing theme elements after mount
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
      duration: 3000,
    });
  };

  const handleProfileClick = () => {
    setShowProfileDialog(true);
  };

  const handleSettingsClick = () => {
    setShowSettingsDialog(true);
  };

  const handleLanguageClick = () => {
    setShowLanguageDialog(true);
  };

  const handleHelpCenterClick = () => {
    setShowHelpDialog(true);
  };

  // Notification popover content
  const notificationContent = (
    <PopoverContent className="w-80 p-0 max-h-96 overflow-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all read</Button>
      </div>
      <div className="py-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 hover:bg-secondary/80 cursor-pointer flex ${!notification.read ? 'border-l-2 border-lifemate-purple' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="mr-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${notification.read ? 'bg-secondary' : 'bg-lifemate-purple/10'}`}>
                  <Bell className={`h-4 w-4 ${notification.read ? 'text-muted-foreground' : 'text-lifemate-purple'}`} />
                </div>
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <p>No notifications</p>
          </div>
        )}
      </div>
      <div className="p-2 border-t text-center">
        <Button variant="link" size="sm" className="w-full">View all notifications</Button>
      </div>
    </PopoverContent>
  );

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

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
          
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full hover:bg-lifemate-purple/10 relative"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-semibold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            {notificationContent}
          </Popover>
          
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
              <DropdownMenuItem onClick={handleProfileClick} className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick} className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLanguageClick} className="flex items-center gap-2 cursor-pointer">
                <Languages className="h-4 w-4" /> Language
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleHelpCenterClick} className="flex items-center gap-2 cursor-pointer">
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
      
      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Profile</DialogTitle>
            <DialogDescription>
              View and manage your account information
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-lifemate-purple to-lifemate-purple-dark flex items-center justify-center text-white text-3xl font-medium shadow-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                <p className="text-lg">{user?.name || 'User Name'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-lg">{user?.email || 'user@example.com'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                <p className="text-lg">March 2023</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subscription</h3>
                <p className="text-lg">Premium Plan</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowProfileDialog(false)}>Close</Button>
            <Button variant="outline" onClick={() => {
              toast({
                title: "Edit Profile",
                description: "Edit profile functionality will be added in the next update",
              });
            }}>Edit Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your LifeMate X experience
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive app notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Email Alerts</h3>
                <p className="text-sm text-muted-foreground">Receive email notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Sound Effects</h3>
                <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Auto Start</h3>
                <p className="text-sm text-muted-foreground">Launch app on system startup</p>
              </div>
              <Switch />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              toast({
                title: "Settings Saved",
                description: "Your settings have been updated successfully",
              });
              setShowSettingsDialog(false);
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Language Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Language Settings</DialogTitle>
            <DialogDescription>
              Choose your preferred language
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {["English (US)", "Spanish", "French", "German", "Chinese", "Japanese", "Portuguese", "Russian"].map((language, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 rounded-md cursor-pointer hover:bg-secondary/80"
                  onClick={() => {
                    toast({
                      title: "Language Changed",
                      description: `Language has been set to ${language}`,
                    });
                    setShowLanguageDialog(false);
                  }}
                >
                  <div className={`w-4 h-4 rounded-full border ${index === 0 ? 'bg-lifemate-purple border-lifemate-purple' : 'border-muted-foreground'}`}>
                    {index === 0 && <div className="w-2 h-2 rounded-full bg-white m-[3px]"></div>}
                  </div>
                  <span className="ml-3">{language}</span>
                  {index === 0 && <span className="ml-2 text-xs text-muted-foreground">(Current)</span>}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowLanguageDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Help Center Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Help Center</DialogTitle>
            <DialogDescription>
              Get help with LifeMate X
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border hover:bg-secondary/50 cursor-pointer">
                <h3 className="font-medium text-lg mb-2">Getting Started Guide</h3>
                <p className="text-sm text-muted-foreground">Learn the basics of using LifeMate X</p>
              </div>
              
              <div className="p-4 rounded-lg border hover:bg-secondary/50 cursor-pointer">
                <h3 className="font-medium text-lg mb-2">Tutorials & Videos</h3>
                <p className="text-sm text-muted-foreground">Step-by-step guides to master key features</p>
              </div>
              
              <div className="p-4 rounded-lg border hover:bg-secondary/50 cursor-pointer">
                <h3 className="font-medium text-lg mb-2">Frequently Asked Questions</h3>
                <p className="text-sm text-muted-foreground">Quick answers to common questions</p>
              </div>
              
              <div className="p-4 rounded-lg border hover:bg-secondary/50 cursor-pointer">
                <h3 className="font-medium text-lg mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground">Get help from our support team</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">Popular Questions</h3>
              
              <div className="space-y-3">
                <div className="p-3 rounded-md bg-secondary/50">
                  <h4 className="font-medium">How do I sync my calendar?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Go to App Integration panel and connect your preferred calendar service.
                  </p>
                </div>
                
                <div className="p-3 rounded-md bg-secondary/50">
                  <h4 className="font-medium">Can I use LifeMate X offline?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Some features work offline, but full functionality requires an internet connection.
                  </p>
                </div>
                
                <div className="p-3 rounded-md bg-secondary/50">
                  <h4 className="font-medium">How to upgrade my subscription?</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visit your profile settings and select the "Subscription" tab to view available plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
