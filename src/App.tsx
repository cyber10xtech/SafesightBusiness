import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CompleteProfile from "./pages/CompleteProfile";
import AccountTypeSelection from "./pages/AccountTypeSelection";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import JobHistory from "./pages/JobHistory";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

// Customer App Pages
import CustomerSignIn from "./pages/customer/CustomerSignIn";
import CustomerRegister from "./pages/customer/CustomerRegister";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerHub from "./pages/customer/CustomerHub";
import CustomerMessages from "./pages/customer/CustomerMessages";
import CustomerChat from "./pages/customer/CustomerChat";
import CustomerAlerts from "./pages/customer/CustomerAlerts";
import CustomerSettings from "./pages/customer/CustomerSettings";
import ProfessionalProfile from "./pages/customer/ProfessionalProfile";
import EditProfile from "./pages/customer/EditProfile";
import PaymentMethods from "./pages/customer/PaymentMethods";
import NotificationSettings from "./pages/customer/NotificationSettings";
import PrivacySecurity from "./pages/customer/PrivacySecurity";
import HelpSupport from "./pages/customer/HelpSupport";
import LiveChatSupport from "./pages/customer/LiveChatSupport";
import InviteFriends from "./pages/customer/InviteFriends";
import TermsPrivacy from "./pages/customer/TermsPrivacy";
import BookingRequest from "./pages/customer/BookingRequest";
import CustomerInstall from "./pages/customer/CustomerInstall";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Welcome / Landing */}
            <Route path="/" element={<Welcome />} />
            
            {/* Business App Routes */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/account-type" element={<AccountTypeSelection />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/job-history" element={<JobHistory />} />
            <Route path="/install" element={<Install />} />
            
            {/* Customer App Routes */}
            <Route path="/customer/sign-in" element={<CustomerSignIn />} />
            <Route path="/customer/register" element={<CustomerRegister />} />
            <Route path="/customer/home" element={<CustomerHome />} />
            <Route path="/customer/hub" element={<CustomerHub />} />
            <Route path="/customer/messages" element={<CustomerMessages />} />
            <Route path="/customer/chat/:id" element={<CustomerChat />} />
            <Route path="/customer/alerts" element={<CustomerAlerts />} />
            <Route path="/customer/settings" element={<CustomerSettings />} />
            <Route path="/customer/professional/:id" element={<ProfessionalProfile />} />
            <Route path="/customer/book/:id" element={<BookingRequest />} />
            <Route path="/customer/settings/edit-profile" element={<EditProfile />} />
            <Route path="/customer/settings/payments" element={<PaymentMethods />} />
            <Route path="/customer/settings/notifications" element={<NotificationSettings />} />
            <Route path="/customer/settings/privacy" element={<PrivacySecurity />} />
            <Route path="/customer/settings/help" element={<HelpSupport />} />
            <Route path="/customer/live-chat" element={<LiveChatSupport />} />
            <Route path="/customer/invite" element={<InviteFriends />} />
            <Route path="/customer/terms" element={<TermsPrivacy />} />
            <Route path="/customer/install" element={<CustomerInstall />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
