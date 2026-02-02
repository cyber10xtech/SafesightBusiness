import { useState } from "react";
import { useParams } from "react-router-dom";
import { Send, Paperclip, Image, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/layout/AppHeader";

interface Message {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  read: boolean;
}

const Chat = () => {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");

  // Mock contact data
  const contact = {
    id,
    name: "John Smith",
    status: "Online",
    avatar: undefined,
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I saw your profile and I'm interested in your electrical services.",
      sent: false,
      time: "10:30 AM",
      read: true,
    },
    {
      id: "2",
      text: "Hi John! Thank you for reaching out. I'd be happy to help. What kind of work do you need done?",
      sent: true,
      time: "10:32 AM",
      read: true,
    },
    {
      id: "3",
      text: "I need a complete rewiring of my 3-bedroom apartment. The current wiring is old and causing issues.",
      sent: false,
      time: "10:35 AM",
      read: true,
    },
    {
      id: "4",
      text: "I understand. For a complete rewiring job, I would need to assess the property first. When would be a good time for me to come take a look?",
      sent: true,
      time: "10:38 AM",
      read: true,
    },
    {
      id: "5",
      text: "When can you come for the installation?",
      sent: false,
      time: "10:45 AM",
      read: false,
    },
  ]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Custom Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => window.history.back()} className="p-1">
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={contact.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {contact.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-background rounded-full" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">{contact.name}</h1>
            <p className="text-xs text-success">{contact.status}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Phone className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Video className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sent ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.sent
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card border border-border rounded-bl-sm"
              }`}
            >
              <p className={`text-sm ${message.sent ? "text-primary-foreground" : "text-foreground"}`}>
                {message.text}
              </p>
              <p className={`text-[10px] mt-1 text-right ${message.sent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <Image className="w-5 h-5 text-muted-foreground" />
          </button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
