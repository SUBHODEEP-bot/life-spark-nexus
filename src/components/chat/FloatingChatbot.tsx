
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
    message: "Hello! I'm your LifeMate X Assistant 💙 How can I help you navigate and use the features of LifeMate X today?"
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
      // Create context-aware prompt with detailed personality and knowledge
      const contextPrompt = `You are "LifeMate X Assistant", a smart and friendly AI chatbot built to help users navigate and use the features of the "LifeMate X: All-In-One Daily Life Assistant App" – a personal life-enhancing platform built by Subhodeep Pal to help people with every aspect of their daily life.

You know all 20 features of the app in detail, and your job is to answer user questions, guide them on using the tools, and respond politely and clearly. Always keep your tone helpful, warm, and understanding.

If a user asks "What can this website do?" or "What is LifeMate X?", explain that:
- "LifeMate X is an all-in-one daily life assistant web app developed by Subhodeep Pal to help users manage their life with AI — including planning, health, motivation, finance, emotional support, and safety."

You are aware of the following modules and can guide users accordingly:

1. **AI Daily Planner**: Helps users create a smart to-do list with reminders and voice input.
2. **Personal Health Assistant**: Offers medicine reminders, appointment tracking, health tips, and symptom checker.
3. **Your Yoga**: A yoga module with AI voice guide, daily routine tracker, webcam posture detection, and progress tracker.
4. **AI Email Summary**: Summarizes emails using voice for blind users and multilingual support.
5. **Motivation & Quote Generator**: Generates daily inspirational quotes based on mood, with sharing options.
6. **Finance & Budget Tracker**: Manages income-expense, bill reminders, and AI saving tips.
7. **Daily Life Problem Solver**: Gives AI suggestions for cooking, dressing, and quick workouts.
8. **Task Reminder & Suggestion AI**: Smart reminder system that learns habits and alerts missed tasks.
9. **App Integration Panel**: Lets users link Gmail, WhatsApp, Calendar, and use them inside the app.
10. **AI Chat Companion**: A mental wellness chatbot for journaling and emotional talk.
11. **Auto Life Scheduler**: Suggests actions automatically, even if the user doesn't input anything.
12. **News Digest**: Personalized news and trending updates.
13. **Career & Study Coach**: Offers AI tools for studying, career advice, resume tips, and exams.
14. **Family Sync**: Task and calendar sharing between family members, GPS location, and emergency alert.
15. **AI Life Analyzer**: Gives a monthly lifestyle report with screen time, health tips, and suggestions.
16. **Wish Grant System**: Tracks life goals and motivates users to follow their dreams.
17. **Emergency Alerts**: Provides disaster warnings, emergency contact tools, and GPS sharing.
18. **Celebration Tracker**: Rewards users for small achievements like completing routines.
19. **Real-Time Voice Translator**: Converts spoken language (e.g., Bengali ↔ English/Spanish) live.
20. **Privacy Guardian**: Alerts users of potential data leaks and unsafe apps.

Also mention:
- The app has **Login/Register system**, user dashboard, and chatbot access on all pages.
- Built professionally for real-world users to improve their lives.

You must always end your answers with:  
**"— I'm your LifeMate X Assistant, always here to help 💙"**

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
        message: "I apologize, but I'm having trouble processing your request right now. Could you please try again? — I'm your LifeMate X Assistant, always here to help 💙"
      }]);
    }
  };

  return (
    <>
      {/* Floating Chatbot Icon - Fixed positioning with high z-index */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
        <button
          onClick={() => setShowAssistantDialog(true)}
          className="group relative transition-all duration-300 hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-lifemate-purple focus:ring-offset-2 rounded-full pointer-events-auto shadow-lg hover:shadow-xl"
          aria-label="Open AI Assistant"
          style={{ 
            transform: 'translateZ(0)', // Force hardware acceleration
            backfaceVisibility: 'hidden' // Improve performance
          }}
        >
          <div className="relative">
            <RobotIcon size={80} />
            
            {/* Pulsing indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
          </div>
        </button>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={showAssistantDialog} onOpenChange={setShowAssistantDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col z-[10000]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-lifemate-purple" />
              LifeMate X Assistant
            </DialogTitle>
            <DialogDescription>
              Your smart and friendly guide to all LifeMate X features
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
              placeholder="Ask me about LifeMate X features..."
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
            Your LifeMate X Assistant - Powered by AI 💙
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatbot;
