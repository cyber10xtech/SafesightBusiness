import { ArrowLeft, Zap, Check, Crown, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BoostProfile = () => {
  const navigate = useNavigate();

  const handleSubscribe = (plan: string) => {
    toast.info(`${plan} subscription coming soon!`);
  };

  const plans = [
    {
      name: "Basic Boost",
      price: "₦5,000",
      period: "/month",
      features: [
        "Priority listing in search results",
        "Featured badge on profile",
        "5x more visibility",
      ],
      icon: Zap,
      popular: false,
    },
    {
      name: "Pro Boost",
      price: "₦12,500",
      period: "/month",
      features: [
        "Everything in Basic",
        "Top of search results",
        "Verified Pro badge",
        "10x more visibility",
        "Priority customer support",
      ],
      icon: Crown,
      popular: true,
    },
    {
      name: "Elite Boost",
      price: "₦25,000",
      period: "/month",
      features: [
        "Everything in Pro",
        "Featured on homepage",
        "Elite member badge",
        "20x more visibility",
        "Dedicated account manager",
        "Advanced analytics",
      ],
      icon: Star,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Boost Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-6 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-primary-foreground icon-float" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Get More Clients</h2>
          <p className="text-muted-foreground">
            Boost your profile to appear higher in search results and get more bookings
          </p>
        </div>

        {/* Plans */}
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative p-4 rounded-xl border animate-fade-in ${
                plan.popular ? "border-primary bg-primary/5" : "border-border"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  plan.popular ? "bg-primary" : "bg-primary/10"
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(plan.name)}
                    className="w-full mt-4"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-muted/50 rounded-xl p-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-semibold mb-3">Why Boost?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Professionals with boosts get 3x more inquiries</li>
            <li>• Stand out from the competition</li>
            <li>• Cancel anytime, no commitment</li>
            <li>• 30-day money-back guarantee</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BoostProfile;
