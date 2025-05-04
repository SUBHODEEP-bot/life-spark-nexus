
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEmails } from "@/hooks/useEmails";
import { useEmailAuth } from "@/context/EmailAuthContext";
import AccountSidebar from "@/components/email/AccountSidebar";
import EmailList from "@/components/email/EmailList";
import VoiceSettings from "@/components/email/VoiceSettings";
import AddAccountDialog from "@/components/email/AddAccountDialog";
import EmailAuth from "@/components/email/EmailAuth";
import { EmailAuthProvider } from "@/context/EmailAuthContext";

const EmailSummaryContent = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, logout } = useEmailAuth();
  const { 
    accounts, 
    emails, 
    activeAccountId, 
    loading, 
    error,
    setActiveAccountId,
    handleOAuthCallback,
    removeAccount,
    generateSummary,
    markAsRead,
    toggleStar,
    moveToFolder
  } = useEmails();

  const [oauthProcessed, setOauthProcessed] = useState(false);

  // Process OAuth callback if code is present in URL
  useEffect(() => {
    const processOAuthCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      
      if (!code || !state || oauthProcessed) return;
      
      setOauthProcessed(true);
      
      try {
        const success = await handleOAuthCallback(searchParams);
        
        if (success) {
          // Clear URL params after successful processing
          window.history.replaceState({}, document.title, window.location.pathname);
          
          toast({
            title: "Account Connected",
            description: "Your email account has been connected successfully.",
          });
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        toast({
          title: "Connection Failed",
          description: "Failed to connect your email account. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    processOAuthCallback();
  }, [searchParams, handleOAuthCallback, toast, oauthProcessed]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // If no user is logged in, show auth component
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <EmailAuth />
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
      <AccountSidebar 
        accounts={accounts} 
        activeAccountId={activeAccountId} 
        setActiveAccountId={setActiveAccountId}
        removeAccount={removeAccount}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Email AI Summary</h1>
            <p className="text-muted-foreground">
              Get AI-generated summaries of your emails with voice playback
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {accounts.length === 0 && (
              <AddAccountDialog />
            )}
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-hidden">
          {accounts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Mail className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Connect Your Email</h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Connect your email accounts to get AI-powered summaries and voice features
              </p>
              <AddAccountDialog />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
              <div className="w-full md:w-3/4 overflow-auto pr-2">
                <EmailList 
                  emails={emails}
                  loading={loading}
                  onMarkAsRead={markAsRead}
                  onToggleStar={toggleStar}
                  onMoveToFolder={moveToFolder}
                  onGenerateSummary={generateSummary}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <VoiceSettings />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap with auth provider
const EmailSummary = () => {
  return (
    <EmailAuthProvider>
      <EmailSummaryContent />
    </EmailAuthProvider>
  );
};

export default EmailSummary;
