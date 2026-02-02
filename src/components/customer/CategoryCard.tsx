import { cn } from "@/lib/utils";
import { 
  Building2, 
  Users, 
  Hammer, 
  Palette, 
  Zap, 
  Building,
  Wrench,
  Paintbrush,
  Droplets,
  TreePine,
  Wind,
  Shield
} from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  architect: Building2,
  "project-manager": Users,
  builder: Hammer,
  "interior-designer": Palette,
  "electrical-engineer": Zap,
  "structural-engineer": Building,
  plumber: Droplets,
  electrician: Zap,
  carpenter: Wrench,
  painter: Paintbrush,
  landscaper: TreePine,
  hvac: Wind,
  security: Shield,
};

const CategoryCard = ({ name, icon, onClick, isSelected }: CategoryCardProps) => {
  const IconComponent = iconMap[icon.toLowerCase()] || Building2;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card transition-all",
        "hover:border-primary hover:bg-primary/5",
        isSelected && "border-primary bg-primary/10"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center mb-2",
        isSelected ? "bg-primary/20" : "bg-muted"
      )}>
        <IconComponent className={cn(
          "w-5 h-5",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} />
      </div>
      <span className="text-xs font-medium text-center text-foreground">{name}</span>
    </button>
  );
};

export default CategoryCard;
