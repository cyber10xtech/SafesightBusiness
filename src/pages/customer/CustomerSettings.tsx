import { 
  User, 
  Heart, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  Share2, 
  FileText, 
  LogOut, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const settingsItems = [
  { 
    icon: User, 
    label: "Edit Profile", 
    description: "Update your personal information",
    path: "/customer/settings/edit-profile" 
  },
  { 
    icon: Heart, 
    label: "Saved Professionals", 
    description: "View your favorite handymen",
    path: "/customer/hub?tab=favorites" 
  },
  { 
    icon: CreditCard, 
    label: "Payment Methods", 
    description: "Manage your payment options",
    path: "/customer/settings/payments" 
  },
  { 
    icon: Bell, 
    label: "Notifications", 
    description: "Manage notification preferences",
    path: "/customer/settings/notifications" 
  },
  { 
    icon: Shield, 
    label: "Privacy & Security", 
    description: "Control your privacy settings",
    path: "/customer/settings/privacy" 
  },
  { 
    icon: HelpCircle, 
    label: "Help & Support", 
    description: "Get help and contact support",
    path: "/customer/settings/help" 
  },
];

const secondaryItems = [
  { 
    icon: Share2, 
    label: "Invite Friends", 
    description: "Share HandyConnect and earn rewards",
    path: "/customer/invite" 
  },
  { 
    icon: FileText, 
    label: "Terms & Privacy", 
    description: "Read our terms and privacy policy",
    path: "/customer/terms" 
  },
];

const CustomerSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const userName = user?.email?.split("@")[0] || "John Doe";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-6">Settings</h1>

        {/* Profile Card */}
        <div className="bg-primary rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-primary-foreground/20">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-lg font-semibold">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold text-primary-foreground capitalize">
                {userName}
              </h2>
              <p className="text-sm text-primary-foreground/80">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/customer/settings/edit-profile")}
            className="mt-3 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0"
          >
            View Profile
          </Button>
        </div>

        {/* Main Settings */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
          {settingsItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors ${
                index < settingsItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-medium text-foreground block">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Secondary Settings */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
          {secondaryItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => console.log("Navigate to", item.path)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors ${
                index < secondaryItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <span className="font-medium text-foreground block">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Version Info */}
        <div className="text-center text-sm text-muted-foreground mb-4">
          <p>HandyConnect Version 1.0.0</p>
          <p className="text-xs">
            <button className="hover:underline">Terms of Service</button>
            {" • "}
            <button className="hover:underline">Privacy Policy</button>
          </p>
        </div>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
      <CustomerBottomNav />
    </div>
  );
};

export default CustomerSettings;
