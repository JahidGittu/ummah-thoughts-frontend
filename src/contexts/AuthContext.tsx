"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";

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
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginWithGoogle: () => void;
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

function toAuthUser(raw: any): AuthUser {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    avatar: raw.avatar || raw.name?.charAt(0)?.toUpperCase() || "U",
    joinedAt: raw.joinedAt || raw.joined_at?.split?.("T")?.[0] || "",
    bio: raw.bio,
    specialization: raw.specialization,
    avatarUrl: raw.avatarUrl,
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ummahthoughts_token");
    const stored = localStorage.getItem("ummahthoughts_user");
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
      authApi.getMe().then(({ data, error }) => {
        if (data?.user) setUser(toAuthUser(data.user));
        else if (error) {
          localStorage.removeItem("ummahthoughts_token");
          localStorage.removeItem("ummahthoughts_user");
          setUser(null);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await authApi.login(email, password);
    if (error) return { success: false, error };
    if (!data?.user || !data?.token) return { success: false, error: "Invalid response" };
    const u = toAuthUser(data.user);
    setUser(u);
    localStorage.setItem("ummahthoughts_token", data.token);
    localStorage.setItem("ummahthoughts_user", JSON.stringify(u));
    return { success: true };
  };

  const register = async (data: RegisterData) => {
    const { data: res, error } = await authApi.register({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      specialization: data.specialization,
      bio: data.bio,
    });
    if (error) return { success: false, error };
    if (!res?.user || !res?.token) return { success: false, error: "Invalid response" };
    const u = toAuthUser(res.user);
    setUser(u);
    localStorage.setItem("ummahthoughts_token", res.token);
    localStorage.setItem("ummahthoughts_user", JSON.stringify(u));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ummahthoughts_token");
    localStorage.removeItem("ummahthoughts_user");
  };

  const loginWithGoogle = () => {
    window.location.href = authApi.googleUrl();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loginWithGoogle, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
