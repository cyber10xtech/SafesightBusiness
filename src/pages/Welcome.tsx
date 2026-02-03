import { useState, useEffect } from "react";
import { User, CheckCircle, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (!isStandalone) {
      setShowInstall(true);
    }
  }, []);

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
    {
      title: "Verified Professionals",
      description: "Upload documents for trust badge",
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

      {/* Logo and Title */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Safesearch Business</h1>
        <p className="text-white/80">For verified professionals</p>
      </div>

      {/* Sign In Button */}
      <div className="w-full max-w-md mb-8">
        <Button
          onClick={() => navigate("/sign-in")}
          className="w-full h-14 bg-white text-primary hover:bg-white/90 rounded-2xl text-lg font-semibold shadow-lg"
        >
          <User className="w-5 h-5 mr-2" />
          Sign In
        </Button>
        <p className="text-center text-white/80 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/account-type")}
            className="text-white font-semibold underline"
          >
            Register
          </button>
        </p>
      </div>

      {/* Features Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-white font-semibold text-center mb-4">Why Join Us?</h3>
        <div className="space-y-4">
          {features.map((feature, index) => (
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
      <p className="text-white/70 text-center text-sm mt-8">
        Trusted by professionals across Nigeria
      </p>
    </div>
  );
};

export default Welcome;
