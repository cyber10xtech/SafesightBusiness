import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  zip_code: string | null;
  avatar_url: string | null;
  referral_code: string | null;
  referral_credits: number;
  created_at: string;
  updated_at: string;
}

export const useCustomerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("customer_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const createProfile = async (profileData: Partial<CustomerProfile>) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const referralCode = `HANDY${user.id.slice(0, 6).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from("customer_profiles")
        .insert({
          user_id: user.id,
          full_name: profileData.full_name || user.email?.split("@")[0] || "Customer",
          email: profileData.email || user.email,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          zip_code: profileData.zip_code,
          referral_code: referralCode,
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { error: null, data };
    } catch (err) {
      return { error: err as Error, data: null };
    }
  };

  const updateProfile = async (updates: Partial<CustomerProfile>) => {
    if (!user || !profile) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("customer_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);

      if (error) throw error;

      // Refetch profile
      const { data } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setProfile(data);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return { profile, loading, error, createProfile, updateProfile };
};
