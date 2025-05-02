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
  const [isInitialized, setIsInitialized] = useState(false);
  
  // User registration state
  const [pendingRegistration, setPendingRegistration] = useState<RegisteredUser | null>(null);
  
  // Mock registered users database (simulated with localStorage)
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  
  // Get registered users from localStorage on initial load
  useEffect(() => {
    console.log('🔄 AuthProvider: Loading registered users from localStorage');
    try {
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        console.log('📋 Registered users loaded:', parsedUsers);
        setRegisteredUsers(parsedUsers);
      } else {
        console.log('❌ No registered users found in localStorage');
        setRegisteredUsers([]);
      }
    } catch (error) {
      console.error('❌ Error loading registered users:', error);
      setRegisteredUsers([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);
  
  // Save registered users to localStorage when changed
  useEffect(() => {
    if (registeredUsers.length > 0) {
      console.log('💾 Saving registered users to localStorage:', registeredUsers);
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

  // Check authentication status AFTER registered users are loaded
  useEffect(() => {
    if (!isInitialized) {
      console.log('⏳ Waiting for registered users to initialize before checking auth');
      return;
    }
    
    console.log('🔐 Checking authentication status now that registered users are loaded');
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if there's a user session in localStorage
        const storedSession = localStorage.getItem('userSession');
        console.log('🔍 Stored session found:', storedSession ? 'Yes' : 'No');
        
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          console.log('📱 Parsed session:', parsedSession);
          
          // Validate if the stored user exists in registered users
          const userExists = registeredUsers.find(
            u => u.email === parsedSession.email && u.verified
          );
          
          console.log('👤 User exists in registered users?', userExists ? 'Yes' : 'No');
          
          if (userExists) {
            console.log('✅ Setting user from stored session:', userExists);
            setUser({
              id: userExists.id,
              name: userExists.name,
              email: userExists.email,
              verified: userExists.verified
            });
          } else {
            // Only clear session if user definitely doesn't exist
            // (Not just because registeredUsers might not be loaded yet)
            if (registeredUsers.length > 0) {
              console.log('❌ User from session not found in registered users, clearing session');
              localStorage.removeItem('userSession');
              setUser(null);
            } else {
              console.log('⚠️ No registered users loaded yet, keeping session for now');
            }
          }
        } else {
          console.log('🚫 No stored session found, user not logged in');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [isInitialized, registeredUsers]); // Run when registeredUsers changes or initialization completes

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
    console.log('🔑 Login attempt:', email);
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in registered users
      const foundUser = registeredUsers.find(user => user.email === email);
      console.log('👤 User found in registered users?', foundUser ? 'Yes' : 'No');
      
      if (!foundUser) {
        return { success: false, message: "User not found. Please register first." };
      }
      
      if (!foundUser.verified) {
        // Set as pending registration to allow OTP verification
        console.log('⚠️ User found but not verified, setting as pending registration');
        setPendingRegistration(foundUser);
        return { success: false, message: "Email not verified. Please verify your email first." };
      }
      
      // Check password
      if (foundUser.password !== password) {
        console.log('❌ Incorrect password attempt');
        return { success: false, message: "Incorrect password." };
      }
      
      // Success - set user
      const loggedInUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        verified: true
      };
      
      console.log('✅ Login successful, setting user:', loggedInUser);
      setUser(loggedInUser);
      
      // Save robust session to localStorage
      const userSession = {
        email: foundUser.email,
        userId: foundUser.id,
        verified: true,
        timestamp: new Date().getTime()
      };
      
      console.log('💾 Saving user session to localStorage:', userSession);
      localStorage.setItem('userSession', JSON.stringify(userSession));
      
      return { success: true, message: "Login successful." };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, message: "An error occurred during login. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
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
