import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MessageCircle, DollarSign, Gift, Bell, Smartphone, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface NotificationSetting {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  label: string;
  description: string;
  push: boolean;
  email: boolean;
  sms: boolean;
}

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { isSupported, isSubscribed, permission, loading: pushLoading, subscribe, unsubscribe } = usePushNotifications('customer');
  
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "booking",
      icon: Calendar,
      iconColor: "text-primary",
      label: "Booking Updates",
      description: "Confirmations, cancellations, and booking changes",
      push: true,
      email: true,
      sms: true,
    },
    {
      id: "messages",
      icon: MessageCircle,
      iconColor: "text-success",
      label: "New Messages",
      description: "Messages from service professionals",
      push: true,
      email: true,
      sms: false,
    },
    {
      id: "payments",
      icon: DollarSign,
      iconColor: "text-warning",
      label: "Payment Notifications",
      description: "Payment confirmations and receipts",
      push: true,
      email: true,
      sms: false,
    },
    {
      id: "offers",
      icon: Gift,
      iconColor: "text-purple",
      label: "Offers & Promotions",
      description: "Special deals and discounts",
      push: true,
      email: false,
      sms: false,
    },
    {
      id: "reminders",
      icon: Bell,
      iconColor: "text-primary",
      label: "Appointment Reminders",
      description: "Reminders about upcoming appointments",
      push: true,
      email: true,
      sms: true,
    },
  ]);

  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const handleToggle = (id: string, type: "push" | "email" | "sms") => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, [type]: !setting[type] }
        : setting
    ));
  };

  const handlePushToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Notification Settings</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Push Notification Enable/Disable */}
        {isSupported && (
          <div className="bg-card rounded-xl border border-border p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-medium text-foreground">Push Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    {permission === 'denied' 
                      ? 'Permission denied. Please enable in browser settings.' 
                      : isSubscribed 
                        ? 'Enabled - You will receive push notifications'
                        : 'Enable to receive notifications on this device'}
                  </p>
                </div>
              </div>
              {pushLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : (
                <Switch
                  checked={isSubscribed}
                  onCheckedChange={handlePushToggle}
                  disabled={permission === 'denied'}
                />
              )}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-primary/5 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Choose how you want to receive notifications about your bookings and messages.
              </p>
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex items-center justify-end gap-8 mb-2 px-4">
          <span className="text-xs text-muted-foreground w-12 text-center">Push</span>
          <span className="text-xs text-muted-foreground w-12 text-center">Email</span>
          <span className="text-xs text-muted-foreground w-12 text-center">SMS</span>
        </div>

        {/* Settings List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          {settings.map((setting, index) => {
            const Icon = setting.icon;
            return (
              <div 
                key={setting.id}
                className={cn(
                  "p-4",
                  index < settings.length - 1 && "border-b border-border"
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn("w-5 h-5 mt-0.5", setting.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{setting.label}</h3>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-8 mt-2">
                  <div className="w-12 flex justify-center">
                    <Switch
                      checked={setting.push}
                      onCheckedChange={() => handleToggle(setting.id, "push")}
                    />
                  </div>
                  <div className="w-12 flex justify-center">
                    <Switch
                      checked={setting.email}
                      onCheckedChange={() => handleToggle(setting.id, "email")}
                    />
                  </div>
                  <div className="w-12 flex justify-center">
                    <Switch
                      checked={setting.sms}
                      onCheckedChange={() => handleToggle(setting.id, "sms")}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Do Not Disturb */}
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Do Not Disturb</h3>
              <p className="text-xs text-muted-foreground">Pause all notifications temporarily</p>
            </div>
            <Switch
              checked={doNotDisturb}
              onCheckedChange={setDoNotDisturb}
            />
          </div>
        </div>

        {/* Notice */}
        <p className="text-xs text-muted-foreground text-center px-4">
          Important booking updates and security notifications will always be sent regardless of your preferences.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;
