import { ArrowLeft, CheckCircle, FileText, Loader2, Info, MessageCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const Verification = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

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
                  : "Submit your documents to get verified"}
              </p>
            </div>
          </div>
        </div>

        {/* Required Documents Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Required Documents</h2>
          <div className="space-y-3">
            {[
              { title: "Government ID", desc: "Passport, Driver's License, or National ID" },
              { title: "Proof of Address", desc: "Utility bill or bank statement" },
              { title: "Professional License", desc: "Trade license or certification" },
            ].map((doc, i) => (
              <div key={i} className="p-4 border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">{doc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Get Verified — Info Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">How to Get Verified</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Verification documents are reviewed by the SafeSight team.
                Please send your ID and professional credentials via one of the channels below.
                Your account will be marked verified within 24–48 hours.
              </p>
            </div>
          </div>

          <div className="space-y-3 pl-1">
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-xl tap-scale"
            >
              <MessageCircle className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium text-sm text-foreground">WhatsApp</p>
                <p className="text-xs text-muted-foreground">+234-800-000-0000</p>
              </div>
            </a>

            <a
              href="mailto:verify@safesight.ng"
              className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-xl tap-scale"
            >
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm text-foreground">Email</p>
                <p className="text-xs text-muted-foreground">verify@safesight.ng</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
