import { 
  Calendar, 
  DollarSign, 
  Star, 
  Briefcase, 
  TrendingUp, 
  CalendarDays,
  Settings,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingRequestCard from "@/components/dashboard/BookingRequestCard";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Calendar, label: "Total Bookings", value: "24", trend: "+12%", trendUp: true },
    { icon: DollarSign, label: "This Month", value: "₦4.8M", trend: "+8%", trendUp: true },
    { icon: Star, label: "Avg Rating", value: "4.9", trend: "+0.2", trendUp: true },
    { icon: Briefcase, label: "Completed Jobs", value: "156", trend: "+5", trendUp: true },
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
    {
      id: "3",
      clientName: "Mike Davis",
      service: "Circuit Breaker Install",
      type: "Daily",
      date: "Jan 22, 2026",
      amount: "₦350K",
      status: "confirmed" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="ProConnect" notificationCount={2} />

      <div className="p-4 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Ozioma! 👋</h1>
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
