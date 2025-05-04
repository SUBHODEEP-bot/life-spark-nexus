
import { useState, useEffect, useCallback } from 'react';
import { 
  Email, 
  EmailAccount, 
  fetchGmailEmails, 
  getEmailAccounts, 
  saveEmailAccount, 
  removeEmailAccount, 
  getUserProfile, 
  exchangeCodeForTokens, 
  generateEmailSummary 
} from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';

export const useEmails = () => {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load accounts from localStorage on mount
  useEffect(() => {
    const loadAccounts = () => {
      try {
        const savedAccounts = getEmailAccounts();
        setAccounts(savedAccounts);
        
        // Set active account to the first one if available
        if (savedAccounts.length > 0 && !activeAccountId) {
          setActiveAccountId(savedAccounts[0].id);
        }
        
        // Remember active account from localStorage
        const lastActiveId = localStorage.getItem('active_email_account');
        if (lastActiveId && savedAccounts.some(acc => acc.id === lastActiveId)) {
          setActiveAccountId(lastActiveId);
        }
      } catch (err) {
        console.error('Error loading email accounts:', err);
        setError('Failed to load email accounts');
      }
    };
    
    loadAccounts();
  }, []);

  // Save active account to localStorage when it changes
  useEffect(() => {
    if (activeAccountId) {
      localStorage.setItem('active_email_account', activeAccountId);
    }
  }, [activeAccountId]);

  // Fetch emails when active account changes
  useEffect(() => {
    if (activeAccountId) {
      fetchEmailsForAccount(activeAccountId);
    }
  }, [activeAccountId]);

  // Handle OAuth callback
  const handleOAuthCallback = useCallback(async (urlParams: URLSearchParams) => {
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const savedState = localStorage.getItem('gmail_oauth_state');
    
    if (!code) {
      setError('No authorization code received');
      return false;
    }
    
    if (state !== savedState) {
      setError('State parameter mismatch, possible CSRF attack');
      return false;
    }
    
    try {
      setLoading(true);
      
      // Exchange code for tokens
      const tokens = await exchangeCodeForTokens(code);
      
      // Get user profile
      const userProfile = await getUserProfile(tokens.access_token);
      
      // Create and save new account
      const newAccount: EmailAccount = {
        id: `gmail_${Date.now()}`,
        email: userProfile.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
        name: userProfile.name,
        avatar: userProfile.picture,
        expiry: Date.now() + (tokens.expires_in * 1000)
      };
      
      saveEmailAccount(newAccount);
      
      // Update accounts state
      setAccounts(prev => {
        const updated = [...prev];
        const existingIdx = updated.findIndex(acc => acc.email === newAccount.email);
        
        if (existingIdx >= 0) {
          updated[existingIdx] = newAccount;
        } else {
          updated.push(newAccount);
        }
        
        return updated;
      });
      
      // Set as active account
      setActiveAccountId(newAccount.id);
      
      toast({
        title: 'Email Account Added',
        description: `${userProfile.email} has been added successfully`,
      });
      
      return true;
    } catch (err: any) {
      console.error('Error handling OAuth callback:', err);
      setError(err.message || 'Failed to add email account');
      
      toast({
        title: 'Error Adding Account',
        description: err.message || 'Failed to add email account',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setLoading(false);
      // Clear the state from localStorage
      localStorage.removeItem('gmail_oauth_state');
    }
  }, [toast]);

  // Fetch emails for an account
  const fetchEmailsForAccount = useCallback(async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    try {
      setLoading(true);
      
      // In a real app, check if token needs refresh
      // if (Date.now() > account.expiry) {
      //   // Refresh token logic
      // }
      
      const fetchedEmails = await fetchGmailEmails(account.accessToken);
      
      // Add accountId to each email
      const emailsWithAccount = fetchedEmails.map(email => ({
        ...email,
        accountId
      })) as Email[];
      
      setEmails(emailsWithAccount);
    } catch (err: any) {
      console.error('Error fetching emails:', err);
      setError(err.message || 'Failed to fetch emails');
      
      toast({
        title: 'Error Fetching Emails',
        description: err.message || 'Failed to fetch emails',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [accounts, toast]);

  // Remove an account
  const removeAccount = useCallback((accountId: string) => {
    try {
      removeEmailAccount(accountId);
      
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
      
      // If we're removing the active account, set active to the first available or null
      if (activeAccountId === accountId) {
        const remainingAccounts = accounts.filter(acc => acc.id !== accountId);
        setActiveAccountId(remainingAccounts.length > 0 ? remainingAccounts[0].id : null);
      }
      
      toast({
        title: 'Account Removed',
        description: 'Email account has been removed',
      });
    } catch (err: any) {
      console.error('Error removing account:', err);
      setError(err.message || 'Failed to remove account');
      
      toast({
        title: 'Error Removing Account',
        description: err.message || 'Failed to remove email account',
        variant: 'destructive'
      });
    }
  }, [accounts, activeAccountId, toast]);

  // Generate summary for an email
  const generateSummary = useCallback(async (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (!email) return;
    
    try {
      // If we already have a summary, return it
      if (email.summary) return email.summary;
      
      const emailContent = email.body || email.preview;
      const summary = await generateEmailSummary(emailContent);
      
      // Update email with summary
      setEmails(prev => 
        prev.map(e => 
          e.id === emailId 
            ? { ...e, summary } 
            : e
        )
      );
      
      return summary;
    } catch (err) {
      console.error('Error generating summary:', err);
      return null;
    }
  }, [emails]);

  // Email actions (mark as read, star, etc.)
  const markAsRead = useCallback((emailId: string) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId 
          ? { ...email, read: true } 
          : email
      )
    );
  }, []);

  const toggleStar = useCallback((emailId: string) => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId 
          ? { ...email, important: !email.important } 
          : email
      )
    );
  }, []);

  const moveToFolder = useCallback((emailId: string, folder: "inbox" | "important" | "archived" | "trash") => {
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId 
          ? { ...email, folder } 
          : email
      )
    );
    
    if (folder === 'trash') {
      // In a real app, we'd call the Gmail API to move to trash
      setTimeout(() => {
        setEmails(prev => prev.filter(email => email.id !== emailId));
      }, 2000); // Simulate deletion after 2 seconds
    }
  }, []);

  return {
    accounts,
    emails,
    activeAccountId,
    loading,
    error,
    setActiveAccountId,
    handleOAuthCallback,
    fetchEmailsForAccount,
    removeAccount,
    generateSummary,
    markAsRead,
    toggleStar,
    moveToFolder
  };
};
