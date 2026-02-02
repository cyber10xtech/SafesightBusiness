import { Home, Building2, MessageSquare, Bell, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const CustomerBottomNav = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/customer/home" },
    { icon: Building2, label: "Hub", path: "/customer/hub" },
    { icon: MessageSquare, label: "Messages", path: "/customer/messages" },
    { icon: Bell, label: "Alerts", path: "/customer/alerts", badge: true },
    { icon: Settings, label: "Settings", path: "/customer/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground transition-colors"
            activeClassName="text-primary bg-primary/10"
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default CustomerBottomNav;
