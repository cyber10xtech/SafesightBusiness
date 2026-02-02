import { useState } from "react";
import { Wrench, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const CustomerSignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to sign in");
      return;
    }

    toast.success("Welcome back!");
    navigate("/customer/home");
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">HandyConnect</h1>
          <p className="text-muted-foreground mt-1">Find trusted professionals near you</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-muted/50 border border-border rounded-xl"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-muted/50 border border-border rounded-xl"
              disabled={loading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-lg font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/customer/register")}
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 w-full mt-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );
};

export default CustomerSignIn;
