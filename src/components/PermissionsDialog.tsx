import { useState, useEffect } from "react";
import { Bell, MapPin, Camera, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/usePermissions";

const PermissionsDialog = () => {
  const { status, requestAllPermissions } = usePermissions();
  const [show, setShow] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!status.allRequested) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [status.allRequested]);

  if (!show || status.allRequested) return null;

  const handleAllow = async () => {
    setRequesting(true);
    await requestAllPermissions();
    setRequesting(false);
    setShow(false);
  };

  const permissions = [
    { icon: Bell, label: "Notifications", desc: "Get booking alerts & messages", color: "text-primary" },
    { icon: MapPin, label: "Location", desc: "Show nearby jobs on map", color: "text-success" },
    { icon: Camera, label: "Camera", desc: "Upload photos & documents", color: "text-warning" },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
      <div className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-6 pb-8 animate-scale-in shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Welcome to Safesight</h2>
          <p className="text-sm text-muted-foreground text-center mt-1">
            We need a few permissions to give you the best experience
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {permissions.map((perm, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/50 border border-border"
            >
              <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center ${perm.color}`}>
                <perm.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{perm.label}</p>
                <p className="text-xs text-muted-foreground">{perm.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>

        <Button
          onClick={handleAllow}
          disabled={requesting}
          className="w-full h-13 gradient-primary text-white rounded-xl text-base font-semibold shadow-lg"
        >
          {requesting ? "Setting up..." : "Allow & Continue"}
        </Button>

        <button
          onClick={() => {
            localStorage.setItem("safesight_permissions_requested", "true");
            setShow(false);
          }}
          className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default PermissionsDialog;
