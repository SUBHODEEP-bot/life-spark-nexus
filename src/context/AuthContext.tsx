
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { sendOTPEmail } from '@/services/emailService';

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
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('lifemate_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock API call - would be replaced with real backend call
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
      
      // Store pending registration data
      setPendingEmail(email);
      setPendingName(name);
      setPendingPassword(password);
      
      // Generate OTP and set expiry time (5 minutes from now)
      const otp = generateOTP();
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5);
      
      // First store OTP and expiry time so we don't lose it if email fails
      localStorage.setItem('lifemate_pending_otp', otp);
      localStorage.setItem('lifemate_otp_expiry', expiryTime.toISOString());
      setOtpExpiry(expiryTime);
      
      // Send OTP email
      const emailResult = await sendOTPEmail({ email, otp });
      
      if (!emailResult.success) {
        throw new Error('Failed to send verification email. Please try again later.');
      }
      
      // Show success message
      toast({
        title: "Verification Required",
        description: "We've sent a verification code to your email. Please check and enter the code.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not complete registration. Please try again.",
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
      
      // Generate new OTP and set new expiry time
      const otp = generateOTP();
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5);
      
      // First store new OTP and expiry time
      localStorage.setItem('lifemate_pending_otp', otp);
      localStorage.setItem('lifemate_otp_expiry', expiryTime.toISOString());
      setOtpExpiry(expiryTime);
      
      // Send new OTP email
      const emailResult = await sendOTPEmail({ email: pendingEmail, otp });
      
      if (!emailResult.success) {
        throw new Error('Failed to send verification email. Please try again later.');
      }
      
      toast({
        title: "Code Resent",
        description: `We've resent a verification code to ${pendingEmail}. Please check your email.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Failed to resend code",
        description: error instanceof Error ? error.message : "Could not resend verification code. Please try again.",
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
      
      const storedOTP = localStorage.getItem('lifemate_pending_otp');
      const storedExpiry = localStorage.getItem('lifemate_otp_expiry');
      
      if (!storedOTP || !storedExpiry) {
        throw new Error('Verification code not found. Please request a new one.');
      }
      
      const expiryTime = new Date(storedExpiry);
      if (new Date() > expiryTime) {
        throw new Error('Verification code has expired. Please request a new one.');
      }
      
      if (otp !== storedOTP) {
        throw new Error('Invalid verification code. Please try again.');
      }
      
      // Create mock user after successful verification
      const mockUser = {
        id: '1',
        name: pendingName || 'User',
        email: pendingEmail || 'user@example.com',
      };
      
      setUser(mockUser);
      localStorage.setItem('lifemate_user', JSON.stringify(mockUser));
      
      // Clear verification data
      setPendingEmail(null);
      setPendingName(null);
      setPendingPassword(null);
      setOtpExpiry(null);
      localStorage.removeItem('lifemate_pending_otp');
      localStorage.removeItem('lifemate_otp_expiry');
      
      toast({
        title: "Verification Successful!",
        description: "Your account has been verified and created successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Could not verify your account. Please try again.",
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
