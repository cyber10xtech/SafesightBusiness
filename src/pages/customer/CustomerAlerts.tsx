import { Bell, CheckCircle2, Calendar, MessageSquare } from "lucide-react";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockAlerts = [
  {
    id: "1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your booking with Mike Johnson has been confirmed for Jan 20, 2026",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    message: "Sarah Williams sent you a message about your project",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "completed",
    title: "Job Completed",
    message: "David Chen has marked Cabinet Installation as complete",
    time: "1 day ago",
    read: true,
  },
];

const iconMap = {
  booking: Calendar,
  message: MessageSquare,
  completed: CheckCircle2,
};

const CustomerAlerts = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Alerts</h1>
          <Badge variant="secondary">{mockAlerts.filter(a => !a.read).length} new</Badge>
        </div>
        
        <div className="space-y-3">
          {mockAlerts.map((alert) => {
            const Icon = iconMap[alert.type as keyof typeof iconMap] || Bell;
            return (
              <div 
                key={alert.id}
                className={cn(
                  "bg-card rounded-xl p-4 border border-border",
                  !alert.read && "border-l-4 border-l-primary"
                )}
              >
                <div className="flex gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    !alert.read ? "bg-primary/10" : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      !alert.read ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{alert.title}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{alert.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CustomerBottomNav />
    </div>
  );
};

export default CustomerAlerts;
