import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Loader2, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

interface CustomerInfo {
  id: string;
  full_name: string;
  avatar_url: string | null;
  city: string | null;
}

interface RecentPro {
  id: string;
  full_name: string | null;
  profession: string | null;
  avatar_url: string | null;
}

const CustomerProfile = () => {
  const { id: customerId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [recentPros, setRecentPros] = useState<RecentPro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId || !profile?.id) return;
    const load = async () => {
      try {
        // Use secure RPC to get customer info
        const { data } = await supabase.rpc("get_limited_customer_info", {
          customer_profile_id: customerId,
        });
        if (data && data.length > 0) {
          // Also get city from customer_profiles via a booking-based check
          const { data: cpData } = await supabase
            .from("customer_profiles")
            .select("city")
            .eq("id", customerId)
            .single();

          setCustomer({
            ...data[0],
            city: cpData?.city || null,
          });
        }

        // Get recent professionals this customer has booked
        const { data: bookings } = await supabase
          .from("bookings")
          .select("professional_id")
          .eq("customer_id", customerId)
          .order("created_at", { ascending: false })
          .limit(5);

        if (bookings && bookings.length > 0) {
          const proIds = [...new Set(bookings.map(b => b.professional_id))];
          const { data: pros } = await supabase
            .from("profiles_public")
            .select("id, full_name, profession, avatar_url")
            .in("id", proIds);
          setRecentPros((pros as RecentPro[]) || []);
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [customerId, profile?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground">Customer not found or access denied</p>
      </div>
    );
  }

  const initials = customer.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Customer Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Customer header */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={customer.avatar_url || undefined} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-foreground">{customer.full_name}</h2>
          {customer.city && (
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{customer.city}</span>
            </div>
          )}
          <span className="mt-2 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">Customer</span>
        </div>

        {/* Recent professionals contacted */}
        {recentPros.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Recently Contacted</h3>
            </div>
            <div className="space-y-2">
              {recentPros.map((pro) => (
                <div key={pro.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={pro.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {pro.full_name?.split(" ").map(n => n[0]).join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-foreground">{pro.full_name}</p>
                    <p className="text-xs text-muted-foreground">{pro.profession || "Professional"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
