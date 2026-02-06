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
  avatar_url: string | null;
  is_verified: boolean;
  interests: string[];
  created_at: string;
  updated_at: string;
}

export interface ProStats {
  pro_id: string;
  jobs: number;
  earnings: number;
  rating: number;
  views: number;
  last_updated: string;
}

// Fields stored in profiles_private table
const PRIVATE_FIELDS = ["phone_number", "whatsapp_number"] as const;

const fetchMergedProfile = async (userId: string): Promise<Profile | null> => {
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profileData) return null;

  const { data: privateData, error: privateError } = await supabase
    .from("profiles_private")
    .select("phone_number, whatsapp_number")
    .eq("profile_id", profileData.id)
    .maybeSingle();

  if (privateError) throw privateError;

  return {
    ...(profileData as Omit<Profile, "phone_number" | "whatsapp_number">),
    phone_number: privateData?.phone_number ?? null,
    whatsapp_number: privateData?.whatsapp_number ?? null,
    is_verified: (profileData as any).is_verified ?? false,
    interests: (profileData as any).interests ?? [],
  };
};

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

    const load = async () => {
      try {
        setLoading(true);
        const merged = await fetchMergedProfile(user.id);
        setProfile(merged);
        setProfileExists(merged !== null);
      } catch (err) {
        setError(err as Error);
        setProfileExists(false);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const updateProfile = async (updates: Partial<Omit<Profile, "id" | "user_id" | "account_type" | "created_at" | "updated_at">>) => {
    if (!user || !profile) return { error: new Error("Not authenticated") };

    try {
      // Split updates into public (profiles) and private (profiles_private) fields
      const privateUpdates: Record<string, string | null> = {};
      const publicUpdates: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(updates)) {
        if ((PRIVATE_FIELDS as readonly string[]).includes(key)) {
          privateUpdates[key] = value as string | null;
        } else {
          publicUpdates[key] = value;
        }
      }

      // Update public profile fields
      if (Object.keys(publicUpdates).length > 0) {
        const { error } = await supabase
          .from("profiles")
          .update(publicUpdates)
          .eq("user_id", user.id);
        if (error) throw error;
      }

      // Upsert private profile fields
      if (Object.keys(privateUpdates).length > 0) {
        const { error } = await supabase
          .from("profiles_private")
          .upsert(
            { profile_id: profile.id, ...privateUpdates },
            { onConflict: "profile_id" }
          );
        if (error) throw error;
      }

      // Refetch merged profile
      const merged = await fetchMergedProfile(user.id);
      setProfile(merged);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return { profile, loading, error, updateProfile, profileExists };
};
