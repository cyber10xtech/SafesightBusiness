import { User, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RegistrationData } from "@/pages/Register";

interface StepPersonalInfoProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPersonalInfo = ({ data, onUpdate, onNext, onBack }: StepPersonalInfoProps) => {
  const isValid = data.fullName && data.profession && data.bio && data.location;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
        <p className="text-muted-foreground mt-1">Tell us about yourself</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Smith"
            value={data.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profession">Profession *</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="profession"
              type="text"
              placeholder="e.g., Licensed Electrician, Master Plumber"
              value={data.profession}
              onChange={(e) => onUpdate({ profession: e.target.value })}
              className="pl-11 h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Professional Bio *</Label>
          <Textarea
            id="bio"
            placeholder="Tell customers about your experience, expertise, and what makes you stand out..."
            value={data.bio}
            onChange={(e) => onUpdate({ bio: e.target.value })}
            className="min-h-[100px] rounded-xl resize-none"
          />
          <p className="text-xs text-muted-foreground">{data.bio.length} characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="location"
              type="text"
              placeholder="City, State"
              value={data.location}
              onChange={(e) => onUpdate({ location: e.target.value })}
              className="pl-11 h-12 rounded-xl"
            />
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

export default StepPersonalInfo;
