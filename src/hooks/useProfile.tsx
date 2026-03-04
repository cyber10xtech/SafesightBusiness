import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { labelToEnum, enumToLabel } from "@/constants/professions";

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

  const accountType = profileData.account_type as "professional" | "handyman";
  const professionLabel = profileData.profession ? enumToLabel(profileData.profession) : null;

  return {
    id: profileData.id,
    user_id: profileData.user_id,
    account_type: accountType,
    full_name: profileData.full_name,
    profession: professionLabel,
    bio: profileData.bio ?? null,
    location: profileData.location ?? null,
    daily_rate: profileData.daily_rate ?? null,
    contract_rate: profileData.contract_rate ?? null,
    skills: profileData.skills ?? [],
    documents_uploaded: profileData.documents_uploaded ?? false,
    avatar_url: profileData.avatar_url ?? null,
    is_verified: profileData.is_verified ?? false,
    interests: profileData.interests ?? [],
    created_at: profileData.created_at,
    updated_at: profileData.updated_at,
    phone_number: privateData?.phone_number ?? null,
    whatsapp_number: privateData?.whatsapp_number ?? null,
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

  const updateProfile = async (
    updates: Partial<Omit<Profile, "id" | "user_id" | "account_type" | "created_at" | "updated_at">>,
  ) => {
    if (!user || !profile) return { error: new Error("Not authenticated") };

    try {
      const privateUpdates: Record<string, string | null> = {};
      const publicUpdates: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(updates)) {
        if ((PRIVATE_FIELDS as readonly string[]).includes(key)) {
          privateUpdates[key] = value as string | null;
        } else {
          publicUpdates[key] = value;
        }
      }

      if (Object.keys(publicUpdates).length > 0) {
        const { error } = await supabase.from("profiles").update(publicUpdates).eq("user_id", user.id);
        if (error) throw error;
      }

      if (Object.keys(privateUpdates).length > 0) {
        const { error } = await supabase
          .from("profiles_private")
          .upsert({ profile_id: profile.id, ...privateUpdates }, { onConflict: "profile_id" });
        if (error) throw error;
      }

      const merged = await fetchMergedProfile(user.id);
      setProfile(merged);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return { profile, loading, error, updateProfile, profileExists };
};
