
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, SearchIcon, MessageSquare, Plus } from "lucide-react";
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

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeTab,
  onTabChange
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-full flex flex-col border-r border-border/30">
      <div className="p-4 border-b border-border/30">
        <h2 className="text-lg font-semibold mb-4 font-poppins gradient-text">Chat Sessions</h2>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="text"
            placeholder="Search conversations..."
            className="pl-10 pr-4 py-2 bg-secondary/50 border-border/30"
          />
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange}
        className="flex-1 flex flex-col"
      >
        <div className="px-2 pt-2 border-b border-border/30">
          <TabsList className="w-full bg-secondary/50">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="personal" className="flex-1">Personal</TabsTrigger>
            <TabsTrigger value="work" className="flex-1">Work</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <TabsContent value="all" className="m-0 space-y-2">
            {sessions.map((session) => (
              <Card 
                key={session.id} 
                className="bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer"
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-lifemate-purple/30">
                      <AvatarImage src={`/avatars/${session.id}.png`} />
                      <AvatarFallback className="bg-lifemate-purple/20 text-lifemate-purple">
                        {session.type === "personal" ? "P" : "W"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate text-sm">Chat {session.id}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(session.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.lastMessage}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="personal" className="m-0 space-y-2">
            {sessions
              .filter(session => session.type === "personal")
              .map((session) => (
                <Card 
                  key={session.id} 
                  className="bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-lifemate-purple/30">
                        <AvatarImage src={`/avatars/${session.id}.png`} />
                        <AvatarFallback className="bg-lifemate-purple/20 text-lifemate-purple">
                          P
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate text-sm">Chat {session.id}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(session.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.lastMessage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </TabsContent>

          <TabsContent value="work" className="m-0 space-y-2">
            {sessions
              .filter(session => session.type === "work")
              .map((session) => (
                <Card 
                  key={session.id} 
                  className="bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-lifemate-purple/30">
                        <AvatarImage src={`/avatars/${session.id}.png`} />
                        <AvatarFallback className="bg-lifemate-purple/20 text-lifemate-purple">
                          W
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate text-sm">Chat {session.id}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(session.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.lastMessage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </TabsContent>
        </div>
      </Tabs>

      <div className="p-3 border-t border-border/30">
        <Button className="w-full bg-lifemate-purple hover:bg-lifemate-purple-dark shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
    </div>
  );
};
