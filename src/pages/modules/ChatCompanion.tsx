
import { useState, useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateOpenAIResponse } from "@/utils/aiHelpers";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatOptions } from "@/components/chat/ChatOptions";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  type: string;
  lastMessage: string;
  lastMessageTime: Date;
}

const ChatCompanion = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Chat Companion powered by Google's Gemini. How can I help you today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);

  const [sessions] = useState<ChatSession[]>([
    {
      id: "1",
      type: "General Chat",
      lastMessage: "How can I help you today?",
      lastMessageTime: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      type: "Journal Session",
      lastMessage: "Tell me about your day...",
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60000),
    },
    {
      id: "3",
      type: "Mental Wellbeing",
      lastMessage: "Let's work through some stress relief techniques",
      lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60000),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [apiStatus, setApiStatus] = useState<'ready' | 'error'>('ready');
  const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");

    const { id } = toast({
      title: "Processing your message",
      description: "The AI is thinking...",
    });

    try {
      const aiResponse = await generateOpenAIResponse(inputValue);
      
      if (aiResponse.error) {
        toast({
          title: "Error",
          description: aiResponse.error,
          variant: "destructive",
        });
        
        if (aiResponse.error.includes("quota")) {
          setApiStatus('error');
          setApiErrorMessage("API quota exceeded. Please check your OpenAI billing details.");
        }
        
        // Still add the error message as an AI response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.text,
          sender: "ai",
          timestamp: new Date(),
        };
        
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        return;
      }

      setApiStatus('ready');
      setApiErrorMessage(undefined);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.text,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      });
      
      setApiStatus('error');
      setApiErrorMessage("Failed to connect to OpenAI API. Please try again later.");
    } finally {
      toast.dismiss(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="container max-w-6xl mx-auto space-y-8">
      <ChatHeader 
        title="AI Chat Companion (Gemini)" 
        description="Talk about your day, feelings, or anything on your mind"
        apiStatus={apiStatus}
        errorMessage={apiErrorMessage}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <ChatSidebar
          sessions={sessions}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1">
          <ChatMessages
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            onKeyDown={handleKeyDown}
          />
        </div>

        <ChatOptions />
      </div>
    </div>
  );
};

export default ChatCompanion;
