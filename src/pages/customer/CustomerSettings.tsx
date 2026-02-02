import { User, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const settingsItems = [
  { icon: User, label: "Edit Profile", path: "/customer/profile/edit" },
  { icon: Bell, label: "Notifications", path: "/customer/settings/notifications" },
  { icon: Shield, label: "Privacy & Security", path: "/customer/settings/privacy" },
  { icon: CreditCard, label: "Payment Methods", path: "/customer/settings/payments" },
  { icon: HelpCircle, label: "Help & Support", path: "/customer/settings/help" },
];

const CustomerSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-6">Settings</h1>

        {/* Profile Card */}
        <div className="bg-card rounded-xl p-4 border border-border mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {user?.email?.[0].toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground">
                {user?.email?.split("@")[0] || "User"}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-2 mb-6">
          {settingsItems.map((item) => (
            <button
              key={item.label}
              onClick={() => console.log("Navigate to", item.path)}
              className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border mb-6">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Dark Mode</span>
          </div>
          <Switch />
        </div>

        {/* Sign Out */}
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
      <CustomerBottomNav />
    </div>
  );
};

export default CustomerSettings;
