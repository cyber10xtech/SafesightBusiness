import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsPrivacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Terms & Privacy Policy</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Privacy Policy */}
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <h2 className="font-semibold text-lg text-foreground mb-4">Privacy Policy</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">1. Information We Collect</h3>
              <p className="mb-2">We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Name, email address, and phone number</li>
                <li>Location and address information</li>
                <li>Payment information (processed securely)</li>
                <li>Booking and service history</li>
                <li>Reviews and ratings</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">2. How We Use Your Information</h3>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your bookings and payments</li>
                <li>Send you notifications and updates</li>
                <li>Connect you with service professionals</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">3. Information Sharing</h3>
              <p className="mb-2">We do not sell your personal information. We share your information only with:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Service professionals you book through our platform</li>
                <li>Service providers who assist in our operations</li>
                <li>When required by law or to protect our rights</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">4. Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">5. Your Rights</h3>
              <p>
                You have the right to access, update, or delete your personal information at any time. Contact us if you wish to exercise these rights.
              </p>
            </div>
          </div>
        </div>

        {/* Terms of Service */}
        <div className="bg-card rounded-xl border border-border p-4 mb-4">
          <h2 className="font-semibold text-lg text-foreground mb-4">Terms of Service</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing and using HandyConnect, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">2. Service Description</h3>
              <p>
                HandyConnect is a platform that connects users with local service professionals. We facilitate bookings but are not responsible for the actual services performed by professionals.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">3. User Responsibilities</h3>
              <p className="mb-2">You agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide accurate information</li>
                <li>Maintain the security of your account</li>
                <li>Pay for services as agreed</li>
                <li>Treat professionals with respect</li>
                <li>Comply with all applicable laws</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">4. Payments and Refunds</h3>
              <p>
                All payments are processed securely. Cancellation policies vary by professional. Refunds are provided according to our cancellation policy, typically requiring 24 hours notice.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">5. Liability Limitations</h3>
              <p>
                HandyConnect acts as a platform and is not liable for disputes between users and professionals. We encourage users to resolve issues directly and will assist when possible.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">6. Termination</h3>
              <p>
                We reserve the right to terminate or suspend accounts that violate these terms or engage in fraudulent or inappropriate behavior.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold text-foreground mb-3">Questions?</h2>
          <p className="text-sm text-muted-foreground mb-3">
            If you have any questions about our Terms or Privacy Policy, please contact us:
          </p>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium text-foreground">Email:</span> <span className="text-muted-foreground">legal@handyconnect.app</span></p>
            <p><span className="font-medium text-foreground">Phone:</span> <span className="text-muted-foreground">+1 (555) 123-4567</span></p>
            <p><span className="font-medium text-foreground">Support:</span> <span className="text-muted-foreground">support@handyconnect.app</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacy;
