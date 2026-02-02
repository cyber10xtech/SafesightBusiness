import { Home, Calendar, MessageSquare, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground transition-colors"
            activeClassName="text-primary bg-primary/10"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
