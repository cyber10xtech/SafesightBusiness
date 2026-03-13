import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROFESSIONAL_PROFESSIONS, HANDYMAN_PROFESSIONS } from "@/constants/professions";
import { NIGERIAN_STATES } from "@/constants/nigerianStates";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const formatPhoneDigits = (value: string) => value.replace(/\D/g, "").slice(0, 10);

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  
  const [formData, setFormData] = useState({
    full_name: "",
    profession: "",
    bio: "",
    location: "",
    phone_number: "",
    whatsapp_number: "",
    daily_rate: "",
    contract_rate: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        profession: profile.profession || "",
        bio: profile.bio || "",
        location: profile.location || "",
        phone_number: profile.phone_number || "",
        whatsapp_number: profile.whatsapp_number || "",
        daily_rate: profile.daily_rate || "",
        contract_rate: profile.contract_rate || "",
      });
    }
  }, [profile]);

  const phoneDigits = formData.phone_number.replace("+234", "").replace(/\D/g, "");
  const whatsappDigits = formData.whatsapp_number.replace("+234", "").replace(/\D/g, "");

  const handlePhoneChange = (value: string) => {
    const digits = formatPhoneDigits(value);
    setFormData(prev => ({ ...prev, phone_number: digits ? `+234${digits}` : "" }));
  };

  const handleWhatsappChange = (value: string) => {
    const digits = formatPhoneDigits(value);
    setFormData(prev => ({ ...prev, whatsapp_number: digits ? `+234${digits}` : "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Convert profession display label to enum for DB storage
    const { labelToEnum } = await import("@/constants/professions");
    const professionEnum = formData.profession ? labelToEnum(formData.profession, profile?.account_type) : null;
    
    const { error } = await updateProfile({
      ...formData,
      profession: professionEnum || formData.profession,
    });
    
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
      navigate("/profile");
    }
    
    setSaving(false);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Edit Profile</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 animate-fade-in">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Personal Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter your full name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Select value={formData.profession} onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}>
              <SelectTrigger><SelectValue placeholder="Select your profession" /></SelectTrigger>
              <SelectContent>
                {(profile?.account_type === "professional" ? PROFESSIONAL_PROFESSIONS : HANDYMAN_PROFESSIONS).map((profession) => (
                  <SelectItem key={profession} value={profession}>{profession}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell clients about yourself..." rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">State</Label>
            <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Select your state" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Contact Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">+234</span>
              <Input
                id="phone_number"
                type="tel"
                value={phoneDigits}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="8012345678"
                className="pl-14"
                maxLength={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-success">+234</span>
              <Input
                id="whatsapp_number"
                type="tel"
                value={whatsappDigits}
                onChange={(e) => handleWhatsappChange(e.target.value)}
                placeholder="8012345678"
                className="pl-14"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pricing</h2>
          
          <div className="space-y-2">
            <Label htmlFor="daily_rate">Daily Rate (₦)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">₦</span>
              <Input id="daily_rate" name="daily_rate" type="number" value={formData.daily_rate} onChange={handleChange} placeholder="15000" className="pl-8" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract_rate">Contract Rate (₦)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">₦</span>
              <Input id="contract_rate" name="contract_rate" type="number" value={formData.contract_rate} onChange={handleChange} placeholder="50000" className="pl-8" />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;
