import { 
  Calendar, 
  DollarSign, 
  Star, 
  Briefcase, 
  TrendingUp, 
  CalendarDays,
  Settings,
  Clock,
  Loader2,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useProStats } from "@/hooks/useProStats";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BookingStats {
  total: number;
  completed: number;
  pending: number;
  thisMonthEarnings: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, profileExists } = useProfile();
  const { stats: proStats } = useProStats();
  const [stats, setStats] = useState<BookingStats>({ total: 0, completed: 0, pending: 0, thisMonthEarnings: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Redirect to complete profile if user signed in but no profile exists
  useEffect(() => {
    if (!authLoading && !profileLoading && user && profileExists === false) {
      navigate("/complete-profile");
    }
  }, [authLoading, profileLoading, user, profileExists, navigate]);

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      try {
        // Fetch bookings for this professional
        const { data: bookings, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("professional_id", profile.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const allBookings = bookings || [];
        const completed = allBookings.filter(b => b.status === "completed").length;
        const pending = allBookings.filter(b => b.status === "pending").length;
        
        // Calculate this month's earnings
        const now = new Date();
        const thisMonth = allBookings.filter(b => {
          const date = new Date(b.created_at);
          return date.getMonth() === now.getMonth() && 
                 date.getFullYear() === now.getFullYear() &&
                 b.status === "completed";
        });
        const earnings = thisMonth.reduce((sum, b) => sum + (b.rate_amount || 0), 0);

        setStats({
          total: allBookings.length,
          completed,
          pending,
          thisMonthEarnings: earnings,
        });

        // Set recent bookings (last 3)
        setRecentBookings(allBookings.slice(0, 3));
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Error fetching dashboard data:", err);
        }
      } finally {
        setLoadingData(false);
      }
    };

    if (profile?.id) {
      fetchData();
    } else {
      setLoadingData(false);
    }
  }, [profile?.id]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount}`;
  };

  const statsDisplay = [
    { icon: Calendar, label: "Total Bookings", value: stats.total.toString(), trend: "-", trendUp: true },
    { icon: DollarSign, label: "This Month", value: formatCurrency(stats.thisMonthEarnings), trend: "-", trendUp: true },
    { icon: Star, label: "Avg Rating", value: proStats?.rating?.toFixed(1) ?? "-", trend: "-", trendUp: true },
    { icon: Briefcase, label: "Completed Jobs", value: stats.completed.toString(), trend: "-", trendUp: true },
  ];

  const quickActions = [
    { icon: CalendarDays, label: "View Bookings", description: "Manage your appointments", color: "bg-primary", path: "/bookings" },
    { icon: MessageSquare, label: "Messages", description: "Chat with customers", color: "bg-success", path: "/messages" },
    { icon: Clock, label: "Job History", description: "View completed work", color: "bg-warning", path: "/job-history" },
    { icon: Settings, label: "Edit Profile", description: "Update your info", color: "bg-muted-foreground", path: "/profile" },
  ];

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">Please sign in to access your dashboard</p>
        <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Safesearch Business" notificationCount={stats.pending} />

      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {firstName}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your business today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statsDisplay.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-4 border border-border">
              <div className="flex justify-between items-start mb-2">
                <stat.icon className="w-6 h-6 text-muted-foreground" />
                {stats.total > 0 && (
                  <span className="text-xs font-medium flex items-center gap-0.5 text-success">
                    <TrendingUp className="w-3 h-3" />
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`${action.color} rounded-xl p-4 text-left text-white`}
                onClick={() => navigate(action.path)}
              >
                <action.icon className="w-6 h-6 mb-2" />
                <p className="font-semibold text-sm">{action.label}</p>
                <p className="text-xs opacity-80">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Booking Requests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg text-foreground">Recent Booking Requests</h2>
            <button 
              onClick={() => navigate("/bookings")}
              className="text-sm text-primary font-medium"
            >
              View All
            </button>
          </div>
          
          {loadingData ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No bookings yet</p>
              <p className="text-sm text-muted-foreground">New booking requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-foreground">{booking.service_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.scheduled_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'completed' ? 'bg-success/10 text-success' :
                      booking.status === 'confirmed' ? 'bg-primary/10 text-primary' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.rate_amount && (
                    <p className="text-lg font-bold text-foreground">{formatCurrency(booking.rate_amount)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
