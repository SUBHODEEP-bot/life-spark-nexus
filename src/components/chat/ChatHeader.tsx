
import React from 'react';

interface ChatHeaderProps {
  title: string;
  description: string;
  apiStatus?: 'ready' | 'error';
  errorMessage?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title, 
  description, 
  apiStatus,
  errorMessage
}) => {
  return (
    <header>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {apiStatus === 'error' && errorMessage && (
        <div className="mt-2 p-2 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
          <strong>API Error:</strong> {errorMessage}
        </div>
      )}
    </header>
  );
};
