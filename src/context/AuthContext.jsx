import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { activityLogService } from "../services/activityLogService";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndSetUser = async (authUser, currentSession) => {
    if (!authUser) {
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }

    try {
      // Get the profile role
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", authUser.id)
        .single();

      const fullName = authUser.email === "admin@buiq.com" 
        ? "Admin Utama" 
        : (profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User");
      const role = authUser.email === "admin@buiq.com" 
        ? "admin" 
        : (profile?.role || "member");
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setUser({
        ...authUser,
        role,
        full_name: fullName,
        firstName,
        lastName,
      });
      setSession(currentSession);
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      const fullName = authUser.email === "admin@buiq.com"
        ? "Admin Utama"
        : (authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User");
      const role = authUser.email === "admin@buiq.com" ? "admin" : "member";
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setUser({
        ...authUser,
        role,
        full_name: fullName,
        firstName,
        lastName,
      });
      setSession(currentSession);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession?.user) {
        fetchProfileAndSetUser(initialSession.user, initialSession);
      } else {
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession?.user) {
          await fetchProfileAndSetUser(currentSession.user, currentSession);
        } else {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync state back to localStorage for legacy components like crmSync.js
  useEffect(() => {
    if (user) {
      localStorage.setItem("buiq_user", JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
      }));
      if (session) {
        localStorage.setItem("buiq_token", session.access_token);
      }
    } else {
      localStorage.removeItem("buiq_user");
      localStorage.removeItem("buiq_token");
    }
  }, [user, session]);

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoading(false);
      throw error;
    }

    // Log login activity
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", data.user.id)
        .single();
        
      const fullName = data.user.email === "admin@buiq.com" 
        ? "Admin Utama" 
        : (profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User");
      const role = data.user.email === "admin@buiq.com" ? "admin" : (profile?.role || "member");
      
      await activityLogService.create({
        user_id: data.user.id,
        user_name: fullName,
        user_role: role,
        module: "User",
        activity: "Login",
        description: `Pengguna ${fullName} (${data.user.email}) berhasil masuk ke dalam sistem.`,
        reference_id: data.user.id
      });
    } catch (logErr) {
      console.error("Failed to write login log:", logErr);
    }

    return data;
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (user) {
        await activityLogService.create({
          user_id: user.id,
          user_name: user.full_name,
          user_role: user.role,
          module: "User",
          activity: "Logout",
          description: `Pengguna ${user.full_name} (${user.email}) keluar dari sistem.`,
          reference_id: user.id
        });
      }
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Supabase signOut error:", err);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem("buiq_user");
      localStorage.removeItem("buiq_token");
      sessionStorage.clear();
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
