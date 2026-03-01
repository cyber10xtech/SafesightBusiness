import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { labelToEnum, enumToLabel } from "@/constants/professions";

// ── Public Profile shape (what the app works with) ────────────────────────────
// `profession` is the display label (e.g. "Architect"), resolved from the DB
// enum values via profiles_compat_view → enumToLabel helper.
export interface Profile {
  id: string;
  user_id: string;
  account_type: "professional" | "handyman";
  full_name: string;
  profession: string | null; // display label resolved from specialty enum
  bio: string | null;
  location: string | null;
  phone_number: string | null; // from profiles_private (merged in here)
  whatsapp_number: string | null; // from profiles_private (merged in here)
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

// ── Fetch from profiles_compat_view (has merged `profession` text field) ───────
const fetchMergedProfile = async (userId: string): Promise<Profile | null> => {
  // profiles_compat_view exposes a `profession` column that merges
  // profession_specialty + handyman_specialty into a single text value
  // matching the DB enum string (e.g. "architect", "plumber").
  const { data: profileData, error: profileError } = await supabase
    .from("profiles_compat_view")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profileData) return null;

  // Fetch private contact fields (stored in a separate table)
  const { data: privateData, error: privateError } = await supabase
    .from("profiles_private")
    .select("phone_number, whatsapp_number")
    .eq("profile_id", profileData.id)
    .maybeSingle();

  if (privateError) throw privateError;

  const accountType = profileData.account_type as "professional" | "handyman";

  // Convert the DB enum value → human-readable display label
  const professionLabel = profileData.profession ? enumToLabel(profileData.profession, accountType) : null;

  return {
    id: profileData.id,
    user_id: profileData.user_id ?? userId,
    account_type: accountType,
    full_name: profileData.full_name,
    profession: professionLabel,
    bio: (profileData as any).bio ?? null,
    location: (profileData as any).location ?? null,
    daily_rate: (profileData as any).daily_rate ?? null,
    contract_rate: (profileData as any).contract_rate ?? null,
    skills: (profileData as any).skills ?? [],
    documents_uploaded: (profileData as any).documents_uploaded ?? false,
    avatar_url: (profileData as any).avatar_url ?? null,
    is_verified: (profileData as any).is_verified ?? false,
    interests: (profileData as any).interests ?? [],
    created_at: profileData.created_at,
    updated_at: profileData.updated_at,
    phone_number: privateData?.phone_number ?? null,
    whatsapp_number: privateData?.whatsapp_number ?? null,
  };
};

// ── Hook ──────────────────────────────────────────────────────────────────────

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

  // ── updateProfile ──────────────────────────────────────────────────────────
  // Accepts the same field names the UI works with.
  // When `profession` (display label) is updated it maps back to the correct
  // DB specialty column (profession_specialty or handyman_specialty).
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
        } else if (key === "profession") {
          // Map display label → DB enum and write to the correct specialty column
          const label = value as string | null;
          if (label) {
            const enumVal = labelToEnum(label, profile.account_type);
            if (!enumVal) {
              return { error: new Error(`Unknown profession: "${label}"`) };
            }
            if (profile.account_type === "professional") {
              publicUpdates["profession_specialty"] = enumVal;
            } else {
              publicUpdates["handyman_specialty"] = enumVal;
            }
          }
        } else {
          publicUpdates[key] = value;
        }
      }

      // Update public profile fields
      if (Object.keys(publicUpdates).length > 0) {
        const { error } = await supabase.from("profiles").update(publicUpdates).eq("user_id", user.id);
        if (error) throw error;
      }

      // Upsert private profile fields
      if (Object.keys(privateUpdates).length > 0) {
        const { error } = await supabase
          .from("profiles_private")
          .upsert({ profile_id: profile.id, ...privateUpdates }, { onConflict: "profile_id" });
        if (error) throw error;
      }

      // Refetch merged profile to reflect changes
      const merged = await fetchMergedProfile(user.id);
      setProfile(merged);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return { profile, loading, error, updateProfile, profileExists };
};
