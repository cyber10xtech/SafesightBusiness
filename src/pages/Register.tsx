import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import StepCredentials from "@/components/register/StepCredentials";
import StepPersonalInfo from "@/components/register/StepPersonalInfo";
import StepContactPricing from "@/components/register/StepContactPricing";
import StepSkills from "@/components/register/StepSkills";

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
  const accountType = location.state?.accountType || "handyman";
  
  const [currentStep, setCurrentStep] = useState(1);
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

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (data: Partial<RegistrationData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete registration
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepCredentials
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
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
          <StepSkills
            data={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
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
            <span className="text-sm font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
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
