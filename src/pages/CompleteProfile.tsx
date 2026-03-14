import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, MapPin, Phone, Loader2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PROFESSIONAL_PROFESSIONS, HANDYMAN_PROFESSIONS, labelToEnum } from "@/constants/professions";
import { NIGERIAN_STATES } from "@/constants/nigerianStates";

const formatPhoneDigits = (value: string) => value.replace(/\D/g, "").slice(0, 10);

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

  const professions = formData.accountType === "professional" ? PROFESSIONAL_PROFESSIONS : HANDYMAN_PROFESSIONS;
  const phoneDigits = formData.phoneNumber.replace("+234", "").replace(/\D/g, "");

  const handlePhoneChange = (value: string) => {
    const digits = formatPhoneDigits(value);
    setFormData(prev => ({ ...prev, phoneNumber: digits ? `+234${digits}` : "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.profession) {
      toast.error("Please select your profession");
      return;
    }

    if (!user) {
      toast.error("Not authenticated");
      return;
    }

    // Map display label → DB enum value
    const specialtyEnum = labelToEnum(formData.profession, formData.accountType);
    if (!specialtyEnum) {
      toast.error(`"${formData.profession}" is not a recognised specialty.`);
      return;
    }

    setLoading(true);

    const profileFields = {
      full_name: formData.fullName,
      profession: specialtyEnum,
      bio: formData.bio || null,
      location: formData.location || null,
      updated_at: new Date().toISOString(),
    };

    // Try to UPDATE the existing trigger-created row
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update(profileFields)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    let profileId: string | null = updated?.id ?? null;

    // No existing row — INSERT one
    if (!profileId && !updateError) {
      const { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          account_type: formData.accountType,
          ...profileFields,
          skills: [],
        })
        .select("id")
        .single();

      if (insertError) {
        setLoading(false);
        if (insertError.code === "23505") {
          navigate("/dashboard");
          return;
        }
        toast.error(insertError.message || "Failed to create profile");
        return;
      }

      profileId = inserted?.id ?? null;
    } else if (updateError) {
      setLoading(false);
      toast.error(updateError.message || "Failed to update profile");
      return;
    }

    // Upsert private contact info
    if (profileId && formData.phoneNumber) {
      await supabase
        .from("profiles_private")
        .upsert({ profile_id: profileId, phone_number: formData.phoneNumber }, { onConflict: "profile_id" });
    }

    setLoading(false);
    toast.success("Profile saved!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl animate-scale-in">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-primary icon-float" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-1 text-center">Just a few more details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Account Type */}
          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "professional", profession: "" })}
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
                onClick={() => setFormData({ ...formData, accountType: "handyman", profession: "" })}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  formData.accountType === "handyman"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Wrench className={`w-6 h-6 mb-2 ${formData.accountType === "handyman" ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-medium text-foreground">Handyman</p>
                <p className="text-xs text-muted-foreground">Skilled worker</p>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" placeholder="Your full name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="h-12 rounded-xl" disabled={loading} />
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <Label htmlFor="profession">Profession *</Label>
            <Select value={formData.profession} onValueChange={(value) => setFormData({ ...formData, profession: value })} disabled={loading}>
              <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select your profession" /></SelectTrigger>
              <SelectContent>
                {professions.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* Location - Nigerian States */}
          <div className="space-y-2">
            <Label htmlFor="location">State *</Label>
            <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })} disabled={loading}>
              <SelectTrigger className="h-12 rounded-xl">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Select your state" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((state) => (<SelectItem key={state} value={state}>{state}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">+234</span>
              <Input
                id="phone"
                type="tel"
                placeholder="8012345678"
                value={phoneDigits}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="pl-14 h-12 rounded-xl"
                maxLength={10}
                disabled={loading}
              />
            </div>
            <p className="text-xs text-muted-foreground">{phoneDigits.length} / 10 digits</p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea id="bio" placeholder="Tell clients about your experience..." value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="rounded-xl min-h-[100px]" disabled={loading} />
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-lg font-semibold" disabled={loading || (phoneDigits.length > 0 && phoneDigits.length !== 10)}>
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" />Saving Profile...</>) : "Complete Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;