
import { useMemo } from 'react';
import { Plus, LogOut, Trash, MailPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getGmailAuthUrl } from '@/services/emailService';
import type { EmailAccount } from '@/services/emailService';

interface AccountSidebarProps {
  accounts: EmailAccount[];
  activeAccountId: string | null;
  setActiveAccountId: (id: string) => void;
  removeAccount: (id: string) => void;
}

const AccountSidebar = ({ 
  accounts, 
  activeAccountId, 
  setActiveAccountId, 
  removeAccount 
}: AccountSidebarProps) => {
  const handleAddAccount = () => {
    window.location.href = getGmailAuthUrl();
  };

  // Get initials for avatar fallback
  const getInitials = useMemo(() => (email: string) => {
    return email
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase();
  }, []);

  return (
    <div className="flex flex-col h-full border-r border-border/40 w-20 bg-card/95 backdrop-blur-sm">
      <div className="p-3 border-b border-border/40">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="w-full h-14 rounded-full"
                onClick={handleAddAccount}
              >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Add email account</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add email account</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {accounts.map(account => (
            <TooltipProvider key={account.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`relative w-full p-0.5 rounded-full transition-all ${
                      activeAccountId === account.id 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : 'hover:ring-1 hover:ring-primary/50'
                    }`}
                    onClick={() => setActiveAccountId(account.id)}
                  >
                    <Avatar className="h-14 w-14">
                      {account.avatar ? (
                        <AvatarImage src={account.avatar} alt={account.email} />
                      ) : null}
                      <AvatarFallback className="bg-lifemate-purple text-white">
                        {getInitials(account.email)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {activeAccountId === account.id && (
                      <div className="absolute -right-1 -bottom-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-full bg-background border-border shadow-md"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeAccount(account.id);
                                }}
                              >
                                <Trash className="h-3 w-3" />
                                <span className="sr-only">Remove account</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>Remove account</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-medium">{account.email}</p>
                  {account.name && <p className="text-xs text-muted-foreground">{account.name}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          {accounts.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="rounded-full bg-lifemate-purple/10 p-3">
                <MailPlus className="h-6 w-6 text-lifemate-purple" />
              </div>
              <div>
                <p className="text-sm font-medium">No accounts</p>
                <p className="text-xs text-muted-foreground">Add your first email account</p>
              </div>
              <Button size="sm" variant="outline" onClick={handleAddAccount}>
                <Plus className="h-4 w-4 mr-1" />
                Add Account
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border/40">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full h-14 text-muted-foreground">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Log out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AccountSidebar;
