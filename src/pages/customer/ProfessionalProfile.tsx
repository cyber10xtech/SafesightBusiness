import { useState } from "react";
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Star, 
  MapPin, 
  Clock, 
  Calendar,
  Briefcase,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import { cn } from "@/lib/utils";

const mockProfessional = {
  id: "2",
  name: "Robert Wilson",
  profession: "Builder",
  accountType: "Professional",
  location: "Eastside",
  lastActive: "1 hour ago",
  currentProject: "Residential Project",
  rating: 4.9,
  reviewCount: 189,
  phone: "+1 (555) 103-0003",
  whatsapp: "+15551030003",
  bio: "Master builder with extensive experience in residential and commercial construction. Specialized in custom homes and renovation projects.",
  experience: "20+ years",
  dailyRate: 150,
  weeklyRate: 1050,
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  reviews: [],
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const professional = mockProfessional; // In real app, fetch by id

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Avatar className="w-20 h-20 rounded-xl">
                <AvatarImage src={professional.avatarUrl} alt={professional.name} />
                <AvatarFallback className="rounded-xl bg-muted text-xl">
                  {professional.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">{professional.name}</h1>
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground">{professional.profession}</p>
                <Badge variant="outline" className="text-success border-success mt-1">
                  {professional.accountType}
                </Badge>
                
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3 text-destructive" />
                  <span>{professional.currentProject}, {professional.lastActive}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="font-semibold">{professional.rating}</span>
                  <span className="text-sm text-muted-foreground">({professional.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{professional.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Button 
                className="flex-1 gap-2"
                onClick={() => window.location.href = `tel:${professional.phone}`}
              >
                <Phone className="w-4 h-4" />
                Call
              </Button>
              <Button 
                variant="default"
                className="flex-1 gap-2 bg-success hover:bg-success/90"
                onClick={() => window.location.href = `https://wa.me/${professional.whatsapp.replace(/\D/g, '')}`}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-semibold text-foreground mb-3">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{professional.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WhatsApp</span>
                <span className="font-medium">{professional.whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{professional.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-semibold text-foreground mb-3">About</h2>
            <p className="text-muted-foreground mb-3">{professional.bio}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span>Experience: {professional.experience}</span>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-semibold text-foreground mb-3">Pricing</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Daily Rate</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  $ {professional.dailyRate}
                  <span className="text-sm font-normal text-muted-foreground">/hour</span>
                </div>
              </div>
              <div className="bg-success/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-success mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Contract Rate</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  $ {professional.weeklyRate}
                  <span className="text-sm font-normal text-muted-foreground">/week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-semibold text-foreground mb-3">Availability</h2>
            <div className="flex gap-2 flex-wrap">
              {daysOfWeek.map((day) => (
                <Badge
                  key={day}
                  variant={professional.availability.includes(day) ? "default" : "secondary"}
                  className={cn(
                    "px-3 py-1",
                    professional.availability.includes(day) 
                      ? "bg-primary/10 text-primary border-primary/20" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {day}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Reviews</h2>
              <Button variant="link" className="text-primary p-0 h-auto">
                Write a Review
              </Button>
            </div>
            {professional.reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No reviews yet</p>
            ) : (
              <div className="space-y-3">
                {/* Reviews would be mapped here */}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Book Button */}
        <Button 
          className="w-full h-12 text-lg font-semibold"
          onClick={() => console.log("Book", professional.name)}
        >
          Book {professional.name}
        </Button>
      </div>

      <CustomerBottomNav />
    </div>
  );
};

export default ProfessionalProfile;
