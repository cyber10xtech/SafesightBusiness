import { useState } from "react";
import { Briefcase, Wrench, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type AccountType = "professional" | "handyman" | null;

const AccountTypeSelection = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<AccountType>(null);

  const accountTypes = [
    {
      id: "professional" as const,
      icon: Briefcase,
      title: "Professional",
      subtitle: "For licensed professionals and certified service providers",
      features: [
        "Licensed & certified",
        "Business registration (CAC)",
        "Verified badge on profile",
        "Higher booking rates",
      ],
      examples: "Licensed electricians, certified plumbers, registered contractors, professional engineers, architects",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      id: "handyman" as const,
      icon: Wrench,
      title: "Handyman",
      subtitle: "For skilled tradespeople and service providers",
      features: [
        "Skilled & experienced",
        "Shop/workspace photo",
        "Quick onboarding",
        "Flexible job options",
      ],
      examples: "General handymen, repair specialists, installers, painters, carpenters, maintenance workers",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="gradient-primary px-6 py-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Choose Your Account Type</h1>
        <p className="text-white/80">Select the option that best describes you</p>
      </div>

      {/* Content */}
      <div className="flex-1 bg-background px-4 py-6 -mt-4 rounded-t-3xl">
        <div className="max-w-md mx-auto space-y-4">
          {accountTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                "w-full text-left p-5 rounded-2xl border-2 transition-all",
                selectedType === type.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", type.iconBg)}>
                <type.icon className={cn("w-6 h-6", type.iconColor)} />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-1">{type.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{type.subtitle}</p>
              
              <div className="space-y-2 mb-4">
                {type.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Examples:</span> {type.examples}
                </p>
              </div>
            </button>
          ))}

          {/* Note */}
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-warning">Note:</span> You can change your account type later in settings. Professionals receive a verified badge after document approval.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1 h-12 rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={() => navigate("/register", { state: { accountType: selectedType } })}
              disabled={!selectedType}
              className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
