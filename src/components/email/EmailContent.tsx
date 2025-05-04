
import { EmailAccount, Email } from "@/services/emailService";
import EmailList from "./EmailList";
import VoiceSettings from "./VoiceSettings";
import EmptyState from "./EmptyState";

interface EmailContentProps {
  accounts: EmailAccount[];
  emails: Email[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onToggleStar: (id: string) => void;
  onMoveToFolder: (id: string, folder: "inbox" | "important" | "archived" | "trash") => void;
  onGenerateSummary: (id: string) => Promise<string | null | undefined>;
}

const EmailContent = ({ 
  accounts,
  emails,
  loading,
  onMarkAsRead,
  onToggleStar,
  onMoveToFolder,
  onGenerateSummary
}: EmailContentProps) => {
  return (
    <div className="flex-1 p-6 overflow-hidden">
      {accounts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
          <div className="w-full md:w-3/4 overflow-auto pr-2">
            <EmailList 
              emails={emails}
              loading={loading}
              onMarkAsRead={onMarkAsRead}
              onToggleStar={onToggleStar}
              onMoveToFolder={onMoveToFolder}
              onGenerateSummary={onGenerateSummary}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <VoiceSettings />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailContent;
