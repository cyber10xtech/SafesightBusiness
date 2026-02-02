import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useBookings } from "@/hooks/useBookings";
import { useProfessionals } from "@/hooks/useProfessionals";
import { createNotification } from "@/hooks/useNotifications";

const BookingRequest = () => {
  const navigate = useNavigate();
  const { id: professionalId } = useParams<{ id: string }>();
  const { createBooking } = useBookings();
  const { getProfessionalById } = useProfessionals();
  const [isLoading, setIsLoading] = useState(false);
  const [professional, setProfessional] = useState<{ user_id: string; full_name: string } | null>(null);

  useEffect(() => {
    const loadProfessional = async () => {
      if (professionalId) {
        const { data } = await getProfessionalById(professionalId);
        if (data) {
          setProfessional({ user_id: data.user_id, full_name: data.full_name });
        }
      }
    };
    loadProfessional();
  }, [professionalId]);
  
  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    rateType: "daily" as "daily" | "contract",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!professionalId) {
      toast.error("Professional not found");
      return;
    }

    if (!formData.serviceType || !formData.scheduledDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const { error } = await createBooking({
      professional_id: professionalId,
      service_type: formData.serviceType,
      description: formData.description,
      scheduled_date: formData.scheduledDate,
      scheduled_time: formData.scheduledTime || undefined,
      rate_type: formData.rateType,
      notes: formData.notes || undefined,
    });

    setIsLoading(false);

    if (error) {
      toast.error("Failed to create booking. Please try again.");
      return;
    }

    // Send notification to professional
    if (professional) {
      await createNotification(
        professional.user_id,
        'professional',
        'booking',
        'New Booking Request',
        `You have a new booking request for ${formData.serviceType} on ${formData.scheduledDate}`,
        { service_type: formData.serviceType, scheduled_date: formData.scheduledDate }
      );
    }

    toast.success("Booking request sent successfully!");
    navigate("/customer/hub");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Book a Service</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="serviceType" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Service Type *
            </Label>
            <Input
              id="serviceType"
              placeholder="e.g., Plumbing, Electrical, Renovation"
              value={formData.serviceType}
              onChange={(e) => handleChange("serviceType", e.target.value)}
              required
              className="h-12 rounded-xl"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the work you need done..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="rounded-xl min-h-[100px]"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduledDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Preferred Date *
            </Label>
            <Input
              id="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => handleChange("scheduledDate", e.target.value)}
              required
              min={new Date().toISOString().split("T")[0]}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduledTime" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Preferred Time
            </Label>
            <Input
              id="scheduledTime"
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => handleChange("scheduledTime", e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Rate Type */}
          <div className="space-y-2">
            <Label>Rate Type</Label>
            <RadioGroup
              value={formData.rateType}
              onValueChange={(value) => handleChange("rateType", value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="font-normal">Daily Rate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contract" id="contract" />
                <Label htmlFor="contract" className="font-normal">Contract Rate</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Send Booking Request"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            The professional will review your request and confirm availability.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingRequest;
