
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { generateGeminiResponse } from "@/utils/geminiHelpers";
import RobotIcon from './RobotIcon';

const FloatingChatbot = () => {
  const [showAssistantDialog, setShowAssistantDialog] = useState(false);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{
    role: string;
    message: string;
  }[]>([{
    role: "assistant",
    message: "Hello! I'm your AI Assistant. How can I help you with LifeMate X today?"
  }]);

  const handleSendMessage = async () => {
    if (!userQuery.trim()) return;

    // Add user message to chat history
    const newChatHistory = [...chatHistory, {
      role: "user",
      message: userQuery
    }];
    setChatHistory(newChatHistory);

    // Reset input field
    const currentQuery = userQuery;
    setUserQuery("");

    // Show typing indicator
    setAssistantTyping(true);

    try {
      // Create context-aware prompt
      const contextPrompt = `You are an AI assistant for LifeMate X, a comprehensive life management platform with 21 modules including Daily Planner, Health Assistant, Yoga, Email Summary, Finance Tracker, and more. 

User question: ${currentQuery}

Please provide a helpful, informative response about LifeMate X features, functionality, or general assistance. Keep responses concise and friendly.`;

      const response = await generateGeminiResponse(contextPrompt);
      
      setAssistantTyping(false);
      setChatHistory(prev => [...prev, {
        role: "assistant",
        message: response.text
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAssistantTyping(false);
      setChatHistory(prev => [...prev, {
        role: "assistant",
        message: "I apologize, but I'm having trouble processing your request right now. Could you please try again?"
      }]);
    }
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowAssistantDialog(true)}
          className="group relative transition-all duration-300 hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-lifemate-purple focus:ring-offset-2 rounded-full"
          aria-label="Open AI Assistant"
        >
          <div className="animate-pulse-slow">
            <RobotIcon size={80} />
          </div>
          
          {/* Floating animation dots */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full"></div>
        </button>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={showAssistantDialog} onOpenChange={setShowAssistantDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col dropdown-content">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-lifemate-purple" />
              LifeMate X AI Assistant
            </DialogTitle>
            <DialogDescription>
              Ask me anything about LifeMate X features and functionality
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[50vh]">
            {chatHistory.map((item, index) => (
              <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  item.role === 'user' 
                    ? 'bg-lifemate-purple text-white' 
                    : 'bg-secondary/70'
                }`}>
                  {item.message}
                </div>
              </div>
            ))}
            
            {assistantTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-secondary/70 rounded-lg p-3 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask me about LifeMate X..."
              className="flex-1 p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-lifemate-purple"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={assistantTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!userQuery.trim() || assistantTyping}
            >
              Send
            </Button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mt-2">
            Powered by Gemini AI - Ask me anything about LifeMate X!
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatbot;
