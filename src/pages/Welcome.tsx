import { User, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Showcase Your Work",
      description: "Build your professional portfolio",
    },
    {
      title: "Connect with Customers",
      description: "Get direct booking requests",
    },
    {
      title: "Grow Your Business",
      description: "Manage bookings & build reputation",
    },
  ];

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6">
        <User className="w-12 h-12 text-primary" />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-2">ProConnect</h1>
      <p className="text-white/80 text-lg mb-10">Your Professional Business Platform</p>

      {/* Features Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-10">
        <div className="space-y-5">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-md space-y-4">
        <Button
          onClick={() => navigate("/account-type")}
          className="w-full h-14 bg-white text-primary hover:bg-white/90 text-lg font-semibold rounded-xl"
        >
          Create Account
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <Button
          onClick={() => navigate("/sign-in")}
          variant="outline"
          className="w-full h-14 bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg font-semibold rounded-xl"
        >
          Sign In
        </Button>
      </div>

      {/* Footer text */}
      <p className="text-white/70 text-center mt-8 text-sm">
        Join thousands of professionals growing their business
      </p>
    </div>
  );
};

export default Welcome;
