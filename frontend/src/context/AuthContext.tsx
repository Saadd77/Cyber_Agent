import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Simple email validation
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('pentestUser');
        
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('Found stored user:', parsedUser);
            setUser(parsedUser);
          } catch (parseError) {
            console.log('Invalid stored user data, clearing...');
            localStorage.removeItem('pentestUser');
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        localStorage.removeItem('pentestUser');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    console.log('Login attempt with:', credentials.email);
    setIsLoading(true);
    setError(null);
    
    try {
      // Simple validation - just check if email is valid format
      if (!isValidEmail(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Create a mock user based on the email
      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        first_name: credentials.email.split('@')[0].split('.')[0] || 'User',
        last_name: 'Demo',
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      // Store the user
      localStorage.setItem('pentestUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      console.log('Login successful for:', mockUser);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupRequest) => {
    console.log('Signup attempt with:', userData.email);
    setIsLoading(true);
    setError(null);
    
    try {
      // Simple validation
      if (!isValidEmail(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Create user from signup data
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      // Store and set user
      localStorage.setItem('pentestUser', JSON.stringify(newUser));
      setUser(newUser);
      
      console.log('Signup successful for:', newUser);
      
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('pentestUser');
    localStorage.removeItem('currentProject');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};