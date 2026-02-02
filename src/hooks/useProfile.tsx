import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Profile {
  id: string;
  user_id: string;
  account_type: "professional" | "handyman";
  full_name: string;
  profession: string | null;
  bio: string | null;
  location: string | null;
  phone_number: string | null;
  whatsapp_number: string | null;
  daily_rate: string | null;
  contract_rate: string | null;
  skills: string[];
  documents_uploaded: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profileExists, setProfileExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      setProfileExists(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        
        setProfile(data as Profile | null);
        setProfileExists(data !== null);
      } catch (err) {
        setError(err as Error);
        setProfileExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Omit<Profile, "id" | "user_id" | "account_type" | "created_at" | "updated_at">>) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      // Refetch profile
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setProfile(data as Profile);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return { profile, loading, error, updateProfile, profileExists };
};
