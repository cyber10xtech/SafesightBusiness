import { useState, useEffect } from "react";
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  service_type: string;
  description: string | null;
  scheduled_date: string;
  status: string;
  rate_amount: number | null;
  rate_type: string | null;
  created_at: string;
}

const JobHistory = () => {
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!profile?.id) return;

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("professional_id", profile.id)
          .order("scheduled_date", { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Error fetching jobs:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [profile?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-warning" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success";
      case "in_progress":
        return "bg-warning/10 text-warning";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredJobs = activeTab === "all" 
    ? jobs 
    : jobs.filter(job => job.status === activeTab);

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-";
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount}`;
  };

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === "completed").length,
    ongoing: jobs.filter(j => j.status === "in_progress" || j.status === "confirmed").length,
    totalEarnings: jobs
      .filter(j => j.status === "completed")
      .reduce((sum, j) => sum + (j.rate_amount || 0), 0),
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
            <p className="text-lg font-bold text-primary">{formatCurrency(stats.totalEarnings)}</p>
            <p className="text-[10px] text-muted-foreground">Earned</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
            <TabsTrigger value="in_progress">Active</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No jobs found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Completed jobs will appear here
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-card rounded-xl border border-border p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{job.service_type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(job.scheduled_date).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace("_", " ")}
                    </span>
                  </div>

                  {/* Description */}
                  {job.description && (
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                  )}

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{job.rate_type || "One-time"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <DollarSign className="w-4 h-4 text-success" />
                      <span>{formatCurrency(job.rate_amount)}</span>
                    </div>
                  </div>
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
