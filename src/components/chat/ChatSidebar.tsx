
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, SearchIcon, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface ChatSession {
  id: string;
  type: string;
  lastMessage: string;
  lastMessageTime: Date;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ sessions, activeTab, onTabChange }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="px-4 py-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-8" />
        </div>
      </CardHeader>

      <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
        <div className="px-2">
          <TabsList className="grid w-full grid-cols-3 mb-0">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/90 cursor-pointer"
              >
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${session.id}`} />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{session.type}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(session.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {session.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="journal" className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/90 cursor-pointer">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=2" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">Journal Session</p>
                  <span className="text-xs text-muted-foreground">Yesterday</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  Tell me about your day...
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wellbeing" className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/90 cursor-pointer">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=3" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">Mental Wellbeing</p>
                  <span className="text-xs text-muted-foreground">2d ago</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  Let's work through some stress relief techniques
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CardFooter className="px-4 py-3 border-t border-border/40">
        <Button className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </CardFooter>
    </Card>
  );
};
