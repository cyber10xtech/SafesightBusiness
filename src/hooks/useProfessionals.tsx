import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "./useProfile";

// Escape special ILIKE pattern characters to prevent injection
const escapeIlikePattern = (str: string): string => {
  return str.replace(/[%_\\]/g, '\\$&');
};

// Limit search input length for performance
const sanitizeSearchInput = (input: string, maxLength = 100): string => {
  const trimmed = input.trim().slice(0, maxLength);
  return escapeIlikePattern(trimmed);
};

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfessionals = async (filters?: {
    profession?: string;
    location?: string;
    search?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.profession) {
        query = query.eq("profession", filters.profession);
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
      setProfessionals((data as Profile[]) || []);
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
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  return { professionals, loading, error, fetchProfessionals, getProfessionalById };
};
