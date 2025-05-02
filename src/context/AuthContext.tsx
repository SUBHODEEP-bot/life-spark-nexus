
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

// Registered user for auth simulation
interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
}

type ThemeType = 'light' | 'dark' | 'system';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean; message: string}>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{success: boolean; message: string}>;
  verifyOTP: (otp: string) => Promise<{success: boolean; message: string}>;
  resendOTP: () => Promise<boolean>;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeType>('system');
  
  // User registration state
  const [pendingRegistration, setPendingRegistration] = useState<RegisteredUser | null>(null);
  
  // Mock registered users database (simulated with localStorage)
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  
  // Get registered users from localStorage on initial load
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        setRegisteredUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error('Error loading registered users:', error);
    }
  }, []);
  
  // Save registered users to localStorage when changed
  useEffect(() => {
    if (registeredUsers.length > 0) {
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
  }, [registeredUsers]);

  // Set theme from localStorage or default to system
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeType | null;
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      let effectiveTheme: 'light' | 'dark';
      
      if (theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        effectiveTheme = theme;
      }
      
      if (effectiveTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Set theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Simulate authentication loading
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if there's a user session in localStorage
        const storedSession = localStorage.getItem('userSession');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          
          // Validate if the stored user exists in registered users
          const userExists = registeredUsers.find(
            u => u.email === parsedSession.email && u.verified
          );
          
          if (userExists) {
            setUser({
              id: userExists.id,
              name: userExists.name,
              email: userExists.email,
              verified: userExists.verified
            });
          } else {
            // Clear invalid session
            localStorage.removeItem('userSession');
            setUser(null);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        setUser(null);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [registeredUsers]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case 'light': return 'dark';
        case 'dark': return 'system';
        case 'system': return 'light';
        default: return 'system';
      }
    });
  };

  const login = async (email: string, password: string): Promise<{success: boolean; message: string}> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in registered users
      const foundUser = registeredUsers.find(user => user.email === email);
      
      if (!foundUser) {
        return { success: false, message: "User not found. Please register first." };
      }
      
      if (!foundUser.verified) {
        // Set as pending registration to allow OTP verification
        setPendingRegistration(foundUser);
        return { success: false, message: "Email not verified. Please verify your email first." };
      }
      
      // Check password
      if (foundUser.password !== password) {
        return { success: false, message: "Incorrect password." };
      }
      
      // Success - set user
      const loggedInUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        verified: true
      };
      
      setUser(loggedInUser);
      
      // Save session to localStorage
      localStorage.setItem('userSession', JSON.stringify({
        email: foundUser.email,
        timestamp: new Date().getTime()
      }));
      
      return { success: true, message: "Login successful." };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: "An error occurred during login. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userSession');
  };
  
  const register = async (name: string, email: string, password: string): Promise<{success: boolean; message: string}> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = registeredUsers.find(user => user.email === email);
      
      if (userExists) {
        if (userExists.verified) {
          return { success: false, message: "Email already registered. Please login instead." };
        } else {
          // User exists but not verified
          setPendingRegistration(userExists);
          return { success: true, message: "Please complete email verification." };
        }
      }
      
      // Create new unverified user
      const newUser: RegisteredUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        verified: false
      };
      
      // Store as pending registration
      setPendingRegistration(newUser);
      
      // Add to registered users (but not verified yet)
      setRegisteredUsers(prev => [...prev, newUser]);
      
      return { success: true, message: "Registration initiated. Please verify your email." };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: "An error occurred during registration. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyOTP = async (otp: string): Promise<{success: boolean; message: string}> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For development, log the OTP to console
      console.log('[Development] Verifying OTP:', otp);
      
      if (!pendingRegistration) {
        return { success: false, message: "No pending registration found." };
      }
      
      // Mock verification - in a real app, this would validate with a backend
      const isValid = otp.length === 6;
      
      if (!isValid) {
        return { success: false, message: "Invalid verification code." };
      }
      
      // Mark user as verified
      const updatedUsers = registeredUsers.map(user => 
        user.email === pendingRegistration.email 
          ? { ...user, verified: true } 
          : user
      );
      
      setRegisteredUsers(updatedUsers);
      
      // Set the user as logged in
      const verifiedUser = {
        id: pendingRegistration.id,
        name: pendingRegistration.name,
        email: pendingRegistration.email,
        verified: true
      };
      
      setUser(verifiedUser);
      
      // Save session to localStorage
      localStorage.setItem('userSession', JSON.stringify({
        email: pendingRegistration.email,
        timestamp: new Date().getTime()
      }));
      
      // Clear pending registration
      setPendingRegistration(null);
      
      return { success: true, message: "Email verified successfully." };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, message: "An error occurred during verification. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };
  
  const resendOTP = async (): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!pendingRegistration) {
        return false;
      }
      
      // For development, generate and log a new OTP to console
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('[Development] New OTP generated for', pendingRegistration.email, ':', newOTP);
      
      return true;
    } catch (error) {
      console.error('Resend OTP error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        verifyOTP,
        resendOTP,
        theme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
