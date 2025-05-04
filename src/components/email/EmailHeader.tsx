
import { Button } from "@/components/ui/button";
import AddAccountDialog from "./AddAccountDialog";
import { EmailAccount } from "@/services/emailService";

interface EmailHeaderProps {
  accounts: EmailAccount[];
  onLogout: () => void;
}

const EmailHeader = ({ accounts, onLogout }: EmailHeaderProps) => {
  return (
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
        <Button variant="outline" onClick={onLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default EmailHeader;
