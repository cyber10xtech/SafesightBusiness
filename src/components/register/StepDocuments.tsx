import { useState } from "react";
import { FileText, Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { RegistrationData } from "@/pages/Register";

interface StepDocumentsProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
  userId?: string;
}

interface UploadedFile {
  name: string;
  path: string;
  size: number;
}

const StepDocuments = ({ data, onUpdate, onNext, onBack, userId }: StepDocumentsProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!userId) {
      setError("Please complete the previous steps first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const newFiles: UploadedFile[] = [];

      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          setError("Only PDF, JPG, and PNG files are allowed");
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError("File size must be less than 5MB");
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('professional-documents')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          setError("Failed to upload file. Please try again.");
          continue;
        }

        newFiles.push({
          name: file.name,
          path: filePath,
          size: file.size,
        });
      }

      if (newFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...newFiles]);
        onUpdate({ documentsUploaded: true });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async (filePath: string) => {
    try {
      await supabase.storage
        .from('professional-documents')
        .remove([filePath]);

      setUploadedFiles(prev => prev.filter(f => f.path !== filePath));
      
      if (uploadedFiles.length <= 1) {
        onUpdate({ documentsUploaded: false });
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isValid = uploadedFiles.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Upload Documents</h2>
        <p className="text-muted-foreground mt-1">Verify your identity and credentials</p>
      </div>

      {/* Upload Area */}
      <div className="space-y-4">
        <Label>Required Documents *</Label>
        <p className="text-sm text-muted-foreground">
          Please upload at least one of the following: Government ID, Professional License, or Certification
        </p>

        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            id="documents"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading || !userId}
          />
          <label htmlFor="documents" className="cursor-pointer block">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Click to upload files</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB each)</p>
              </div>
            )}
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Files</Label>
            {uploadedFiles.map((file) => (
              <div
                key={file.path}
                className="flex items-center justify-between bg-muted/50 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.path)}
                  className="p-1 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-foreground font-medium mb-1">Why upload documents?</p>
          <p className="text-xs text-muted-foreground">
            Verified professionals receive a trust badge, appear higher in search results, 
            and build more customer confidence.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex-1 h-12 rounded-xl"
          disabled={uploading}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid || uploading}
          className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepDocuments;
