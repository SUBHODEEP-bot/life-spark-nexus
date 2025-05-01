
import { useEffect, useState } from "react";
import { Mail, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Email {
  id: string;
  subject: string;
  sender: string;
  preview: string;
  date: string;
  read: boolean;
  important: boolean;
}

const EmailSummary = () => {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<Email[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading emails
    const timer = setTimeout(() => {
      setEmails([
        {
          id: "1",
          subject: "Weekly Report - Q1 Performance",
          sender: "John Smith <john@company.com>",
          preview: "Here's the summary of our quarterly performance as discussed in yesterday's meeting...",
          date: "Today, 10:34 AM",
          read: false,
          important: true
        },
        {
          id: "2",
          subject: "Meeting Reminder: Project Alpha",
          sender: "Project Management <pm@company.com>",
          preview: "This is a friendly reminder about tomorrow's meeting regarding Project Alpha...",
          date: "Yesterday",
          read: true,
          important: false
        },
        {
          id: "3",
          subject: "New Feature Release - v2.4.0",
          sender: "Product Team <product@company.com>",
          preview: "We're excited to announce the release of version 2.4.0 with the following features...",
          date: "May 12",
          read: false,
          important: true
        }
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    toast({
      title: "Refreshing emails",
      description: "Checking for new messages...",
    });
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Emails updated",
        description: "Your inbox is now up to date",
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

      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-lifemate-purple animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your emails...</p>
          </div>
        ) : (
          emails.map(email => (
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
              <CardFooter className="flex justify-between pt-0">
                <Button variant="ghost" size="sm" onClick={() => markAsRead(email.id)}>
                  <Check className="h-4 w-4 mr-2" /> Mark as read
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" /> Play summary
                </Button>
              </CardFooter>
            </Card>
          ))
        )}

        {!loading && emails.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No emails found</h3>
            <p className="text-muted-foreground">Your inbox is empty or not connected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSummary;
