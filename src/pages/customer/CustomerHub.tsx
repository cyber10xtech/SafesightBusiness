import { useState } from "react";
import { Calendar, Heart, AlertCircle, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import ProfessionalCard from "@/components/customer/ProfessionalCard";
import CustomerBookingCard from "@/components/customer/CustomerBookingCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

type HubTab = "bookings" | "favorites" | "emergency";
type DiscoverTab = "discover" | "recent";
type BookingFilter = "all" | "upcoming" | "in_progress" | "completed";

const mockProfessionals = [
  {
    id: "1",
    name: "Robert Wilson",
    profession: "Builder",
    location: "Residential Project",
    lastActive: "1 hour ago",
    rating: 4.9,
    reviewCount: 189,
    distance: "Eastside",
    dailyRate: 150,
    weeklyRate: 1050,
    bio: "Master builder with extensive experience in residential and commercial construction. Specialized in custom homes and renovation projects.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "David Lee",
    profession: "Electrical Engineer",
    location: "Industrial Zone",
    lastActive: "3 hours ago",
    rating: 4.8,
    reviewCount: 167,
    distance: "Southside",
    dailyRate: 160,
    weeklyRate: 1120,
    bio: "Licensed electrical engineer with expertise in electrical system design, power distribution, and...",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Jennifer Martinez",
    profession: "Structural Engineer",
    location: "Engineering Office",
    lastActive: "1 hour ago",
    rating: 4.9,
    reviewCount: 145,
    distance: "Downtown",
    dailyRate: 175,
    weeklyRate: 1225,
    bio: "Professional structural engineer specializing in building analysis, foundation design, and seismic...",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

const mockFavorites = [
  {
    id: "1",
    name: "James Anderson",
    profession: "Architect",
    location: "City Center",
    lastActive: "2 hours ago",
    rating: 4.9,
    reviewCount: 156,
    distance: "Downtown",
    dailyRate: 200,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    isFavorite: true,
  },
  {
    id: "2",
    name: "Michael Thompson",
    profession: "Project Manager",
    location: "Construction Site A",
    lastActive: "30 min ago",
    rating: 4.8,
    reviewCount: 203,
    distance: "Westside",
    dailyRate: 180,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Sarah Mitchell",
    profession: "Interior Designer",
    location: "Design Studio",
    lastActive: "45 min ago",
    rating: 4.9,
    reviewCount: 224,
    distance: "Northside",
    dailyRate: 120,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    isFavorite: true,
  },
];

const mockConnections = [
  {
    id: "1",
    name: "James Anderson",
    profession: "Architect",
    location: "City Center",
    lastActive: "2 hours ago",
    rating: 4.9,
    reviewCount: 156,
    distance: "Downtown",
    dailyRate: 200,
    weeklyRate: 1400,
    bio: "Licensed architect with 18 years of experience in residential and commercial design. Specialized in...",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Michael Thompson",
    profession: "Project Manager",
    location: "Construction Site A",
    lastActive: "30 min ago",
    rating: 4.8,
    reviewCount: 203,
    distance: "Westside",
    dailyRate: 180,
    weeklyRate: 1260,
    bio: "PMP certified project manager specializing in construction project coordination, timeline...",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Sarah Mitchell",
    profession: "Interior Designer",
    location: "Design Studio",
    lastActive: "45 min ago",
    rating: 4.9,
    reviewCount: 224,
    distance: "Northside",
    dailyRate: 120,
    weeklyRate: 840,
    bio: "Award-winning interior designer specializing in contemporary and luxury residential spaces. Expe...",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
];

const mockEmergencyProfessionals = [
  {
    id: "1",
    name: "David Lee",
    profession: "Electrical Engineer",
    location: "Industrial Zone",
    lastActive: "2 hours",
    rating: 4.8,
    reviewCount: 203,
    distance: "3.2 mi away",
    dailyRate: 160,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Mike Johnson",
    profession: "Plumber",
    location: "Plumbing Supply Store",
    lastActive: "30 min",
    rating: 4.8,
    reviewCount: 178,
    distance: "0.5 mi away",
    dailyRate: 65,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Sarah Williams",
    profession: "Electrician",
    location: "Hardware Store",
    lastActive: "45 min",
    rating: 4.9,
    reviewCount: 203,
    distance: "1.2 mi away",
    dailyRate: 75,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  },
];

const mockBookings = [
  {
    id: "1",
    number: 1,
    title: "Kitchen Sink Repair",
    professionalName: "Mike Johnson",
    profession: "Plumber",
    date: "Jan 20, 2026",
    time: "14:00",
    location: "123 Main Street, New York, NY",
    price: 130,
    status: "upcoming" as const,
  },
  {
    id: "2",
    number: 2,
    title: "Electrical Outlet Installation",
    professionalName: "Sarah Williams",
    profession: "Electrician",
    date: "Jan 15, 2026",
    time: "10:00",
    location: "123 Main Street, New York, NY",
    price: 150,
    status: "completed" as const,
  },
  {
    id: "3",
    number: 3,
    title: "Cabinet Installation",
    professionalName: "David Chen",
    profession: "Carpenter",
    date: "Jan 25, 2026",
    time: "09:00",
    location: "123 Main Street, New York, NY",
    price: 800,
    status: "pending" as const,
  },
  {
    id: "4",
    number: 4,
    title: "Bathroom Plumbing",
    professionalName: "Mike Johnson",
    profession: "Plumber",
    date: "Jan 10, 2026",
    time: "11:00",
    location: "123 Main Street, New York, NY",
    price: 195,
    status: "completed" as const,
  },
  {
    id: "5",
    number: 5,
    title: "Interior Painting",
    professionalName: "Lisa Brown",
    profession: "Painter",
    date: "Jan 18, 2026",
    time: "08:00",
    location: "123 Main Street, New York, NY",
    price: 760,
    status: "in_progress" as const,
  },
];

const CustomerHub = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as HubTab) || "bookings";
  
  const [activeHubTab, setActiveHubTab] = useState<HubTab>(initialTab);
  const [discoverTab, setDiscoverTab] = useState<DiscoverTab>("discover");
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("all");

  const hubTabs = [
    { id: "bookings" as const, label: "My Bookings", icon: Calendar },
    { id: "favorites" as const, label: "Favorites", icon: Heart },
    { id: "emergency" as const, label: "Emergency", icon: AlertCircle },
  ];

  const filteredBookings = mockBookings.filter(booking => {
    if (bookingFilter === "all") return true;
    return booking.status === bookingFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Hub</h1>

        {/* Hub Tabs */}
        <div className="flex gap-2 mb-4">
          {hubTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeHubTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveHubTab(tab.id)}
              className="flex-1 gap-1"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label.split(" ")[1] || tab.label}
            </Button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeHubTab === "bookings" && (
          <>
            {/* Discover Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={discoverTab === "discover" ? "default" : "outline"}
                size="sm"
                onClick={() => setDiscoverTab("discover")}
                className="gap-1"
              >
                <Sparkles className="w-4 h-4" />
                Discover Handymen
              </Button>
              <Button
                variant={discoverTab === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setDiscoverTab("recent")}
                className="gap-1"
              >
                <Clock className="w-4 h-4" />
                Recently Connected
              </Button>
            </div>

            {discoverTab === "discover" ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-foreground">Explore New Professionals</h2>
                  <span className="text-sm text-muted-foreground">{mockProfessionals.length} available</span>
                </div>
                <div className="space-y-3">
                  {mockProfessionals.map((professional) => (
                    <ProfessionalCard
                      key={professional.id}
                      {...professional}
                      variant="detailed"
                      onView={() => navigate(`/customer/professional/${professional.id}`)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-foreground">Your Connections</h2>
                  <span className="text-sm text-muted-foreground">{mockConnections.length} connections</span>
                </div>
                <div className="space-y-3">
                  {mockConnections.map((professional) => (
                    <ProfessionalCard
                      key={professional.id}
                      {...professional}
                      variant="detailed"
                      onView={() => navigate(`/customer/professional/${professional.id}`)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeHubTab === "favorites" && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Favorites</h2>
              <span className="text-sm text-muted-foreground">{mockFavorites.length} saved professionals</span>
            </div>
            <div className="space-y-3">
              {mockFavorites.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  {...professional}
                  variant="favorite"
                  onBook={() => navigate(`/customer/professional/${professional.id}`)}
                  onFavoriteToggle={() => console.log("Toggle favorite", professional.id)}
                />
              ))}
            </div>
          </>
        )}

        {activeHubTab === "emergency" && (
          <>
            {/* Emergency Header */}
            <div className="bg-destructive rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-5 h-5 text-destructive-foreground" />
                <h2 className="font-semibold text-destructive-foreground">Emergency Services</h2>
              </div>
              <p className="text-sm text-destructive-foreground/80">
                Available 24/7 for urgent repairs
              </p>
            </div>

            {/* Warning Banner */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">For immediate assistance</p>
                  <p className="text-xs text-muted-foreground">
                    These professionals offer emergency services and can respond quickly to urgent situations.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Available Now</h3>
              <span className="text-sm text-muted-foreground">({mockEmergencyProfessionals.length})</span>
            </div>

            <div className="space-y-3">
              {mockEmergencyProfessionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  {...professional}
                  variant="emergency"
                  onView={() => navigate(`/customer/professional/${professional.id}`)}
                  onCall={() => console.log("Call", professional.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CustomerBottomNav />
    </div>
  );
};

export default CustomerHub;
