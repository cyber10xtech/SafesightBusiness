import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import BookingRequestCard from "@/components/dashboard/BookingRequestCard";

type TabFilter = "all" | "pending" | "confirmed" | "completed";

const Bookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const allBookings = [
    {
      id: "1",
      clientName: "John Smith",
      service: "Complete Home Electrical Installation",
      type: "Contract",
      date: "Jan 25, 2026",
      amount: "$2500",
      status: "pending" as const,
      description: "Need complete electrical rewiring for 2000 sq ft home. Includes new panel, outlets, and lighting fixtures.",
      phone: "+1 (555) 111-2222",
      whatsapp: "+1 (555) 111-2222",
    },
    {
      id: "2",
      clientName: "Sarah Johnson",
      service: "Circuit Breaker Repair",
      type: "Daily",
      date: "Jan 23, 2026",
      amount: "$350",
      status: "confirmed" as const,
      description: "Circuit breaker keeps tripping in the kitchen. Need diagnosis and repair.",
      duration: "1 day",
      phone: "+1 (555) 222-3333",
      whatsapp: "+1 (555) 222-3333",
    },
    {
      id: "3",
      clientName: "Mike Davis",
      service: "Outdoor Lighting Installation",
      type: "Daily",
      date: "Jan 22, 2026",
      amount: "$350",
      status: "confirmed" as const,
      description: "Install landscape lighting around front yard and driveway.",
      duration: "1 day",
      phone: "+1 (555) 333-4444",
      whatsapp: "+1 (555) 333-4444",
    },
    {
      id: "4",
      clientName: "Emily Brown",
      service: "Smart Home Setup",
      type: "Contract",
      date: "Jan 20, 2026",
      amount: "$1800",
      status: "completed" as const,
      description: "Full smart home automation including lighting, thermostat, and security.",
      phone: "+1 (555) 444-5555",
      whatsapp: "+1 (555) 444-5555",
    },
  ];

  const filteredBookings = activeTab === "all" 
    ? allBookings 
    : allBookings.filter((b) => b.status === activeTab);

  const tabs: { id: TabFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: allBookings.length },
    { id: "pending", label: "Pending", count: allBookings.filter(b => b.status === "pending").length },
    { id: "confirmed", label: "Confirmed", count: allBookings.filter(b => b.status === "confirmed").length },
    { id: "completed", label: "Completed", count: allBookings.filter(b => b.status === "completed").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary px-4 py-4">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white mb-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-white">Booking Requests</h1>
      </header>

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
        {filteredBookings.map((booking) => (
          <BookingRequestCard key={booking.id} booking={booking} />
        ))}

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No {activeTab} bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
