import { useState } from "react";
import { ArrowLeft, Search, MessageCircle, Mail, Phone, HelpCircle, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const contactOptions = [
  { icon: MessageCircle, label: "Live Chat", color: "bg-primary/10 text-primary" },
  { icon: Mail, label: "Email", color: "bg-success/10 text-success" },
  { icon: Phone, label: "Call", color: "bg-purple/10 text-purple" },
];

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      "How do I book a handyman?",
      "How do I create an account?",
      "What payment methods are accepted?",
    ],
  },
  {
    title: "Bookings & Scheduling",
    questions: [
      "Can I reschedule a booking?",
      "What if I need to cancel?",
      "How do I track my booking?",
    ],
  },
  {
    title: "Payments & Pricing",
    questions: [
      "What is the difference between daily and contract rates?",
      "When am I charged?",
      "Are there any hidden fees?",
    ],
  },
  {
    title: "Safety & Trust",
    questions: [
      "Are handymen verified?",
      "What if I'm not satisfied with the work?",
      "How do I report a problem?",
    ],
  },
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Getting Started");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Help & Support</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-muted/50 border border-border rounded-xl"
          />
        </div>

        {/* Contact Us */}
        <h2 className="font-semibold text-foreground mb-3">Contact Us</h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {contactOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.label}
                className="bg-card rounded-xl p-4 border border-border hover:bg-muted/50 transition-colors flex flex-col items-center gap-2"
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", option.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ */}
        <h2 className="font-semibold text-foreground mb-3">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqCategories.map((category) => (
            <div key={category.title} className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedCategory(
                  expandedCategory === category.title ? null : category.title
                )}
                className="w-full px-4 py-3 bg-muted/30 flex items-center justify-between"
              >
                <span className="font-medium text-foreground">{category.title}</span>
                <ChevronRight className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  expandedCategory === category.title && "rotate-90"
                )} />
              </button>
              
              {expandedCategory === category.title && (
                <div className="divide-y divide-border">
                  {category.questions.map((question, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground">{question}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
