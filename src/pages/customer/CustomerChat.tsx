import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Paperclip, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  time: string;
}

// Mock data for conversations
const mockConversationData: Record<string, { name: string; initial: string; color: string; messages: Message[] }> = {
  "1": {
    name: "Mike Johnson",
    initial: "M",
    color: "bg-success",
    messages: [
      { id: "1", text: "Hi! I'm interested in your plumbing services.", sender: "user", time: "10:00 AM" },
      { id: "2", text: "Hello! Thanks for reaching out. What do you need help with?", sender: "other", time: "10:05 AM" },
      { id: "3", text: "My kitchen sink is leaking. Can you fix it tomorrow?", sender: "user", time: "10:10 AM" },
      { id: "4", text: "I can come by at 2 PM tomorrow", sender: "other", time: "10:30 AM" },
    ],
  },
  "2": {
    name: "Sarah Williams",
    initial: "S",
    color: "bg-primary",
    messages: [
      { id: "1", text: "Thank you for completing the job!", sender: "user", time: "Yesterday" },
      { id: "2", text: "The job is complete. Please leave a review!", sender: "other", time: "Yesterday" },
    ],
  },
  "3": {
    name: "David Chen",
    initial: "D",
    color: "bg-warning",
    messages: [
      { id: "1", text: "I need some renovation work done", sender: "user", time: "Jan 14" },
      { id: "2", text: "What materials would you like me to use?", sender: "other", time: "Jan 14" },
    ],
  },
};

const CustomerChat = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = id ? mockConversationData[id] : null;
  const [messages, setMessages] = useState<Message[]>(conversation?.messages || []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  if (!conversation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <Avatar className={cn("w-10 h-10", conversation.color)}>
              <AvatarFallback className={cn("text-white font-semibold", conversation.color)}>
                {conversation.initial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-foreground">{conversation.name}</h1>
              <span className="text-xs text-success">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2",
              msg.sender === "user"
                ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                : "mr-auto bg-muted text-foreground rounded-bl-sm"
            )}
          >
            <p className="text-sm">{msg.text}</p>
            <span
              className={cn(
                "text-xs block mt-1",
                msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <Paperclip className="w-5 h-5" />
          </button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-10 bg-muted/50 border border-border rounded-xl"
          />
          <Button type="submit" size="icon" className="rounded-full">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerChat;
