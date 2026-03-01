import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { enumToLabel } from "@/constants/professions";
import type { Profile } from "./useProfile";

// Escape special ILIKE pattern characters to prevent injection
const escapeIlikePattern = (str: string): string => str.replace(/[%_\\]/g, "\\$&");

// Limit search input length for performance
const sanitizeSearchInput = (input: string, maxLength = 100): string =>
  escapeIlikePattern(input.trim().slice(0, maxLength));

// Public profile type (without sensitive fields)
export interface PublicProfile {
  id: string;
  user_id: string | null;
  account_type: "professional" | "handyman";
  full_name: string;
  profession: string | null; // human-readable label (from compat view + enumToLabel)
  bio: string | null;
  location: string | null;
  skills: string[];
  avatar_url: string | null;
  daily_rate: string | null;
  contract_rate: string | null;
  documents_uploaded: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfessionals = async (filters?: {
    profession?: string; // pass a display label OR enum value — both handled
    location?: string;
    search?: string;
  }) => {
    try {
      setLoading(true);

      // profiles_compat_view merges profession_specialty + handyman_specialty
      // into a single `profession` text column (enum value string), which we
      // can filter on and then convert to display labels below.
      let query = supabase
        .from("profiles_compat_view")
        .select(
          "id, user_id, account_type, full_name, profession, bio, location, " +
            "skills, avatar_url, daily_rate, contract_rate, " +
            "documents_uploaded, is_verified, created_at, updated_at",
        )
        .order("created_at", { ascending: false });

      if (filters?.profession) {
        // The compat view `profession` column holds the enum string (e.g. "architect").
        // If caller passed a display label (e.g. "Architect") we normalise it.
        const normalised = filters.profession.toLowerCase().replace(/\s+/g, "_");
        query = query.eq("profession", normalised);
      }

      if (filters?.location) {
        const sanitized = sanitizeSearchInput(filters.location);
        query = query.ilike("location", `%${sanitized}%`);
      }

      if (filters?.search) {
        const sanitized = sanitizeSearchInput(filters.search);
        query = query.or(`full_name.ilike.%${sanitized}%,profession.ilike.%${sanitized}%,bio.ilike.%${sanitized}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Convert enum strings → human-readable display labels
      const enriched: PublicProfile[] = (data ?? []).map((row: any) => ({
        ...row,
        profession: row.profession
          ? enumToLabel(row.profession, row.account_type as "professional" | "handyman")
          : null,
        skills: row.skills ?? [],
        documents_uploaded: row.documents_uploaded ?? false,
        is_verified: row.is_verified ?? false,
      }));

      setProfessionals(enriched);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const getProfessionalById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles_compat_view")
        .select(
          "id, user_id, account_type, full_name, profession, bio, location, " +
            "skills, avatar_url, daily_rate, contract_rate, " +
            "documents_uploaded, is_verified, created_at, updated_at",
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      const enriched: PublicProfile = {
        ...(data as any),
        profession: (data as any).profession
          ? enumToLabel((data as any).profession, (data as any).account_type as "professional" | "handyman")
          : null,
        skills: (data as any).skills ?? [],
        documents_uploaded: (data as any).documents_uploaded ?? false,
        is_verified: (data as any).is_verified ?? false,
      };

      return { data: enriched, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  return { professionals, loading, error, fetchProfessionals, getProfessionalById };
};
