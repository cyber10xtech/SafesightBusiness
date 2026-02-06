import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, ProStats } from "./useProfile";

export const useProStats = () => {
  const { profile } = useProfile();
  const [stats, setStats] = useState<ProStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) {
      setStats(null);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("pro_stats")
          .select("*")
          .eq("pro_id", profile.id)
          .maybeSingle();

        if (error) throw error;
        setStats(data as ProStats | null);
      } catch (err) {
        console.error("Error fetching pro stats:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [profile?.id]);

  return { stats, loading };
};
