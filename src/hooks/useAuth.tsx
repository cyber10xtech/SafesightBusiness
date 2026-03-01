import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import type { ProfessionSpecialtyEnum, HandymanSpecialtyEnum } from "@/constants/professions";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    profileData: ProfileData,
  ) => Promise<{ error: Error | null; userId?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export interface ProfileData {
  accountType: "professional" | "handyman";
  fullName: string;
  // ── Unified DB: specialty must be the enum value, not display label ──────────
  // Exactly one of these is set depending on accountType; the other is omitted.
  professionSpecialty?: ProfessionSpecialtyEnum; // professionals only
  handymanSpecialty?: HandymanSpecialtyEnum; // handymen only
  // ── Optional profile fields set in later steps ──────────────────────────────
  bio?: string;
  location?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  dailyRate?: string;
  contractRate?: string;
  skills?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    profileData: ProfileData,
  ): Promise<{ error: Error | null; userId?: string }> => {
    try {
      // ── Build metadata for the handle_new_user DB trigger ──────────────────
      // The trigger routes by account_type and reads specialty from metadata.
      // Both profession_specialty and handyman_specialty must be present (one
      // will be null/absent, but the trigger only uses the relevant one).
      const metadata: Record<string, string> = {
        account_type: profileData.accountType,
        full_name: profileData.fullName,
      };

      if (profileData.accountType === "professional" && profileData.professionSpecialty) {
        metadata.profession_specialty = profileData.professionSpecialty;
      } else if (profileData.accountType === "handyman" && profileData.handymanSpecialty) {
        metadata.handyman_specialty = profileData.handymanSpecialty;
      } else {
        // Specialty not yet provided — cannot create profile without it.
        throw new Error("Please select your profession before creating your account.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: metadata,
        },
      });

      if (error) throw error;

      if (data.user) {
        return { error: null, userId: data.user.id };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
