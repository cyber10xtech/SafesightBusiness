import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CustomerBottomNav from "@/components/layout/CustomerBottomNav";
import { cn } from "@/lib/utils";

const mockConversations = [
  {
    id: "1",
    name: "Mike Johnson",
    initial: "M",
    color: "bg-success",
    lastMessage: "I can come by at 2 PM tomorrow",
    time: "10:30 AM",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Sarah Williams",
    initial: "S",
    color: "bg-primary",
    lastMessage: "The job is complete. Please leave a review!",
    time: "Yesterday",
    unreadCount: 0,
  },
  {
    id: "3",
    name: "David Chen",
    initial: "D",
    color: "bg-warning",
    lastMessage: "What materials would you like me to use?",
    time: "Jan 14",
    unreadCount: 1,
  },
];

const CustomerMessages = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Messages</h1>

        <div className="divide-y divide-border">
          {mockConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => navigate(`/customer/chat/${conversation.id}`)}
              className="w-full flex items-center gap-3 py-4 hover:bg-muted/50 transition-colors"
            >
              <Avatar className={cn("w-12 h-12", conversation.color)}>
                <AvatarFallback className={cn("text-white font-semibold", conversation.color)}>
                  {conversation.initial}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground truncate">
                    {conversation.name}
                  </h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {conversation.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
              </div>

              {conversation.unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {conversation.unreadCount}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {mockConversations.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No messages yet</p>
        )}
      </div>
      <CustomerBottomNav />
    </div>
  );
};

export default CustomerMessages;
