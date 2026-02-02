import { useState } from "react";
import { 
  Bell, 
  Calendar, 
  DollarSign, 
  Star, 
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";

interface Notification {
  id: string;
  type: "booking" | "payment" | "review" | "message" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "booking",
      title: "New Booking Request",
      message: "John Smith requested an electrical installation service for Jan 25, 2026",
      time: "2 min ago",
      read: false,
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Received",
      message: "You received ₦350,000 for the wiring repair job",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "review",
      title: "New Review",
      message: "Sarah Johnson left you a 5-star review: 'Excellent work!'",
      time: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "message",
      title: "New Message",
      message: "Mike Davis: 'When can you start the project?'",
      time: "5 hours ago",
      read: true,
    },
    {
      id: "5",
      type: "system",
      title: "Profile Boost Expired",
      message: "Your profile boost has expired. Renew to stay visible.",
      time: "1 day ago",
      read: true,
    },
    {
      id: "6",
      type: "booking",
      title: "Booking Confirmed",
      message: "Your booking with TechCorp Ltd has been confirmed for Feb 1",
      time: "2 days ago",
      read: true,
    },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return Calendar;
      case "payment":
        return DollarSign;
      case "review":
        return Star;
      case "message":
        return MessageSquare;
      case "system":
        return Bell;
    }
  };

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return "bg-primary/10 text-primary";
      case "payment":
        return "bg-success/10 text-success";
      case "review":
        return "bg-warning/10 text-warning";
      case "message":
        return "bg-secondary text-secondary-foreground";
      case "system":
        return "bg-muted text-muted-foreground";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Notifications" showNotifications={false} />

      <div className="p-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-primary"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`bg-card rounded-xl border p-4 transition-colors cursor-pointer ${
                    notification.read 
                      ? "border-border" 
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconColor(notification.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium text-sm ${notification.read ? "text-foreground" : "text-foreground"}`}>
                          {notification.title}
                        </h3>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Notifications;
