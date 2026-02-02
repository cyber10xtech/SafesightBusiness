import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, MapPin, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountType: "handyman" as "professional" | "handyman",
    fullName: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
    profession: "",
    bio: "",
    location: "",
    phoneNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!user) {
      toast.error("Not authenticated");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("profiles").insert({
      user_id: user.id,
      account_type: formData.accountType,
      full_name: formData.fullName,
      profession: formData.profession || null,
      bio: formData.bio || null,
      location: formData.location || null,
      phone_number: formData.phoneNumber || null,
      skills: [],
    });

    setLoading(false);

    if (error) {
      // Check if profile already exists
      if (error.code === "23505") {
        navigate("/dashboard");
        return;
      }
      toast.error(error.message || "Failed to create profile");
      return;
    }

    toast.success("Profile created!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-1 text-center">
            Just a few more details to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account Type */}
          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "professional" })}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  formData.accountType === "professional"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Briefcase className={`w-6 h-6 mb-2 ${formData.accountType === "professional" ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-medium text-foreground">Professional</p>
                <p className="text-xs text-muted-foreground">Licensed expert</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "handyman" })}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  formData.accountType === "handyman"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <User className={`w-6 h-6 mb-2 ${formData.accountType === "handyman" ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-medium text-foreground">Handyman</p>
                <p className="text-xs text-muted-foreground">Skilled worker</p>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="h-12 rounded-xl"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              placeholder="e.g., Electrician, Plumber"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className="h-12 rounded-xl"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="pl-11 h-12 rounded-xl"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="+234 801 234 5678"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="pl-11 h-12 rounded-xl"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              placeholder="Tell clients about your experience..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="rounded-xl min-h-[100px]"
              disabled={loading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-lg font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating Profile...
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
