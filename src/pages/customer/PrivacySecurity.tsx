import { useState } from "react";
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Smartphone, 
  Users, 
  MapPin, 
  Eye, 
  Download, 
  Trash2 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const PrivacySecurity = () => {
  const navigate = useNavigate();
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);

  const securityScore = 85;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Privacy & Security</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Security Score Card */}
        <div className="bg-success rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-success-foreground" />
            <div>
              <h2 className="font-semibold text-success-foreground">Account Protected</h2>
              <p className="text-sm text-success-foreground/80">Your account is secure</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-success-foreground/80 mb-2">
            <span>Security Score</span>
            <span className="font-semibold">{securityScore}/100</span>
          </div>
          <Progress value={securityScore} className="h-2 bg-success-foreground/20" />
        </div>

        {/* Security Section */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
          <div className="px-4 py-3 bg-muted/30">
            <h3 className="font-semibold text-foreground">Security</h3>
          </div>
          
          <button className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <span className="font-medium text-foreground block">Change Password</span>
                <span className="text-xs text-muted-foreground">Update your account password</span>
              </div>
            </div>
            <span className="text-primary text-sm font-medium">Change</span>
          </button>

          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <span className="font-medium text-foreground block">Two-Factor Authentication</span>
                <span className="text-xs text-muted-foreground">Add an extra layer of security</span>
              </div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <span className="font-medium text-foreground block">Active Sessions</span>
                <span className="text-xs text-muted-foreground">Manage your logged-in devices</span>
              </div>
            </div>
            <span className="text-muted-foreground text-sm">2 devices</span>
          </button>
        </div>

        {/* Privacy Section */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
          <div className="px-4 py-3 bg-muted/30">
            <h3 className="font-semibold text-foreground">Privacy</h3>
          </div>

          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-success" />
              <div>
                <span className="font-medium text-foreground block">Location Sharing</span>
                <span className="text-xs text-muted-foreground">Share location with professionals</span>
              </div>
            </div>
            <Switch
              checked={locationSharing}
              onCheckedChange={setLocationSharing}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-primary" />
              <div>
                <span className="font-medium text-foreground block">Profile Visibility</span>
                <span className="text-xs text-muted-foreground">Show your profile to professionals</span>
              </div>
            </div>
            <Switch
              checked={profileVisibility}
              onCheckedChange={setProfileVisibility}
            />
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
          <div className="px-4 py-3 bg-muted/30">
            <h3 className="font-semibold text-foreground">Data Management</h3>
          </div>

          <button className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <span className="font-medium text-foreground block">Download My Data</span>
                <span className="text-xs text-muted-foreground">Get a copy of your information</span>
              </div>
            </div>
            <span className="text-primary text-sm font-medium">Request</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <div className="text-left">
                <span className="font-medium text-foreground block">Delete Account</span>
                <span className="text-xs text-muted-foreground">Permanently delete your account</span>
              </div>
            </div>
            <span className="text-destructive text-sm font-medium">Delete</span>
          </button>
        </div>

        {/* Security Tips */}
        <div className="bg-muted/50 rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-2">Security Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use a strong, unique password</li>
            <li>• Enable two-factor authentication</li>
            <li>• Never share your password with anyone</li>
            <li>• Review active sessions regularly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurity;
