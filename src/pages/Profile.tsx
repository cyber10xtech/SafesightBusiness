import { useState } from "react";
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
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  
  const profile = {
    name: "Ozioma FM",
    profession: "Master Electrician",
    location: "Lagos, Nigeria",
    phone: "+234 801 234 5678",
    email: "ozioma@example.com",
    bio: "Certified electrician with 10+ years of experience in residential and commercial electrical installations, repairs, and maintenance.",
    rating: 4.9,
    reviews: 156,
    completedJobs: 234,
    verified: true,
    skills: ["Electrical Installation", "Wiring", "Circuit Breakers", "Solar Panels", "Generator Setup"],
    dailyRate: "₦35,000",
    contractRate: "₦250,000+",
  };

  const menuItems = [
    { icon: Edit3, label: "Edit Profile", description: "Update your information" },
    { icon: Shield, label: "Verification", description: "Manage your credentials", badge: "Verified" },
    { icon: Award, label: "Certifications", description: "Add professional certificates" },
    { icon: Zap, label: "Boost Profile", description: "Get more visibility", badge: "Pro" },
    { icon: Settings, label: "Settings", description: "App preferences" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Profile" showNotifications={false} />

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-4 py-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-white text-primary text-xl font-bold">
                OF
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-primary" />
            </button>
          </div>
          <div className="flex-1 text-white">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{profile.name}</h1>
              {profile.verified && (
                <Shield className="w-5 h-5 text-success" />
              )}
            </div>
            <p className="text-white/80 text-sm">{profile.profession}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-semibold">{profile.rating}</span>
              <span className="text-white/70 text-sm">({profile.reviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{profile.completedJobs}</p>
            <p className="text-xs text-white/70">Completed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{profile.rating}</p>
            <p className="text-xs text-white/70">Rating</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{profile.reviews}</p>
            <p className="text-xs text-white/70">Reviews</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Contact Info */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <h2 className="font-semibold text-foreground">Contact Information</h2>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{profile.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{profile.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{profile.email}</span>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold text-foreground mb-2">About</h2>
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        </div>

        {/* Skills */}
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

        {/* Pricing */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold text-foreground mb-3">Pricing</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Daily Rate</p>
              <p className="text-lg font-bold text-foreground">{profile.dailyRate}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Contract Rate</p>
              <p className="text-lg font-bold text-foreground">{profile.contractRate}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
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
          onClick={() => navigate("/")}
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
