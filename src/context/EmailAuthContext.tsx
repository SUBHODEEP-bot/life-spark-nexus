
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Create context with default values
const EmailAuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  loading: true,
});

// Provider component
export const EmailAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('email_auth_user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Get registered users
      const usersJson = localStorage.getItem('email_registered_users');
      const users: Array<User & { password: string }> = usersJson ? JSON.parse(usersJson) : [];
      
      // Find user
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Create user object without password
        const { password: _, ...userWithoutPassword } = foundUser;
        
        // Store in localStorage and state
        localStorage.setItem('email_auth_user', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        
        toast({
          title: 'Login successful',
          description: `Welcome back, ${foundUser.name || email}!`,
        });
        
        return true;
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Get registered users
      const usersJson = localStorage.getItem('email_registered_users');
      const users: Array<User & { password: string }> = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        toast({
          title: 'Registration failed',
          description: 'Email already registered',
          variant: 'destructive',
        });
        
        return false;
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        password,
      };
      
      // Add to registered users
      const updatedUsers = [...users, newUser];
      localStorage.setItem('email_registered_users', JSON.stringify(updatedUsers));
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store in localStorage and state
      localStorage.setItem('email_auth_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast({
        title: 'Registration successful',
        description: `Welcome, ${name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      
      toast({
        title: 'Registration error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('email_auth_user');
    setUser(null);
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  // Create context value
  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <EmailAuthContext.Provider value={value}>{children}</EmailAuthContext.Provider>;
};

// Custom hook to use the auth context
export const useEmailAuth = () => useContext(EmailAuthContext);
