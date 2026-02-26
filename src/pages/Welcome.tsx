import { User, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logoBusiness from "@/assets/logo-business.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    { title: "Showcase Your Work", description: "Build your professional portfolio" },
    { title: "Connect with Customers", description: "Get direct booking requests" },
    { title: "Grow Your Business", description: "Manage bookings & build reputation" },
    { title: "Verified Professionals", description: "Upload documents for trust badge" },
  ];

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center px-6 py-12">
      {/* Logo and Title */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden icon-float">
          <img src={logoBusiness} alt="Safesight Business Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Safesight Business</h1>
        <p className="text-white/80">Your construction job market solution</p>
      </div>

      {/* Sign In Button */}
      <div className="w-full max-w-md mb-8 animate-fade-in" style={{ animationDelay: "0.15s" }}>
        <Button
          onClick={() => navigate("/sign-in")}
          className="w-full h-14 bg-white text-primary hover:bg-white/90 rounded-2xl text-lg font-semibold shadow-lg tap-scale group"
        >
          <User className="w-5 h-5 mr-2 group-hover:icon-bounce" />
          Sign In
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
        <p className="text-center text-white/80 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/account-type")}
            className="text-white font-semibold underline tap-scale"
          >
            Register
          </button>
        </p>
      </div>

      {/* Features Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-white font-semibold text-center mb-4">Why Join Us?</h3>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
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
      <p className="text-white/70 text-center text-sm mt-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
        Trusted by professionals across Nigeria
      </p>
    </div>
  );
};

export default Welcome;
