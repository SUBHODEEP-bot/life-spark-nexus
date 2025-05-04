
import { useEffect } from "react";
import { useEmailAuth } from "@/context/EmailAuthContext";
import { useEmails } from "@/hooks/useEmails";
import { useToast } from "@/hooks/use-toast";
import EmailAuth from "@/components/email/EmailAuth";
import AccountSidebar from "@/components/email/AccountSidebar";
import OAuthHandler from "@/components/email/OAuthHandler";
import EmailHeader from "@/components/email/EmailHeader";
import EmailContent from "@/components/email/EmailContent";

const EmailDashboard = () => {
  const { user, logout } = useEmailAuth();
  const { toast } = useToast();
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
      <OAuthHandler onProcessOAuth={handleOAuthCallback} />
      
      <AccountSidebar 
        accounts={accounts} 
        activeAccountId={activeAccountId} 
        setActiveAccountId={setActiveAccountId}
        removeAccount={removeAccount}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <EmailHeader 
          accounts={accounts} 
          onLogout={logout} 
        />
        
        <EmailContent
          accounts={accounts}
          emails={emails}
          loading={loading}
          onMarkAsRead={markAsRead}
          onToggleStar={toggleStar}
          onMoveToFolder={moveToFolder}
          onGenerateSummary={generateSummary}
        />
      </div>
    </div>
  );
};

export default EmailDashboard;
