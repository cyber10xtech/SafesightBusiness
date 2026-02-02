import { useState } from "react";
import { Search, MoreVertical, Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  delivered: boolean;
  read: boolean;
}

const Messages = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "John Smith",
      lastMessage: "When can you come for the installation?",
      time: "2 min",
      unread: 2,
      online: true,
      delivered: true,
      read: false,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      lastMessage: "Thank you for the excellent work! 👍",
      time: "1 hr",
      unread: 0,
      online: false,
      delivered: true,
      read: true,
    },
    {
      id: "3",
      name: "Mike Davis",
      lastMessage: "Can you send me a quote for the project?",
      time: "3 hr",
      unread: 1,
      online: true,
      delivered: true,
      read: false,
    },
    {
      id: "4",
      name: "TechCorp Ltd",
      lastMessage: "We would like to schedule a meeting to discuss the contract",
      time: "5 hr",
      unread: 0,
      online: false,
      delivered: true,
      read: true,
    },
    {
      id: "5",
      name: "Emily Chen",
      lastMessage: "Is the warranty included?",
      time: "1 day",
      unread: 0,
      online: false,
      delivered: true,
      read: true,
    },
    {
      id: "6",
      name: "David Wilson",
      lastMessage: "I'll confirm the date tomorrow",
      time: "2 days",
      unread: 0,
      online: false,
      delivered: true,
      read: true,
    },
  ];

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

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
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No conversations found</p>
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
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {conversation.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-background rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-medium text-sm truncate ${conversation.unread > 0 ? "text-foreground" : "text-foreground"}`}>
                      {conversation.name}
                    </h3>
                    <span className={`text-xs shrink-0 ${conversation.unread > 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {conversation.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {conversation.delivered && conversation.unread === 0 && (
                      conversation.read ? (
                        <CheckCheck className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Check className="w-4 h-4 text-muted-foreground shrink-0" />
                      )
                    )}
                    <p className={`text-sm truncate ${conversation.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>

                {conversation.unread > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center shrink-0">
                    {conversation.unread}
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
