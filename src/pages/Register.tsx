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

export interface RegistrationData {
  accountType: "professional" | "handyman";
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  profession: string;
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
  const accountType = location.state?.accountType || "handyman";
  
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

  // Send welcome email via edge function
  const sendWelcomeEmail = async (email: string, fullName: string, accountType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-welcome-email", {
        body: { email, fullName, accountType },
      });
      if (error) {
        console.error("Welcome email error:", error);
      }
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }
  };

  // Handle step 1 - create account first for document upload
  const handleCredentialsNext = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    
    const { error, userId: newUserId } = await signUp(formData.email, formData.password, {
      accountType: formData.accountType,
      fullName: formData.fullName || formData.email.split("@")[0],
      profession: "",
      bio: "",
      location: "",
      phoneNumber: "",
      whatsappNumber: "",
      dailyRate: "",
      contractRate: "",
      skills: [],
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message || "Failed to create account");
      return;
    }

    if (newUserId) {
      setUserId(newUserId);
    }

    // Send welcome email (fire-and-forget)
    sendWelcomeEmail(
      formData.email,
      formData.fullName || formData.email.split("@")[0],
      formData.accountType
    );
    
    setCurrentStep(2);
    toast.success("Account created! Complete your profile to continue.");
  };

  // Update profile with additional info
  const updateProfile = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          profession: formData.profession || null,
          bio: formData.bio || null,
          location: formData.location || null,
          phone_number: formData.phoneNumber || null,
          whatsapp_number: formData.whatsappNumber || null,
          daily_rate: formData.dailyRate || null,
          contract_rate: formData.contractRate || null,
          skills: formData.skills || [],
          documents_uploaded: formData.documentsUploaded,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error updating profile:", err);
      }
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      // Update profile on each step
      if (userId) {
        await updateProfile();
      }
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final step - update profile and redirect
      setIsSubmitting(true);
      await updateProfile();
      setIsSubmitting(false);
      
      toast.success("Profile completed! Welcome aboard!");
      navigate("/dashboard");
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
      case 1: return "Create Account";
      case 2: return "Personal Info";
      case 3: return "Contact & Pricing";
      case 4: return "Upload Documents";
      case 5: return "Your Skills";
      default: return "";
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
          <StepPersonalInfo
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepContactPricing
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
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
            <span className="text-sm font-medium text-foreground">Step {currentStep} of {totalSteps}: {getStepTitle()}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Register;
