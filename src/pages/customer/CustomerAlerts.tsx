import { Calendar, MessageCircle, Star, Tag, Clock, CheckCheck } from "lucide-react";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockNotifications = [
  {
    id: "1",
    type: "booking",
    icon: Calendar,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Booking Confirmed",
    message: "Mike Johnson has confirmed your booking for Kitchen Sink Repair",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "message",
    icon: MessageCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    title: "New Message",
    message: "Sarah Williams sent you a message",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "review",
    icon: Star,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
    title: "Leave a Review",
    message: "How was your experience with Sarah Williams?",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "offer",
    icon: Tag,
    iconColor: "text-purple",
    iconBg: "bg-purple/10",
    title: "Special Offer",
    message: "Get 15% off your next booking this weekend",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "reminder",
    icon: Clock,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Job Starting Soon",
    message: "Lisa Brown will arrive in 30 minutes",
    time: "3 days ago",
    read: true,
  },
];

const CustomerAlerts = () => {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <Badge className="bg-primary text-primary-foreground">
            {unreadCount} new
          </Badge>
        </div>

        <button className="flex items-center gap-1 text-primary text-sm font-medium mb-4">
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
        
        <div className="space-y-2">
          {mockNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div 
                key={notification.id}
                className={cn(
                  "bg-card rounded-xl p-4 border border-border relative",
                  !notification.read && "bg-primary/5"
                )}
              >
                <div className="flex gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    notification.iconBg
                  )}>
                    <Icon className={cn("w-5 h-5", notification.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">{notification.time}</span>
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
