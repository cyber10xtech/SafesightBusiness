import { Shield, Bell, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        ) : (
          <Shield className="w-6 h-6 text-primary" />
        )}
        <span className="font-bold text-lg text-foreground">{title}</span>
      </div>
      {showNotifications && (
        <button 
          onClick={() => navigate("/notifications")}
          className="relative p-2"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-success text-[10px] text-white rounded-full flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      )}
    </header>
  );
};

export default AppHeader;
