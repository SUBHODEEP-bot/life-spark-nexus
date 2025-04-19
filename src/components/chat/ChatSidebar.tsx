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
  return;
};