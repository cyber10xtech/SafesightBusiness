import { Home, Calendar, MessageSquare, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNotifications } from "@/hooks/useNotifications";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const BottomNav = () => {
  const { unreadCount: notifUnread } = useNotifications("professional");
  const { profile } = useProfile();
  const [chatUnread, setChatUnread] = useState(0);

  useEffect(() => {
    const fetchChatUnread = async () => {
      if (!profile?.id) return;
      const { data: convos } = await supabase
        .from("conversations").select("id").eq("professional_id", profile.id);
      if (!convos?.length) return;

      let total = 0;
      await Promise.all(
        convos.map(async (c) => {
          const { count } = await supabase
            .from("messages").select("*", { count: "exact", head: true })
            .eq("conversation_id", c.id).is("read_at", null).neq("sender_id", profile.id);
          total += count || 0;
        })
      );
      setChatUnread(total);
    };
    fetchChatUnread();
  }, [profile?.id]);

  const messageBadge = chatUnread + notifUnread;

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard", badge: 0 },
    { icon: Calendar, label: "Bookings", path: "/bookings", badge: 0 },
    { icon: MessageSquare, label: "Messages", path: "/messages", badge: messageBadge },
    { icon: User, label: "Profile", path: "/profile", badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-2 py-2 z-50 safe-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground transition-all duration-200 tap-scale"
            activeClassName="text-primary bg-primary/10"
          >
            <div className="relative">
              <item.icon className="w-5 h-5 transition-transform duration-200" />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-destructive text-[9px] text-white rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
