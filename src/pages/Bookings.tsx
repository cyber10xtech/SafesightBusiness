import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Loader2, Phone, MessageSquare } from "lucide-react";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type TabFilter = "all" | "pending" | "confirmed" | "completed";

interface Booking {
  id: string;
  service_type: string;
  description: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  status: string;
  rate_type: string | null;
  rate_amount: number | null;
  notes: string | null;
  created_at: string;
  customer_id: string;
}

const Bookings = () => {
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!profile?.id) return;

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("professional_id", profile.id)
          .order("scheduled_date", { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Error fetching bookings:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [profile?.id]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      );
      toast.success(`Booking ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update booking");
    }
  };

  const filteredBookings = activeTab === "all" 
    ? bookings 
    : bookings.filter((b) => b.status === activeTab);

  const tabs: { id: TabFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: bookings.length },
    { id: "pending", label: "Pending", count: bookings.filter(b => b.status === "pending").length },
    { id: "confirmed", label: "Confirmed", count: bookings.filter(b => b.status === "confirmed").length },
    { id: "completed", label: "Completed", count: bookings.filter(b => b.status === "completed").length },
  ];

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-";
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success";
      case "confirmed": return "bg-primary/10 text-primary";
      case "in_progress": return "bg-warning/10 text-warning";
      case "cancelled": return "bg-destructive/10 text-destructive";
      default: return "bg-warning/10 text-warning";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Bookings" showBack />

      {/* Tabs */}
      <div className="px-4 py-3 bg-card border-b border-border overflow-x-auto">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {activeTab === "all" ? "No bookings yet" : `No ${activeTab} bookings`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Booking requests from customers will appear here
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground">{booking.service_type}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.scheduled_date).toLocaleDateString("en-NG", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                    {booking.scheduled_time && ` at ${booking.scheduled_time}`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace("_", " ")}
                </span>
              </div>

              {/* Description */}
              {booking.description && (
                <p className="text-sm text-muted-foreground">{booking.description}</p>
              )}

              {/* Rate */}
              <div className="flex items-center justify-between">
                <div>
                  {booking.rate_type && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {booking.rate_type.charAt(0).toUpperCase() + booking.rate_type.slice(1)} Rate
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(booking.rate_amount)}</p>
              </div>

              {/* Actions */}
              {booking.status === "pending" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive border-destructive/30"
                    onClick={() => updateStatus(booking.id, "cancelled")}
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => updateStatus(booking.id, "confirmed")}
                  >
                    Accept
                  </Button>
                </div>
              )}

              {booking.status === "confirmed" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => updateStatus(booking.id, "in_progress")}
                  >
                    Start Job
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => updateStatus(booking.id, "completed")}
                  >
                    Mark Complete
                  </Button>
                </div>
              )}

              {booking.status === "in_progress" && (
                <div className="pt-2 border-t border-border">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => updateStatus(booking.id, "completed")}
                  >
                    Mark as Completed
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Bookings;
