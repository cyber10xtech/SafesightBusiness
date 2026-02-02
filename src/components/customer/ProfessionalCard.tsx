import { Star, MapPin, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfessionalCardProps {
  id: string;
  name: string;
  profession: string;
  location: string;
  lastActive: string;
  rating: number;
  reviewCount: number;
  distance?: string;
  dailyRate: number;
  weeklyRate?: number;
  bio?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isFavorite?: boolean;
  variant?: "compact" | "detailed" | "favorite" | "emergency";
  onView?: () => void;
  onBook?: () => void;
  onCall?: () => void;
  onFavoriteToggle?: () => void;
}

const ProfessionalCard = ({
  id,
  name,
  profession,
  location,
  lastActive,
  rating,
  reviewCount,
  distance,
  dailyRate,
  weeklyRate,
  bio,
  avatarUrl,
  isVerified = true,
  isFavorite = false,
  variant = "compact",
  onView,
  onBook,
  onCall,
  onFavoriteToggle,
}: ProfessionalCardProps) => {
  const isEmergency = variant === "emergency";

  return (
    <div className={cn(
      "bg-card rounded-xl p-4 border border-border",
      isEmergency && "border-l-4 border-l-destructive"
    )}>
      <div className="flex gap-3">
        <Avatar className="w-14 h-14 rounded-lg">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="rounded-lg bg-muted">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-foreground truncate">{name}</h3>
                {isVerified && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] text-primary-foreground">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{profession}</p>
            </div>

            <div className="text-right flex-shrink-0">
              {variant === "favorite" && (
                <button onClick={onFavoriteToggle} className="mb-1">
                  <Heart className={cn(
                    "w-5 h-5",
                    isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
                  )} />
                </button>
              )}
              <div className="text-primary font-semibold">$ {dailyRate}</div>
              {weeklyRate && variant === "detailed" && (
                <div className="text-xs text-muted-foreground">${weeklyRate}/week</div>
              )}
              {isEmergency && (
                <Badge variant="outline" className="text-success border-success text-xs">
                  Available
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 text-destructive" />
            <span className="truncate">{location}, {lastActive}</span>
          </div>

          {bio && variant === "detailed" && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{bio}</p>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="font-medium text-sm">{rating}</span>
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
              </div>
              {distance && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{distance}</span>
                </>
              )}
              {isEmergency && (
                <>
                  <Clock className="w-3 h-3 text-muted-foreground ml-1" />
                  <span className="text-xs text-muted-foreground">{lastActive}</span>
                </>
              )}
            </div>

            {variant === "compact" && (
              <Button size="sm" onClick={onView} className="h-7 px-4 text-xs">
                View
              </Button>
            )}

            {variant === "detailed" && (
              <Button size="sm" onClick={onView} className="h-7 px-4 text-xs">
                View
              </Button>
            )}

            {variant === "favorite" && (
              <Button size="sm" onClick={onBook} className="h-7 px-4 text-xs">
                Book
              </Button>
            )}
          </div>

          {isEmergency && (
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="flex-1 h-8" onClick={onView}>
                View Profile
              </Button>
              <Button size="sm" className="flex-1 h-8 bg-destructive hover:bg-destructive/90" onClick={onCall}>
                📞 Call Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
