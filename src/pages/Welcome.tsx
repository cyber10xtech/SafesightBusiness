import { useState, useEffect } from "react";
import { User, CheckCircle, ArrowRight, Download, Wrench, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    // Show install prompt if not already installed
    if (!isStandalone) {
      setShowInstall(true);
    }
  }, []);

  const businessFeatures = [
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

  const customerFeatures = [
    {
      title: "Find Trusted Pros",
      description: "Browse verified professionals near you",
    },
    {
      title: "Easy Booking",
      description: "Book services with a few taps",
    },
    {
      title: "24/7 Emergency Help",
      description: "Get urgent repairs when you need them",
    },
  ];

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center px-6 py-12">
      {/* Install Banner */}
      {showInstall && (
        <button
          onClick={() => navigate("/install")}
          className="fixed top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/30 transition-colors"
        >
          <Download className="w-4 h-4" />
          Install App
        </button>
      )}

      {/* App Type Selection */}
      <div className="w-full max-w-md mb-8">
        <h2 className="text-white text-center text-lg mb-4 font-medium">Choose your experience</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Customer App */}
          <button
            onClick={() => navigate("/customer/sign-in")}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors border-2 border-transparent hover:border-white/50"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-white font-semibold mb-1">HandyConnect</h3>
            <p className="text-white/70 text-xs">Find professionals</p>
          </button>

          {/* Business App */}
          <button
            onClick={() => navigate("/sign-in")}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors border-2 border-transparent hover:border-white/50"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-white font-semibold mb-1">ProConnect</h3>
            <p className="text-white/70 text-xs">For professionals</p>
          </button>
        </div>
      </div>

      {/* Features Card - Customer focused */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold text-center mb-4">For Customers</h3>
        <div className="space-y-4">
          {customerFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                <p className="text-white/70 text-xs">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Card - Business focused */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
        <h3 className="text-white font-semibold text-center mb-4">For Professionals</h3>
        <div className="space-y-4">
          {businessFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                <p className="text-white/70 text-xs">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer text */}
      <p className="text-white/70 text-center text-sm">
        Join thousands of users on our platform
      </p>
    </div>
  );
};

export default Welcome;
