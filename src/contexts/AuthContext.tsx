import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';

/*
  Auth Context - Provides authentication state throughout the app.
  For the hackathon demo, I'm using localStorage to simulate auth.
  In production, this would connect to Better-Auth's backend.
*/

interface UserProfile {
    id: string;
    email: string;
    name: string;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    softwareBackground: string;
    hardwareBackground: string;
    programmingLanguages: string[];
    interests: string[];
}

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (data: SignupData) => Promise<boolean>;
    logout: () => void;
}

interface SignupData {
    email: string;
    password: string;
    name: string;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    softwareBackground: string;
    hardwareBackground: string;
    programmingLanguages: string[];
    interests: string[];
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'ai_textbook_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse stored user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // For demo, accept any login and load stored user
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setUser(JSON.parse(stored));
            return true;
        }
        return false;
    };

    const signup = async (data: SignupData): Promise<boolean> => {
        try {
            const newUser: UserProfile = {
                id: crypto.randomUUID(),
                email: data.email,
                name: data.name,
                experienceLevel: data.experienceLevel,
                softwareBackground: data.softwareBackground,
                hardwareBackground: data.hardwareBackground,
                programmingLanguages: data.programmingLanguages,
                interests: data.interests,
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
            setUser(newUser);
            return true;
        } catch (e) {
            console.error('Signup error:', e);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            signup,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
