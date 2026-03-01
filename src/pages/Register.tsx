import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import StepCredentials from "@/components/register/StepCredentials";
import StepPersonalInfo from "@/components/register/StepPersonalInfo";
import StepContactPricing from "@/components/register/StepContactPricing";
import StepDocuments from "@/components/register/StepDocuments";
import StepSkills from "@/components/register/StepSkills";
import { supabase } from "@/integrations/supabase/client";
import { labelToEnum } from "@/constants/professions";
import type { ProfessionSpecialtyEnum, HandymanSpecialtyEnum } from "@/constants/professions";

export interface RegistrationData {
  accountType: "professional" | "handyman";
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  profession: string; // display label selected in UI
  bio: string;
  location: string;
  phoneNumber: string;
  whatsappNumber: string;
  dailyRate: string;
  contractRate: string;
  skills: string[];
  documentsUploaded: boolean;
}

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const accountType = (location.state?.accountType as "professional" | "handyman") || "handyman";

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [formData, setFormData] = useState<RegistrationData>({
    accountType,
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    profession: "",
    bio: "",
    location: "",
    phoneNumber: "",
    whatsappNumber: "",
    dailyRate: "",
    contractRate: "",
    skills: [],
    documentsUploaded: false,
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (data: Partial<RegistrationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // ── Step 1: Credentials ────────────────────────────────────────────────────
  // Just validate locally — account is NOT created yet (we need the profession
  // from step 2 to pass the specialty to the DB trigger).
  const handleCredentialsNext = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (
      !/[a-zA-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[^a-zA-Z0-9]/.test(formData.password)
    ) {
      toast.error("Password must contain letters, numbers, and special characters");
      return;
    }
    setCurrentStep(2);
  };

  // ── Step 2: Personal Info → CREATE AUTH ACCOUNT ───────────────────────────
  // We have the profession now. Map it to the enum value and create the account.
  // The DB trigger (handle_new_user) will insert the profiles row using the
  // specialty value from metadata.
  const handlePersonalInfoNext = async () => {
    if (!formData.fullName || !formData.profession || !formData.bio || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Map display label → DB enum value
    const specialtyEnum = labelToEnum(formData.profession, formData.accountType);
    if (!specialtyEnum) {
      toast.error(`"${formData.profession}" is not a recognised specialty. Please select from the list.`);
      return;
    }

    setIsSubmitting(true);

    const { error, userId: newUserId } = await signUp(formData.email, formData.password, {
      accountType: formData.accountType,
      fullName: formData.fullName,
      professionSpecialty:
        formData.accountType === "professional" ? (specialtyEnum as ProfessionSpecialtyEnum) : undefined,
      handymanSpecialty: formData.accountType === "handyman" ? (specialtyEnum as HandymanSpecialtyEnum) : undefined,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message || "Failed to create account");
      return;
    }

    if (newUserId) {
      setUserId(newUserId);
      // Immediately update the extra fields the trigger doesn't set
      await updateProfile(newUserId);
    }

    setCurrentStep(3);
    toast.success("Account created! Complete your profile to continue.");
  };

  // ── Update profile (steps 3-5) ─────────────────────────────────────────────
  // Maps form fields to the correct unified DB columns.
  // The specialty columns are never updated here — they were set at signup.
  const updateProfile = async (uid?: string) => {
    const targetUserId = uid ?? userId;
    if (!targetUserId) return;

    try {
      // Fetch the profile row id first (needed for profiles_private upsert)
      const { data: profileRow, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", targetUserId)
        .single();

      if (fetchError) throw fetchError;

      // Update public profile fields (specialty NOT touched — set by trigger)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName || undefined,
          bio: formData.bio || null,
          location: formData.location || null,
          daily_rate: formData.dailyRate || null,
          contract_rate: formData.contractRate || null,
          skills: formData.skills.length ? formData.skills : [],
          documents_uploaded: formData.documentsUploaded,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", targetUserId);

      if (profileError) throw profileError;

      // Upsert private contact info
      if (formData.phoneNumber || formData.whatsappNumber) {
        const { error: privateError } = await supabase.from("profiles_private").upsert(
          {
            profile_id: profileRow.id,
            phone_number: formData.phoneNumber || null,
            whatsapp_number: formData.whatsappNumber || null,
          },
          { onConflict: "profile_id" },
        );
        if (privateError) throw privateError;
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error updating profile:", err);
      }
    }
  };

  // ── Steps 3-5: just update profile then advance ────────────────────────────
  const handleNext = async () => {
    if (currentStep < totalSteps) {
      if (userId) await updateProfile();
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      await updateProfile();
      setIsSubmitting(false);
      toast.success("Profile completed! Please check your email to verify your account before signing in.");
      navigate("/sign-in");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/account-type");
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Create Account";
      case 2:
        return "Personal Info";
      case 3:
        return "Contact & Pricing";
      case 4:
        return "Upload Documents";
      case 5:
        return "Your Skills";
      default:
        return "";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepCredentials
            data={formData}
            onUpdate={updateFormData}
            onNext={handleCredentialsNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      case 2:
        return (
          // onNext is now handlePersonalInfoNext — this is where the account is created
          <StepPersonalInfo
            data={formData}
            onUpdate={updateFormData}
            onNext={handlePersonalInfoNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return <StepContactPricing data={formData} onUpdate={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return (
          <StepDocuments
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            userId={userId}
          />
        );
      case 5:
        return (
          <StepSkills
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl overflow-hidden">
        {/* Progress Header */}
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {totalSteps}: {getStepTitle()}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="p-6">{renderStep()}</div>
      </div>
    </div>
  );
};

export default Register;
