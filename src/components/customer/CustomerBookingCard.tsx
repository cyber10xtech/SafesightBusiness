import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BookingStatus = "upcoming" | "in_progress" | "completed" | "pending";

interface CustomerBookingCardProps {
  id: string;
  number: number;
  title: string;
  professionalName: string;
  profession: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: BookingStatus;
  onReschedule?: () => void;
  onDetails?: () => void;
  onLeaveReview?: () => void;
  onTrackProgress?: () => void;
}

const statusConfig: Record<BookingStatus, { 
  label: string; 
  icon: React.ComponentType<{ className?: string }>; 
  className: string;
}> = {
  upcoming: {
    label: "upcoming",
    icon: Clock,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  in_progress: {
    label: "in progress",
    icon: Timer,
    className: "bg-purple/10 text-purple border-purple/20",
  },
  completed: {
    label: "completed",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  pending: {
    label: "pending",
    icon: AlertCircle,
    className: "bg-warning/10 text-warning border-warning/20",
  },
};

const CustomerBookingCard = ({
  id,
  number,
  title,
  professionalName,
  profession,
  date,
  time,
  location,
  price,
  status,
  onReschedule,
  onDetails,
  onLeaveReview,
  onTrackProgress,
}: CustomerBookingCardProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex items-start justify-between mb-3">
        <Badge variant="outline" className={cn("gap-1", config.className)}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </Badge>
        <span className="text-xs text-muted-foreground">#{number}</span>
      </div>

      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        {professionalName} • {profession}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-foreground">$ {price}</span>
        
        <div className="flex gap-2">
          {status === "upcoming" && (
            <>
              <Button variant="outline" size="sm" onClick={onReschedule}>
                Reschedule
              </Button>
              <Button size="sm" onClick={onDetails}>
                Details
              </Button>
            </>
          )}
          {status === "completed" && (
            <Button size="sm" onClick={onLeaveReview}>
              Leave Review
            </Button>
          )}
          {status === "in_progress" && (
            <Button 
              size="sm" 
              onClick={onTrackProgress}
              className="bg-purple hover:bg-purple/90"
            >
              Track Progress
            </Button>
          )}
          {status === "pending" && (
            <span className="text-xs text-muted-foreground italic">
              Awaiting confirmation
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerBookingCard;
