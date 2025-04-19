
import React from 'react';

interface ChatHeaderProps {
  title: string;
  description: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title, description }) => {
  return (
    <header>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </header>
  );
};
