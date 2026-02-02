import { 
  Calendar, 
  DollarSign, 
  Star, 
  Briefcase, 
  TrendingUp, 
  CalendarDays,
  Settings,
  Clock,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingRequestCard from "@/components/dashboard/BookingRequestCard";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, profileExists } = useProfile();

  // Redirect to complete profile if user signed in but no profile exists
  useEffect(() => {
    if (!authLoading && !profileLoading && user && profileExists === false) {
      navigate("/complete-profile");
    }
  }, [authLoading, profileLoading, user, profileExists, navigate]);

  const stats = [
    { icon: Calendar, label: "Total Bookings", value: "0", trend: "-", trendUp: true },
    { icon: DollarSign, label: "This Month", value: "₦0", trend: "-", trendUp: true },
    { icon: Star, label: "Avg Rating", value: "-", trend: "-", trendUp: true },
    { icon: Briefcase, label: "Completed Jobs", value: "0", trend: "-", trendUp: true },
  ];

  const quickActions = [
    { icon: CalendarDays, label: "View Bookings", description: "Manage your upcoming appointments", color: "bg-primary", path: "/bookings" },
    { icon: Clock, label: "Job History", description: "View completed and ongoing work", color: "bg-warning", path: "/job-history" },
    { icon: Settings, label: "Edit Profile", description: "Update your info and portfolio", color: "bg-muted-foreground", path: "/profile" },
  ];

  const recentBookings = [
    {
      id: "1",
      clientName: "John Smith",
      service: "Electrical Installation",
      type: "Contract",
      date: "Jan 25, 2026",
      amount: "₦2.5M",
      status: "pending" as const,
    },
    {
      id: "2",
      clientName: "Sarah Johnson",
      service: "Wiring Repair",
      type: "Daily",
      date: "Jan 23, 2026",
      amount: "₦350K",
      status: "confirmed" as const,
    },
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
      <AppHeader title="ProConnect" notificationCount={2} />

      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {firstName}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your business today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-4 border border-border">
              <div className="flex justify-between items-start mb-2">
                <stat.icon className="w-6 h-6 text-muted-foreground" />
                <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.trendUp ? 'text-success' : 'text-destructive'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`w-full ${action.color} rounded-xl p-4 text-left text-white`}
              onClick={() => navigate(action.path)}
            >
              <action.icon className="w-6 h-6 mb-2" />
              <p className="font-semibold">{action.label}</p>
              <p className="text-sm opacity-80">{action.description}</p>
            </button>
          ))}
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
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <BookingRequestCard key={booking.id} booking={booking} compact />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
