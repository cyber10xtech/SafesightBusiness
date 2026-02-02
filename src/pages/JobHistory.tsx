import { useState } from "react";
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Filter
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";

interface Job {
  id: string;
  clientName: string;
  clientAvatar?: string;
  service: string;
  description: string;
  location: string;
  date: string;
  duration: string;
  amount: string;
  status: "completed" | "ongoing" | "cancelled";
  rating?: number;
  review?: string;
}

const JobHistory = () => {
  const [activeTab, setActiveTab] = useState("all");

  const jobs: Job[] = [
    {
      id: "1",
      clientName: "Sarah Johnson",
      service: "Electrical Wiring Repair",
      description: "Fixed faulty wiring in living room and kitchen areas",
      location: "Victoria Island, Lagos",
      date: "Jan 20, 2026",
      duration: "4 hours",
      amount: "₦85,000",
      status: "completed",
      rating: 5,
      review: "Excellent work! Very professional and thorough.",
    },
    {
      id: "2",
      clientName: "TechCorp Ltd",
      service: "Office Electrical Installation",
      description: "Complete electrical setup for new office building",
      location: "Lekki Phase 1, Lagos",
      date: "Jan 15-22, 2026",
      duration: "Contract",
      amount: "₦2,500,000",
      status: "ongoing",
    },
    {
      id: "3",
      clientName: "Mike Davis",
      service: "Circuit Breaker Installation",
      description: "Installed new circuit breakers for residential property",
      location: "Ikeja GRA, Lagos",
      date: "Jan 12, 2026",
      duration: "2 hours",
      amount: "₦45,000",
      status: "completed",
      rating: 5,
    },
    {
      id: "4",
      clientName: "Emily Chen",
      service: "Solar Panel Installation",
      description: "Installed 5kW solar system with battery backup",
      location: "Ikoyi, Lagos",
      date: "Jan 5-8, 2026",
      duration: "4 days",
      amount: "₦1,200,000",
      status: "completed",
      rating: 4,
      review: "Good work, completed on time.",
    },
    {
      id: "5",
      clientName: "David Wilson",
      service: "Generator Setup",
      description: "Generator installation and automatic changeover",
      location: "Ajah, Lagos",
      date: "Dec 28, 2025",
      duration: "6 hours",
      amount: "₦150,000",
      status: "cancelled",
    },
  ];

  const getStatusIcon = (status: Job["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "ongoing":
        return <Clock className="w-4 h-4 text-warning" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success";
      case "ongoing":
        return "bg-warning/10 text-warning";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
    }
  };

  const filteredJobs = activeTab === "all" 
    ? jobs 
    : jobs.filter(job => job.status === activeTab);

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === "completed").length,
    ongoing: jobs.filter(j => j.status === "ongoing").length,
    totalEarnings: "₦4.2M",
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Job History" />

      {/* Stats Summary */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-xl font-bold text-foreground">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground">Total Jobs</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-xl font-bold text-success">{stats.completed}</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-xl font-bold text-warning">{stats.ongoing}</p>
            <p className="text-[10px] text-muted-foreground">Ongoing</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <p className="text-lg font-bold text-primary">{stats.totalEarnings}</p>
            <p className="text-[10px] text-muted-foreground">Earned</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-3">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No jobs found</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-card rounded-xl border border-border p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={job.clientAvatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {job.clientName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">{job.clientName}</h3>
                        <p className="text-sm text-primary">{job.service}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>

                  {/* Details */}
                  <p className="text-sm text-muted-foreground">{job.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{job.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{job.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <DollarSign className="w-4 h-4 text-success" />
                      <span>{job.amount}</span>
                    </div>
                  </div>

                  {/* Rating & Review */}
                  {job.rating && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < job.rating! 
                                ? "fill-warning text-warning" 
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      {job.review && (
                        <p className="text-sm text-muted-foreground italic">
                          "{job.review}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default JobHistory;
