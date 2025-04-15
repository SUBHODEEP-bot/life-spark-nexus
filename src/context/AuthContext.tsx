import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  resendOTP: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);

  // Initialize theme and apply it to document
  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('lifemate_user');
    const storedTheme = localStorage.getItem('lifemate_theme');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
    } else {
      // Set default theme based on user preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      localStorage.setItem('lifemate_theme', prefersDark ? 'dark' : 'light');
    }
    
    setIsLoading(false);
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('lifemate_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock API call - would be replaced with real backend call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // Mock successful login
      // In a real app, we would verify credentials with the server
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: email,
      };
      
      setUser(mockUser);
      localStorage.setItem('lifemate_user', JSON.stringify(mockUser));
      
      toast({
        title: "Success!",
        description: "You've successfully logged in.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock API call - would be replaced with real backend call
      // In a real app, we would send registration data to the server
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Store pending registration data for OTP verification
      setPendingEmail(email);
      setPendingName(name);

      // Generate and "send" OTP (in a real app this would be sent via email)
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      localStorage.setItem('lifemate_pending_otp', otp);
      
      // In a real app, this would be sent via API to user's email
      console.log(`[Development] OTP code: ${otp}`);
      
      toast({
        title: "Verification Required",
        description: "We've sent a verification code to your email. Please check and enter the code.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Could not complete registration. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      if (!pendingEmail) {
        toast({
          title: "Error",
          description: "No pending registration found. Please register again.",
          variant: "destructive"
        });
        return false;
      }

      setIsLoading(true);
      
      // Generate and "send" new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      localStorage.setItem('lifemate_pending_otp', otp);
      
      // In a real app, this would be sent via API to user's email
      console.log(`[Development] OTP code resent: ${otp}`);
      
      toast({
        title: "Code Resent",
        description: `We've resent a verification code to ${pendingEmail}. Please check your email.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Failed to resend code",
        description: "Could not resend verification code. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      setIsLoading(true);
      
      // Get stored OTP - in a real app this would be verified against a server
      const storedOTP = localStorage.getItem('lifemate_pending_otp');
      
      // Mock successful verification
      // In a real app, we would verify the OTP with the server
      if (otp === storedOTP || otp === '123456') { // Keep fallback for testing
        const mockUser = {
          id: '1',
          name: pendingName || 'User',
          email: pendingEmail || 'user@example.com',
        };
        
        setUser(mockUser);
        localStorage.setItem('lifemate_user', JSON.stringify(mockUser));
        
        // Clear pending registration data and OTP
        setPendingEmail(null);
        setPendingName(null);
        localStorage.removeItem('lifemate_pending_otp');
        
        toast({
          title: "Verification Successful!",
          description: "Your account has been verified and created successfully.",
        });
        
        return true;
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not verify your account. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lifemate_user');
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      theme,
      toggleTheme,
      login, 
      register, 
      verifyOTP, 
      resendOTP,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
