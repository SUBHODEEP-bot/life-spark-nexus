
import { useState } from "react";
import { Check, ArrowRight, Star, Trash, Play, Pause, Search, Inbox, Archive, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { Email as EmailType } from "@/services/emailService";

interface EmailListProps {
  emails: EmailType[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onToggleStar: (id: string) => void;
  onMoveToFolder: (id: string, folder: "inbox" | "important" | "archived" | "trash") => void;
  onGenerateSummary: (id: string) => Promise<string | null | undefined>;
}

type FolderType = "inbox" | "important" | "archived";

const EmailList = ({ 
  emails, 
  loading, 
  onMarkAsRead, 
  onToggleStar, 
  onMoveToFolder,
  onGenerateSummary 
}: EmailListProps) => {
  const [activeTab, setActiveTab] = useState<FolderType>("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingEmailId, setPlayingEmailId] = useState<string | null>(null);
  const { speak, stop, speaking } = useSpeechSynthesis();

  // Filter emails based on search query and active tab
  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchQuery.trim() === "" || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = email.folder === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handlePlaySummary = async (id: string) => {
    // If already playing this email, stop it
    if (playingEmailId === id) {
      stop();
      setPlayingEmailId(null);
      return;
    }
    
    // If something else is playing, stop it
    if (speaking) {
      stop();
    }
    
    // Generate or retrieve summary
    const summary = await onGenerateSummary(id);
    
    if (summary) {
      setPlayingEmailId(id);
      speak(summary);
      
      // Auto-clear playing state when done
      // This is a backup in case the speech synthesis events don't fire correctly
      setTimeout(() => {
        if (playingEmailId === id) {
          setPlayingEmailId(null);
        }
      }, 30000); // 30 seconds max
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setSearchQuery("")}>
          Clear
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={(value: FolderType) => setActiveTab(value)} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" /> Inbox
          </TabsTrigger>
          <TabsTrigger value="important" className="flex items-center gap-2">
            <Star className="h-4 w-4" /> Important
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" /> Archived
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox" className="mt-4">
          {renderEmailList()}
        </TabsContent>
        
        <TabsContent value="important" className="mt-4">
          {renderEmailList()}
        </TabsContent>
        
        <TabsContent value="archived" className="mt-4">
          {renderEmailList()}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderEmailList() {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-t-lifemate-purple rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading your emails...</p>
        </div>
      );
    }
    
    if (filteredEmails.length === 0) {
      return (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No emails found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "Try a different search term" : "Your inbox is empty or not connected"}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4">
        {filteredEmails.map(email => (
          <Card key={email.id} className={`transition-all hover:shadow-md ${!email.read ? 'border-l-4 border-l-lifemate-purple' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {email.subject}
                    {email.important && (
                      <Badge variant="default" className="bg-lifemate-orange">Important</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{email.sender}</CardDescription>
                </div>
                <span className="text-xs text-muted-foreground">{email.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{email.preview}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between gap-2 pt-0">
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(email.id)}>
                  <Check className="h-4 w-4 mr-2" /> Mark as read
                </Button>
                <Button 
                  variant={playingEmailId === email.id ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handlePlaySummary(email.id)}
                  className={playingEmailId === email.id ? "bg-lifemate-purple hover:bg-lifemate-purple-dark" : ""}
                >
                  {playingEmailId === email.id ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" /> Play summary
                    </>
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onToggleStar(email.id)}>
                  <Star className={`h-4 w-4 mr-2 ${email.important ? "text-yellow-400 fill-yellow-400" : ""}`} /> 
                  {email.important ? "Remove star" : "Star"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onMoveToFolder(email.id, "archived")}>
                  <ArrowRight className="h-4 w-4 mr-2" /> Archive
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onMoveToFolder(email.id, "trash")} className="text-red-500 hover:text-red-600">
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
};

export default EmailList;
