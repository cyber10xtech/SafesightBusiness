import { useState, useEffect } from "react";
import { Download, Smartphone, Share, Plus, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const CustomerInstall = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Install HandyConnect</h1>
        <p className="text-white/80 mt-1">Add to your home screen for the best experience</p>
      </div>

      <div className="p-6 -mt-4">
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          {isInstalled ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Already Installed!</h2>
              <p className="text-muted-foreground">
                HandyConnect is already installed on your device. Open it from your home screen.
              </p>
              <Button 
                onClick={() => navigate("/customer/home")} 
                className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
              >
                Go to Home
              </Button>
            </div>
          ) : isIOS ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Install on iPhone/iPad</h2>
                <p className="text-muted-foreground">Follow these steps to install</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tap the Share button</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      Look for <Share className="w-4 h-4" /> at the bottom of Safari
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Scroll down and tap</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      "Add to Home Screen" <Plus className="w-4 h-4" />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tap "Add"</p>
                    <p className="text-sm text-muted-foreground">HandyConnect will appear on your home screen</p>
                  </div>
                </div>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Install HandyConnect</h2>
              <p className="text-muted-foreground mb-6">
                Get quick access from your home screen. Works offline!
              </p>
              <Button onClick={handleInstall} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white w-full h-12">
                <Download className="w-5 h-5 mr-2" />
                Install Now
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Install on Android</h2>
                <p className="text-muted-foreground">Follow these steps to install</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Open browser menu</p>
                    <p className="text-sm text-muted-foreground">Tap the ⋮ icon in the top right</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tap "Install app" or "Add to Home screen"</p>
                    <p className="text-sm text-muted-foreground">This option may vary by browser</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Confirm installation</p>
                    <p className="text-sm text-muted-foreground">HandyConnect will appear on your home screen</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-foreground">Why install?</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Quick access from your home screen</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Works offline</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Faster loading times</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Full-screen experience</span>
          </div>
        </div>

        {/* Direct links for testing */}
        <div className="mt-8 p-4 bg-muted/30 rounded-xl">
          <h3 className="font-semibold text-foreground mb-2">Test URLs</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Open these links on your phone to install:
          </p>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-background rounded-lg break-all font-mono text-xs">
              Customer: {window.location.origin}/customer/install
            </div>
            <div className="p-2 bg-background rounded-lg break-all font-mono text-xs">
              Professional: {window.location.origin}/install
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInstall;
