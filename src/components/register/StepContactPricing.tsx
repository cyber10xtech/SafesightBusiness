import { Phone } from "lucide-react";
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

const formatPhoneDigits = (value: string) => {
  // Strip everything except digits
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return digits;
};

const StepContactPricing = ({ data, onUpdate, onNext, onBack }: StepContactPricingProps) => {
  const phoneDigits = data.phoneNumber.replace("+234", "").replace(/\D/g, "");
  const whatsappDigits = data.whatsappNumber.replace("+234", "").replace(/\D/g, "");

  const isValid =
    phoneDigits.length === 10 &&
    whatsappDigits.length === 10 &&
    data.dailyRate &&
    data.contractRate;

  const handlePhoneChange = (value: string) => {
    const digits = formatPhoneDigits(value);
    onUpdate({ phoneNumber: digits ? `+234${digits}` : "" });
  };

  const handleWhatsappChange = (value: string) => {
    const digits = formatPhoneDigits(value);
    onUpdate({ whatsappNumber: digits ? `+234${digits}` : "" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-10 h-10 text-success icon-float" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Contact & Pricing</h2>
        <p className="text-muted-foreground mt-1">How should customers reach and pay you?</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">+234</span>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="8012345678"
              value={phoneDigits}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="pl-14 h-12 rounded-xl"
              maxLength={10}
            />
          </div>
          <p className="text-xs text-muted-foreground">{phoneDigits.length}/10 digits</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-success">+234</span>
            <Input
              id="whatsappNumber"
              type="tel"
              placeholder="8012345678"
              value={whatsappDigits}
              onChange={(e) => handleWhatsappChange(e.target.value)}
              className="pl-14 h-12 rounded-xl"
              maxLength={10}
            />
          </div>
          <p className="text-xs text-muted-foreground">{whatsappDigits.length}/10 digits</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dailyRate">Daily Rate (₦) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">₦</span>
              <Input
                id="dailyRate"
                type="number"
                placeholder="15000"
                value={data.dailyRate}
                onChange={(e) => onUpdate({ dailyRate: e.target.value })}
                className="pl-8 h-12 rounded-xl"
              />
            </div>
            <p className="text-xs text-muted-foreground">Rate per day</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractRate">Contract Rate (₦) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">₦</span>
              <Input
                id="contractRate"
                type="number"
                placeholder="50000"
                value={data.contractRate}
                onChange={(e) => onUpdate({ contractRate: e.target.value })}
                className="pl-8 h-12 rounded-xl"
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
