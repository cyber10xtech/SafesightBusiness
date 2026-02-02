import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, AlertCircle, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import ProfessionalCard from "@/components/customer/ProfessionalCard";
import CategoryCard from "@/components/customer/CategoryCard";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Architect", icon: "architect" },
  { name: "Project Manager", icon: "project-manager" },
  { name: "Builder", icon: "builder" },
  { name: "Interior Designer", icon: "interior-designer" },
  { name: "Electrical Engineer", icon: "electrical-engineer" },
  { name: "Structural Engineer", icon: "structural-engineer" },
];

const mockProfessionals = [
  {
    id: "1",
    name: "James Anderson",
    profession: "Architect",
    location: "City Center",
    lastActive: "2 hours ago",
    rating: 4.9,
    reviewCount: 156,
    distance: "1.2 mi",
    dailyRate: 200,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Robert Wilson",
    profession: "Builder",
    location: "Residential Project",
    lastActive: "1 hour ago",
    rating: 4.9,
    reviewCount: 189,
    distance: "2.5 mi",
    dailyRate: 150,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Sarah Mitchell",
    profession: "Interior Designer",
    location: "Design Studio",
    lastActive: "45 min ago",
    rating: 4.9,
    reviewCount: 224,
    distance: "1.5 mi",
    dailyRate: 120,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "Jennifer Martinez",
    profession: "Structural Engineer",
    location: "Engineering Office",
    lastActive: "1 hour ago",
    rating: 4.9,
    reviewCount: 145,
    distance: "0.9 mi",
    dailyRate: 175,
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    name: "Sarah Williams",
    profession: "Electrician",
    location: "Hardware Store",
    lastActive: "45 min ago",
    rating: 4.9,
    reviewCount: 203,
    distance: "1.2 mi",
    dailyRate: 75,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  },
  {
    id: "6",
    name: "Michael Thompson",
    profession: "Project Manager",
    location: "Construction Site A",
    lastActive: "30 min ago",
    rating: 4.8,
    reviewCount: 203,
    distance: "0.8 mi",
    dailyRate: 180,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
];

const CustomerHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "professionals" | "handymen">("all");
  const [sortBy, setSortBy] = useState("Top Rated");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Find a Professional</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-muted/50 border-0 rounded-xl"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {(["all", "professionals", "handymen"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="capitalize rounded-full"
            >
              {tab === "all" ? "All" : tab}
            </Button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" className="gap-1">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            {sortBy}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Urgent Help Banner */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Need Urgent Help?</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Emergency services available 24/7 for urgent repairs
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/customer/hub?tab=emergency")}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Get Emergency Help
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="font-semibold text-foreground mb-3">All Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {displayedCategories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                icon={category.icon}
                onClick={() => console.log("Category:", category.name)}
              />
            ))}
          </div>
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="w-full text-center text-primary text-sm font-medium mt-3 hover:underline"
          >
            {showAllCategories ? "Show Less" : `Show All Categories (22)`}
          </button>
        </div>

        {/* Top Rated Professionals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Top Rated Professionals</h2>
            <Badge variant="secondary" className="text-xs">
              {mockProfessionals.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {mockProfessionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                {...professional}
                variant="compact"
                onView={() => navigate(`/customer/professional/${professional.id}`)}
              />
            ))}
          </div>
        </div>
      </div>

      <CustomerBottomNav />
    </div>
  );
};

export default CustomerHome;
