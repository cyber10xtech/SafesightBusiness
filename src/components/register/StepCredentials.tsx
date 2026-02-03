import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegistrationData } from "@/pages/Register";

interface StepCredentialsProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const StepCredentials = ({ data, onUpdate, onNext, onBack, isSubmitting = false }: StepCredentialsProps) => {
  const accountTypeLabel = data.accountType === "professional" ? "Professional" : "Handyman";

  const isValid = data.email && data.password.length >= 6 && data.password === data.confirmPassword;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-muted-foreground mt-1">
          Setting up as a <span className="font-semibold text-primary">{accountTypeLabel}</span>
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={data.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              className="pl-11 h-12 rounded-xl"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={data.password}
              onChange={(e) => onUpdate({ password: e.target.value })}
              className="pl-11 h-12 rounded-xl"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={data.confirmPassword}
              onChange={(e) => onUpdate({ confirmPassword: e.target.value })}
              className="pl-11 h-12 rounded-xl"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {data.password && data.confirmPassword && data.password !== data.confirmPassword && (
          <p className="text-sm text-destructive">Passwords don't match</p>
        )}
      </div>

      {/* Email verification notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-foreground font-medium">Email Verification Required</p>
        <p className="text-xs text-muted-foreground mt-1">
          After registration, you'll need to verify your email before signing in.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl" disabled={isSubmitting}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid || isSubmitting}
          className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepCredentials;
