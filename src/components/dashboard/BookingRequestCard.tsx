import { Calendar, Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  clientName: string;
  service: string;
  type: string;
  date: string;
  amount: string;
  status: "pending" | "confirmed" | "completed";
  description?: string;
  duration?: string;
  phone?: string;
  whatsapp?: string;
}

interface BookingRequestCardProps {
  booking: Booking;
  compact?: boolean;
}

const BookingRequestCard = ({ booking, compact = false }: BookingRequestCardProps) => {
  const statusStyles = {
    pending: "bg-warning/10 text-warning",
    confirmed: "bg-success/10 text-success",
    completed: "bg-primary/10 text-primary",
  };

  if (compact) {
    return (
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold text-foreground">{booking.clientName}</p>
            <p className="text-sm text-muted-foreground">{booking.service}</p>
          </div>
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", statusStyles[booking.status])}>
            {booking.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Type: {booking.type}</span>
            <span>Date: {booking.date}</span>
          </div>
          <span className="font-bold text-success">{booking.amount}</span>
        </div>
        {booking.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="bg-success hover:bg-success/90 text-white rounded-lg">
              Accept
            </Button>
            <Button size="sm" variant="outline" className="rounded-lg">
              Decline
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-foreground">{booking.service}</h3>
          <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize inline-block mt-1", statusStyles[booking.status])}>
            {booking.status}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-success">{booking.amount}</p>
          <p className="text-xs text-muted-foreground">{booking.type} Pay</p>
        </div>
      </div>

      <p className="text-muted-foreground mb-3">Client: {booking.clientName}</p>

      {booking.description && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Job Description:</p>
          <p className="text-sm text-foreground">{booking.description}</p>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Start Date</span>
          <span className="font-medium text-foreground ml-auto">{booking.date}</span>
        </div>
        {booking.duration && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Duration</span>
            <span className="font-medium text-foreground ml-auto">{booking.duration}</span>
          </div>
        )}
        {booking.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>Phone</span>
            <span className="font-medium text-foreground ml-auto">{booking.phone}</span>
          </div>
        )}
        {booking.whatsapp && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="w-4 h-4 text-success" />
            <span>WhatsApp</span>
            <span className="font-medium text-foreground ml-auto">{booking.whatsapp}</span>
          </div>
        )}
      </div>

      {booking.status === "pending" && (
        <div className="flex gap-2 mt-4">
          <Button className="flex-1 bg-success hover:bg-success/90 text-white rounded-lg">
            Accept Booking
          </Button>
          <Button variant="outline" className="flex-1 rounded-lg">
            ✕ Decline
          </Button>
        </div>
      )}

      {booking.status === "confirmed" && (
        <div className="flex gap-2 mt-4">
          <Button className="bg-success hover:bg-success/90 text-white rounded-lg">
            Mark as Completed
          </Button>
          <Button variant="outline" size="icon" className="rounded-lg">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-lg">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingRequestCard;
