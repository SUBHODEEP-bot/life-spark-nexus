import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, User, SendHorizontal, Paperclip, Smile } from "lucide-react";
interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}
interface ChatMessagesProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyDown
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <Card className="h-[600px] flex flex-col">
      <CardHeader className="px-6 py-4 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=companion" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">AI Companion</h2>
            <p className="text-sm text-muted-foreground">Online now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          
          
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(message => <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-lifemate-purple text-white" : "bg-secondary"}`}>
                <p>{message.content}</p>
                <div className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>)}
        </div>
      </div>

      <CardFooter className="p-4 border-t border-border/40">
        <div className="flex items-center gap-2 w-full">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input placeholder="Type your message..." value={inputValue} onChange={e => onInputChange(e.target.value)} onKeyDown={onKeyDown} className="flex-1" />
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Button onClick={onSendMessage} disabled={!inputValue.trim()}>
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>;
};