
import { useEffect, useState } from "react";
import { Mail, Check, RefreshCw, Play, Pause, Volume2, ArrowRight, Star, Trash, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Email {
  id: string;
  subject: string;
  sender: string;
  preview: string;
  date: string;
  read: boolean;
  important: boolean;
  folder: "inbox" | "important" | "archived";
}

type FolderType = "inbox" | "important" | "archived";

const EmailSummary = () => {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<Email[]>([]);
  const [playingEmailId, setPlayingEmailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const [activeTab, setActiveTab] = useState<FolderType>("inbox");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading emails
    const timer = setTimeout(() => {
      setEmails([
        {
          id: "1",
          subject: "Weekly Report - Q1 Performance",
          sender: "John Smith <john@company.com>",
          preview: "Here's the summary of our quarterly performance as discussed in yesterday's meeting. Key highlights include a 15% increase in revenue and 8% decrease in operational costs. The team has exceeded expectations in several key areas including customer acquisition and retention.",
          date: "Today, 10:34 AM",
          read: false,
          important: true,
          folder: "inbox"
        },
        {
          id: "2",
          subject: "Meeting Reminder: Project Alpha",
          sender: "Project Management <pm@company.com>",
          preview: "This is a friendly reminder about tomorrow's meeting regarding Project Alpha. Please prepare your status reports and be ready to discuss the next phase of development. We'll be covering the timeline adjustments and budget allocations.",
          date: "Yesterday",
          read: true,
          important: false,
          folder: "inbox"
        },
        {
          id: "3",
          subject: "New Feature Release - v2.4.0",
          sender: "Product Team <product@company.com>",
          preview: "We're excited to announce the release of version 2.4.0 with the following features: improved user interface, faster load times, and enhanced security measures. Please update your installations at your earliest convenience.",
          date: "May 12",
          read: false,
          important: true,
          folder: "important"
        },
        {
          id: "4",
          subject: "Your Flight Confirmation",
          sender: "Airlines Booking <bookings@airline.com>",
          preview: "Thank you for booking with us. Your flight from New York to London on June 15th has been confirmed. Boarding pass and additional information will be sent 24 hours before departure.",
          date: "May 10",
          read: true,
          important: true,
          folder: "important"
        },
        {
          id: "5",
          subject: "Monthly Newsletter",
          sender: "Marketing Team <news@company.com>",
          preview: "Check out our monthly newsletter featuring industry insights, company updates, and employee spotlights. This month we're featuring the successful launch of our international expansion.",
          date: "May 5",
          read: true,
          important: false,
          folder: "archived"
        },
        {
          id: "6",
          subject: "Account Security Alert",
          sender: "Security Team <security@company.com>",
          preview: "We've detected a login attempt from a new device. If this was you, no action is needed. If you didn't attempt to login, please secure your account immediately by changing your password.",
          date: "May 3",
          read: false,
          important: true,
          folder: "inbox"
        }
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter emails based on search query and active tab
    if (searchQuery.trim() === "") {
      setFilteredEmails(emails.filter(email => email.folder === activeTab));
    } else {
      const filtered = emails.filter(
        email =>
          (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.preview.toLowerCase().includes(searchQuery.toLowerCase())) &&
          email.folder === activeTab
      );
      setFilteredEmails(filtered);
    }
  }, [searchQuery, emails, activeTab]);

  const handleRefresh = () => {
    setLoading(true);
    toast({
      title: "Refreshing emails",
      description: "Checking for new messages...",
    });
    
    setTimeout(() => {
      // Add a new email at the top
      const newEmail: Email = {
        id: `new-${Date.now()}`,
        subject: "Urgent: Team Meeting Update",
        sender: "Sarah Johnson <sarah@company.com>",
        preview: "The team meeting scheduled for tomorrow has been moved to 2:00 PM instead of 10:00 AM. Please update your calendars accordingly and let me know if you have any conflicts.",
        date: "Just now",
        read: false,
        important: true,
        folder: "inbox"
      };
      
      setEmails([newEmail, ...emails]);
      setLoading(false);
      toast({
        title: "Emails updated",
        description: "You have 1 new message",
      });
    }, 1500);
  };

  const markAsRead = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, read: true } : email
    ));
    toast({
      title: "Email marked as read",
      description: "Email has been marked as read",
    });
  };

  const toggleImportant = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, important: !email.important } : email
    ));
    
    const email = emails.find(e => e.id === id);
    toast({
      title: email?.important ? "Removed from important" : "Marked as important",
      description: `Email has been ${email?.important ? "removed from" : "added to"} important`,
    });
  };

  const archiveEmail = (id: string) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, folder: "archived" as const } : email
    ));
    toast({
      title: "Email archived",
      description: "Email has been moved to archive",
    });
  };

  const deleteEmail = (id: string) => {
    setEmails(emails.filter(email => email.id !== id));
    toast({
      title: "Email deleted",
      description: "Email has been permanently deleted",
    });
  };

  const handlePlaySummary = (id: string) => {
    if (playingEmailId === id) {
      setPlayingEmailId(null);
      toast({
        title: "Audio paused",
        description: "Voice summary paused",
      });
    } else {
      setPlayingEmailId(id);
      toast({
        title: "Playing summary",
        description: "Voice summary is now playing",
      });
      
      // Simulate finishing playing after 5 seconds
      setTimeout(() => {
        if (playingEmailId === id) {
          setPlayingEmailId(null);
          toast({
            title: "Summary complete",
            description: "Voice summary finished playing",
          });
        }
      }, 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Voice Summary of Emails</h1>
          <p className="text-muted-foreground">Get audio summaries of your emails and important notifications</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={loading}
          className="flex gap-2 items-center"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-3/4 space-y-4">
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
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="important">Important</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
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
        
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Volume2 className="h-5 w-5 mr-2 text-lifemate-purple" /> Voice Summary
              </CardTitle>
              <CardDescription>Voice summary settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Summary Style</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="default" className="w-full">Detailed</Button>
                  <Button size="sm" variant="outline" className="w-full">Concise</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Voice Speed</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button size="sm" variant="outline" className="w-full">Slow</Button>
                  <Button size="sm" variant="default" className="w-full">Normal</Button>
                  <Button size="sm" variant="outline" className="w-full">Fast</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Voice Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="default" className="w-full">Female</Button>
                  <Button size="sm" variant="outline" className="w-full">Male</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  toast({
                    title: "Settings saved",
                    description: "Voice summary settings have been updated",
                  });
                }}
              >
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
  
  function renderEmailList() {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-lifemate-purple animate-spin mb-4" />
          <p className="text-muted-foreground">Loading your emails...</p>
        </div>
      );
    }
    
    const emailsToShow = filteredEmails;
    
    if (emailsToShow.length === 0) {
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
        {emailsToShow.map(email => (
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
                <Button variant="ghost" size="sm" onClick={() => markAsRead(email.id)}>
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
                <Button variant="ghost" size="sm" onClick={() => toggleImportant(email.id)}>
                  <Star className={`h-4 w-4 mr-2 ${email.important ? "text-yellow-400 fill-yellow-400" : ""}`} /> 
                  {email.important ? "Remove star" : "Star"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => archiveEmail(email.id)}>
                  <ArrowRight className="h-4 w-4 mr-2" /> Archive
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteEmail(email.id)} className="text-red-500 hover:text-red-600">
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

export default EmailSummary;
