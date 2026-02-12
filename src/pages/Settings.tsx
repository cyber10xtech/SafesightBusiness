import { ArrowLeft, Bell, Moon, Globe, Lock, HelpCircle, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = (setting: string, value: boolean) => {
    if (setting === "notifications") {
      setNotifications(value);
      toast.success(value ? "Notifications enabled" : "Notifications disabled");
    } else if (setting === "darkMode") {
      setDarkMode(value);
      toast.info("Dark mode coming soon!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  const settingsSections = [
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Receive booking and message alerts",
          type: "toggle" as const,
          value: notifications,
          onChange: (v: boolean) => handleToggle("notifications", v),
        },
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Switch to dark theme",
          type: "toggle" as const,
          value: darkMode,
          onChange: (v: boolean) => handleToggle("darkMode", v),
        },
        {
          icon: Globe,
          label: "Language",
          description: "English",
          type: "link" as const,
          onClick: () => toast.info("Language settings coming soon!"),
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          icon: Lock,
          label: "Change Password",
          description: "Update your password",
          type: "link" as const,
          onClick: () => navigate("/forgot-password"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          description: "FAQs and support",
          type: "link" as const,
          onClick: () => toast.info("Help center coming soon!"),
        },
        {
          icon: FileText,
          label: "Terms of Service",
          description: "Read our terms",
          type: "link" as const,
          onClick: () => toast.info("Terms of service coming soon!"),
        },
        {
          icon: FileText,
          label: "Privacy Policy",
          description: "How we handle your data",
          type: "link" as const,
          onClick: () => toast.info("Privacy policy coming soon!"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {section.title}
            </h2>
            
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {section.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${
                    index !== section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  
                  {item.type === "toggle" ? (
                    <Switch
                      checked={item.value}
                      onCheckedChange={item.onChange}
                    />
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* App Version */}
        <div className="text-center pt-8 pb-4">
          <p className="text-sm text-muted-foreground">Safesight Business v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
