import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Smile, Paperclip, MessageSquare, MoreVertical, SearchIcon, Phone, Video, User, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateGeminiResponse } from "@/utils/aiHelpers";

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
      content: "Hello! I'm your AI Chat Companion. How can I help you today?",
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

    // Show loading toast
    const loadingToastId = toast({
      title: "Processing your message",
      description: "The AI is thinking...",
    });

    try {
      const aiResponse = await generateGeminiResponse(inputValue);
      
      if (aiResponse.error) {
        toast({
          title: "Error",
          description: aiResponse.error,
          variant: "destructive",
        });
        return;
      }

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
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Chat Companion</h1>
        <p className="text-muted-foreground">
          Talk about your day, feelings, or anything on your mind
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with chat sessions */}
        <div className="w-full md:w-64">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="px-4 py-3 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-8" />
              </div>
            </CardHeader>

            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
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
                        <span className="text-xs text-muted-foreground">
                          Yesterday
                        </span>
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
                        <span className="text-xs text-muted-foreground">
                          2d ago
                        </span>
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
        </div>

        {/* Main chat area */}
        <div className="flex-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="px-6 py-4 border-b border-border/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=companion" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">AI Companion</CardTitle>
                  <CardDescription>Online now</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-lifemate-purple text-white"
                          : "bg-secondary"
                      }`}
                    >
                      <p>{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <CardFooter className="p-4 border-t border-border/40">
              <div className="flex items-center gap-2 w-full">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                  <SendHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  Mood Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  How are you feeling today? Your AI companion can help you track your mood over time.
                </p>
                <div className="flex justify-between max-w-md mx-auto">
                  <Button variant="outline" className="flex flex-col gap-1">
                    <span className="text-2xl">😔</span>
                    <span className="text-xs">Down</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col gap-1">
                    <span className="text-2xl">😐</span>
                    <span className="text-xs">Neutral</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col gap-1">
                    <span className="text-2xl">🙂</span>
                    <span className="text-xs">Good</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col gap-1">
                    <span className="text-2xl">😄</span>
                    <span className="text-xs">Great</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col gap-1">
                    <span className="text-2xl">🤩</span>
                    <span className="text-xs">Amazing</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right sidebar for support info */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Chat Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Chat Mode</p>
                <select className="w-full bg-secondary rounded-md border border-border px-3 py-2 text-sm">
                  <option>General Chat</option>
                  <option>Daily Journal</option>
                  <option>Emotional Support</option>
                  <option>Stress Management</option>
                  <option>Meditation Guide</option>
                </select>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Privacy Settings</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Save Chat History</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-lifemate-purple"></div>
                  </label>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Topics & Skills</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">Journaling</Badge>
                  <Badge variant="outline">Stress Relief</Badge>
                  <Badge variant="outline">Meditation</Badge>
                  <Badge variant="outline">Mindfulness</Badge>
                  <Badge variant="outline">Sleep Better</Badge>
                  <Badge variant="outline">Self-Care</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-lifemate-purple/30 bg-lifemate-purple/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Remember that while I'm here to listen and help, I'm not a replacement for professional mental health care.
              </p>
              <Separator />
              <div>
                <p className="text-sm font-medium">Emergency Support:</p>
                <p className="text-sm text-muted-foreground">Call 988 for Suicide & Crisis Lifeline</p>
              </div>
              <Separator />
              <Button variant="outline" className="w-full">
                Find Professional Help
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatCompanion;
