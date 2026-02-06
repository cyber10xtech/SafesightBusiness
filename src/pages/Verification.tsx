import { useState } from "react";
import { ArrowLeft, Upload, FileText, CheckCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const Verification = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        toast.error("Please sign in to upload documents");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${SUPABASE_URL}/functions/v1/upload-document`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadedFiles(prev => [...prev, file.name]);
      await updateProfile({ documents_uploaded: true });
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
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
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Verification</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Status Card */}
        <div className={`p-4 rounded-xl border ${profile.documents_uploaded ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
          <div className="flex items-center gap-3">
            {profile.documents_uploaded ? (
              <CheckCircle className="w-6 h-6 text-success" />
            ) : (
              <FileText className="w-6 h-6 text-warning" />
            )}
            <div>
              <p className="font-medium">
                {profile.documents_uploaded ? "Verified" : "Pending Verification"}
              </p>
              <p className="text-sm text-muted-foreground">
                {profile.documents_uploaded 
                  ? "Your documents have been verified" 
                  : "Upload documents to get verified"}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Required Documents</h2>
          
          <div className="space-y-3">
            <div className="p-4 border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Government ID</p>
                    <p className="text-sm text-muted-foreground">Passport, Driver's License, or National ID</p>
                  </div>
                </div>
                {profile.documents_uploaded && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
              </div>
            </div>

            <div className="p-4 border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Proof of Address</p>
                    <p className="text-sm text-muted-foreground">Utility bill or bank statement</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Professional License</p>
                    <p className="text-sm text-muted-foreground">Trade license or certification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Uploaded Files</h2>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{file}</span>
                </div>
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <Button className="w-full" variant="outline" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
