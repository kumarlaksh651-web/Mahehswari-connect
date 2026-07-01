import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  fatherName: string;
  akka: string;
  country: string;
  city: string;
  qualification: string;
  phone: string;
  countryCode: string;
  email: string;
  photo?: string;
  verified: boolean;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
}

interface StoredUser {
  email: string;
  password: string;
  profile: UserProfile;
}

interface AuthStore {
  users: StoredUser[];
  currentUserId: string | null;
}

interface RegisterData {
  name: string;
  fatherName: string;
  akka: string;
  country: string;
  city: string;
  qualification: string;
  phone: string;
  countryCode: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "@dhat_maheshwari_auth_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuth();
  }, []);

  async function loadAuth() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const store: AuthStore = JSON.parse(stored);
        if (store.currentUserId) {
          const found = store.users.find((u) => u.profile.id === store.currentUserId);
          if (found) setUser(found.profile);
        }
      }
    } catch {}
    finally {
      setIsLoading(false);
    }
  }

  async function getStore(): Promise<AuthStore> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as AuthStore;
    } catch {}
    return { users: [], currentUserId: null };
  }

  async function saveStore(store: AuthStore) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  async function register(email: string, password: string, data: RegisterData) {
    const store = await getStore();
    const exists = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: "An account with this email already exists." };
    }
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const profile: UserProfile = {
      id,
      email,
      verified: true,
      ...data,
    };
    store.users.push({ email: email.toLowerCase(), password, profile });
    store.currentUserId = id;
    await saveStore(store);
    setUser(profile);
    return { success: true };
  }

  async function login(email: string, password: string) {
    const store = await getStore();
    const found = store.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password." };
    store.currentUserId = found.profile.id;
    await saveStore(store);
    setUser(found.profile);
    return { success: true };
  }

  async function logout() {
    const store = await getStore();
    store.currentUserId = null;
    await saveStore(store);
    setUser(null);
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) return;
    const store = await getStore();
    const idx = store.users.findIndex((u) => u.profile.id === user.id);
    if (idx >= 0) {
      store.users[idx].profile = { ...store.users[idx].profile, ...updates };
      await saveStore(store);
      setUser({ ...user, ...updates });
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
