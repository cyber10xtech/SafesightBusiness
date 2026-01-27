import { Phone, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegistrationData } from "@/pages/Register";

interface StepContactPricingProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepContactPricing = ({ data, onUpdate, onNext, onBack }: StepContactPricingProps) => {
  const isValid = data.phoneNumber && data.whatsappNumber && data.dailyRate && data.contractRate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Contact & Pricing</h2>
        <p className="text-muted-foreground mt-1">How should customers reach and pay you?</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={data.phoneNumber}
              onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
              className="pl-11 h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
            <Input
              id="whatsappNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={data.whatsappNumber}
              onChange={(e) => onUpdate({ whatsappNumber: e.target.value })}
              className="pl-11 h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dailyRate">Daily Rate ($) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="dailyRate"
                type="number"
                placeholder="300"
                value={data.dailyRate}
                onChange={(e) => onUpdate({ dailyRate: e.target.value })}
                className="pl-11 h-12 rounded-xl"
              />
            </div>
            <p className="text-xs text-muted-foreground">Rate per day</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractRate">Contract Rate ($) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="contractRate"
                type="number"
                placeholder="2000"
                value={data.contractRate}
                onChange={(e) => onUpdate({ contractRate: e.target.value })}
                className="pl-11 h-12 rounded-xl"
              />
            </div>
            <p className="text-xs text-muted-foreground">Starting rate per project</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepContactPricing;
