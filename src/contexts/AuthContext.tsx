"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "scholar" | "user" | "writer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  joinedAt: string;
  bio?: string;
  specialization?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  specialization?: string;
  bio?: string;
}

// Mock users database
const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  "scholar@ummahthoughts.com": {
    id: "s1",
    name: "Dr. Ahmad Al-Rashid",
    email: "scholar@ummahthoughts.com",
    password: "demo1234",
    role: "scholar",
    avatar: "A",
    joinedAt: "2023-01-15",
    specialization: "Fiqh al-Siyasah",
    bio: "Professor of Islamic Political Thought with 20 years of experience.",
  },
  "user@ummahthoughts.com": {
    id: "u1",
    name: "Omar Abdullah",
    email: "user@ummahthoughts.com",
    password: "demo1234",
    role: "user",
    avatar: "O",
    joinedAt: "2024-03-10",
    bio: "Enthusiastic learner of Islamic sciences.",
  },
  "writer@ummahthoughts.com": {
    id: "w1",
    name: "Fatima Zahra",
    email: "writer@ummahthoughts.com",
    password: "demo1234",
    role: "writer",
    avatar: "F",
    joinedAt: "2023-08-22",
    specialization: "Islamic Governance & History",
    bio: "Author and researcher specializing in Islamic civilization.",
  },
  "admin@ummahthoughts.com": {
    id: "a1",
    name: "Admin Controller",
    email: "admin@ummahthoughts.com",
    password: "admin1234",
    role: "admin",
    avatar: "A",
    joinedAt: "2022-06-01",
    bio: "Platform administrator with full access to all controls.",
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ummahthoughts_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS[email.toLowerCase()];
    if (!found) return { success: false, error: "No account found with this email." };
    if (found.password !== password) return { success: false, error: "Incorrect password." };
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem("ummahthoughts_user", JSON.stringify(userData));
    return { success: true };
  };

  const register = async (data: RegisterData) => {
    await new Promise((r) => setTimeout(r, 900));
    if (MOCK_USERS[data.email.toLowerCase()]) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: AuthUser = {
      id: `new_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.name[0].toUpperCase(),
      joinedAt: new Date().toISOString().split("T")[0],
      specialization: data.specialization,
      bio: data.bio,
    };
    setUser(newUser);
    localStorage.setItem("ummahthoughts_user", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ummahthoughts_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
