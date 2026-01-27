import { useState } from "react";
import { Briefcase, Plus, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegistrationData } from "@/pages/Register";

interface StepSkillsProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepSkills = ({ data, onUpdate, onNext, onBack }: StepSkillsProps) => {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      onUpdate({ skills: [...data.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    onUpdate({ skills: data.skills.filter((s) => s !== skill) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const isValid = data.skills.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-10 h-10 text-purple" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your Skills</h2>
        <p className="text-muted-foreground mt-1">Add your areas of expertise</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skills">Add Skills *</Label>
          <div className="flex gap-2">
            <Input
              id="skills"
              type="text"
              placeholder="e.g., Electrical Installation, Wiring"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 rounded-xl flex-1"
            />
            <Button
              type="button"
              onClick={addSkill}
              className="h-12 w-12 bg-primary text-primary-foreground rounded-xl p-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Skills list */}
        {data.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {!isValid && (
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-3">
            <p className="text-sm text-warning font-medium text-center">
              Add at least one skill to continue
            </p>
          </div>
        )}

        {/* Documents uploaded notice */}
        <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Documents uploaded</p>
            <p className="text-sm text-muted-foreground">You'll receive a verified badge after review</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 h-12 bg-primary/80 hover:bg-primary text-primary-foreground rounded-xl"
        >
          Complete Profile
        </Button>
      </div>
    </div>
  );
};

export default StepSkills;
