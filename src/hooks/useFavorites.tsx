import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerProfile } from "./useCustomerProfile";
import type { Profile } from "./useProfile";

export interface Favorite {
  id: string;
  customer_id: string;
  professional_id: string;
  created_at: string;
  professional?: Profile;
}

export const useFavorites = () => {
  const { profile } = useCustomerProfile();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFavorites = async () => {
    if (!profile?.id) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          *,
          professional:profiles(*)
        `)
        .eq("customer_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites((data as Favorite[]) || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [profile?.id]);

  const addFavorite = async (professionalId: string) => {
    if (!profile?.id) return { error: new Error("No customer profile") };

    try {
      const { error } = await supabase
        .from("favorites")
        .insert({
          customer_id: profile.id,
          professional_id: professionalId,
        });

      if (error) throw error;
      await fetchFavorites();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const removeFavorite = async (professionalId: string) => {
    if (!profile?.id) return { error: new Error("No customer profile") };

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("customer_id", profile.id)
        .eq("professional_id", professionalId);

      if (error) throw error;
      await fetchFavorites();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const isFavorite = (professionalId: string) => {
    return favorites.some(f => f.professional_id === professionalId);
  };

  return { favorites, loading, error, addFavorite, removeFavorite, isFavorite, refetch: fetchFavorites };
};
