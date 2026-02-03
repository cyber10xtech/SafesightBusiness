import { useState, useRef } from "react";
import { 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Edit3, 
  Shield, 
  Award,
  Zap,
  Settings,
  LogOut,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if it exists
      await supabase.storage.from("avatars").remove([fileName]);

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });

      if (updateError) throw updateError;

      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
        <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
      </div>
    );
  }

  const menuItems = [
    { icon: Edit3, label: "Edit Profile", description: "Update your information", path: "/edit-profile" },
    { icon: Shield, label: "Verification", description: "Manage your credentials", badge: profile.documents_uploaded ? "Verified" : undefined, path: "/verification" },
    { icon: Award, label: "Certifications", description: "Add professional certificates", path: "/certifications" },
    { icon: Zap, label: "Boost Profile", description: "Get more visibility", badge: "Pro", path: "/boost-profile" },
    { icon: Settings, label: "Settings", description: "App preferences", path: "/settings" },
  ];

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Profile" showNotifications={false} />

      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-4 py-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-white text-primary text-xl font-bold">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-primary" />
              )}
            </button>
          </div>
          <div className="flex-1 text-white">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{profile.full_name}</h1>
              {profile.documents_uploaded && (
                <Shield className="w-5 h-5 text-success" />
              )}
            </div>
            <p className="text-white/80 text-sm">{profile.profession || profile.account_type}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-semibold">4.9</span>
              <span className="text-white/70 text-sm">(0 reviews)</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-xs text-white/70">Completed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">-</p>
            <p className="text-xs text-white/70">Rating</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-xs text-white/70">Reviews</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Contact Info */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h2 className="font-semibold text-foreground">Contact Information</h2>
          {profile.location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{profile.location}</span>
            </div>
          )}
          {profile.phone_number && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{profile.phone_number}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{user.email}</span>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h2 className="font-semibold text-foreground mb-2">About</h2>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h2 className="font-semibold text-foreground mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        {(profile.daily_rate || profile.contract_rate) && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h2 className="font-semibold text-foreground mb-3">Pricing</h2>
            <div className="grid grid-cols-2 gap-3">
              {profile.daily_rate && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Daily Rate</p>
                  <p className="text-lg font-bold text-foreground">{profile.daily_rate}</p>
                </div>
              )}
              {profile.contract_rate && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Contract Rate</p>
                  <p className="text-lg font-bold text-foreground">{profile.contract_rate}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              {item.badge && (
                <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
