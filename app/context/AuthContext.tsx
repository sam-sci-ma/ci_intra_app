"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* =========================================
     Restore session on app load
  ========================================= */

  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
        setIsLoading(false);
        return;
      }

      const sessionUser = data.session?.user;
      if (!sessionUser) {
        setIsLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("staff_profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .single();

      if (profileError || !profile || !profile.is_approved) {
        await supabase.auth.signOut();
        setUser(null);
        setIsLoading(false);
        return;
      }

      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role
      });

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  /* =========================================
     Login
  ========================================= */

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Authentication failed");
      }

      const { data: profile, error: profileError } = await supabase
        .from("staff_profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error("User profile not found");
      }

      if (!profile.is_approved) {
        await supabase.auth.signOut();
        throw new Error("Account pending admin approval");
      }

      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================
     Logout
  ========================================= */

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* =========================================
   Hook
========================================= */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
