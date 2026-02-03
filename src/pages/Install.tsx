import { useState, useEffect } from "react";
import { Download, Smartphone, Share, Plus, CheckCircle, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

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
      <div className="gradient-primary text-white p-6 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Safesearch Business</h1>
            <p className="text-white/80">Add to your home screen</p>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-4">
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          {isInstalled ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Already Installed!</h2>
              <p className="text-muted-foreground">
                Safesearch Business is already installed. Open it from your home screen.
              </p>
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="mt-6 gradient-primary text-white"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : isIOS ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Install on iPhone/iPad</h2>
                <p className="text-muted-foreground">Follow these steps to install</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
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
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
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
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tap "Add"</p>
                    <p className="text-sm text-muted-foreground">The app will appear on your home screen</p>
                  </div>
                </div>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Install Safesearch Business</h2>
              <p className="text-muted-foreground mb-6">
                Get quick access from your home screen. Works offline!
              </p>
              <Button onClick={handleInstall} className="gradient-primary text-white w-full h-12">
                <Download className="w-5 h-5 mr-2" />
                Install Now
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Install on Android</h2>
                <p className="text-muted-foreground">Follow these steps to install</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Open browser menu</p>
                    <p className="text-sm text-muted-foreground">Tap the ⋮ icon in the top right</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tap "Install app" or "Add to Home screen"</p>
                    <p className="text-sm text-muted-foreground">This option may vary by browser</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Confirm installation</p>
                    <p className="text-sm text-muted-foreground">The app will appear on your home screen</p>
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
            <CheckCircle className="w-5 h-5 text-success shrink-0" />
            <span>Quick access from your home screen</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-success shrink-0" />
            <span>Works offline</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-success shrink-0" />
            <span>Faster loading times</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-success shrink-0" />
            <span>Full-screen experience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Install;
