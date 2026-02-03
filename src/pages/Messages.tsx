import { useState, useEffect } from "react";
import { Search, MessageSquare, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

interface Conversation {
  id: string;
  customer_id: string;
  professional_id: string;
  last_message_at: string | null;
  created_at: string;
  customer?: {
    full_name: string;
    avatar_url: string | null;
  };
  lastMessage?: string;
  unreadCount?: number;
}

const Messages = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!profile?.id) return;

      try {
        const { data, error } = await supabase
          .from("conversations")
          .select(`
            *,
            customer:customer_profiles(full_name, avatar_url)
          `)
          .eq("professional_id", profile.id)
          .order("last_message_at", { ascending: false });

        if (error) throw error;

        // Fetch last message for each conversation
        const conversationsWithMessages = await Promise.all(
          (data || []).map(async (conv) => {
            const { data: messages } = await supabase
              .from("messages")
              .select("content, read_at")
              .eq("conversation_id", conv.id)
              .order("created_at", { ascending: false })
              .limit(1);

            const { count } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("conversation_id", conv.id)
              .is("read_at", null)
              .neq("sender_id", profile.id);

            return {
              ...conv,
              lastMessage: messages?.[0]?.content || "No messages yet",
              unreadCount: count || 0,
            };
          })
        );

        setConversations(conversationsWithMessages);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Error fetching conversations:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) {
      fetchConversations();
    } else {
      setLoading(false);
    }
  }, [profile?.id]);

  const filteredConversations = conversations.filter(c =>
    c.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours} hr`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Messages" notificationCount={totalUnread} />

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Messages from customers will appear here
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => navigate(`/chat/${conversation.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.customer?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {conversation.customer?.full_name?.split(" ").map(n => n[0]).join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-medium text-sm truncate ${(conversation.unreadCount || 0) > 0 ? "text-foreground" : "text-foreground"}`}>
                      {conversation.customer?.full_name || "Customer"}
                    </h3>
                    <span className={`text-xs shrink-0 ${(conversation.unreadCount || 0) > 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {formatTime(conversation.last_message_at)}
                    </span>
                  </div>
                  <p className={`text-sm truncate mt-0.5 ${(conversation.unreadCount || 0) > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {conversation.lastMessage}
                  </p>
                </div>

                {(conversation.unreadCount || 0) > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center shrink-0">
                    {conversation.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Messages;
