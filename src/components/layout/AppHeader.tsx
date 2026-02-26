import { Bell, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoBusiness from "@/assets/logo-business.jpg";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  notificationCount?: number;
}

const AppHeader = ({ 
  title = "Safesight Business", 
  showBack = false, 
  showNotifications = true,
  notificationCount = 0 
}: AppHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="p-1 tap-scale">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        ) : (
          <img src={logoBusiness} alt="Safesight" className="w-7 h-7 rounded-md object-cover" />
        )}
        <span className="font-bold text-lg text-foreground">{title}</span>
      </div>
      {showNotifications && (
        <button 
          onClick={() => navigate("/notifications")}
          className="relative p-2 tap-scale"
        >
          <Bell className="w-5 h-5 text-muted-foreground transition-transform hover:scale-110" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-[10px] text-white rounded-full flex items-center justify-center animate-scale-in">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      )}
    </header>
  );
};

export default AppHeader;
