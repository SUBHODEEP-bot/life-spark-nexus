
import emailjs from '@emailjs/browser';
import { generateGeminiResponse } from '@/utils/aiHelpers';

// EmailJS credentials with the correct service ID
const EMAIL_SERVICE_ID = 'service_gkrhayg';
const EMAIL_TEMPLATE_ID = 'template_nj89jpf';
const EMAIL_USER_ID = 'a8Z0Ywd6Efq0mY_tr';

// Gmail API credentials
const GMAIL_CLIENT_ID = '323977921802-v9ovnt9v5m8qofevtr77p124ejlv4f6s.apps.googleusercontent.com';
const GMAIL_CLIENT_SECRET = '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';
// Updated redirect URI to match Google Cloud Console configuration
const GMAIL_REDIRECT_URI = 'https://lovable.dev/api/auth/callback/google';

// Scopes for Gmail API
const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
  'profile',
  'email'
];

interface SendOTPEmailParams {
  email: string;
  otp: string;
  expiryTime?: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  name?: string;
  avatar?: string;
  expiry?: number;
}

export interface Email {
  id: string;
  threadId?: string;
  subject: string;
  sender: string;
  senderEmail?: string;
  preview: string;
  body?: string;
  date: string;
  read: boolean;
  important: boolean;
  folder: "inbox" | "important" | "archived" | "trash";
  summary?: string;
  accountId: string;
}

export const sendOTPEmail = async ({ email, otp, expiryTime = "5 minutes" }: SendOTPEmailParams) => {
  try {
    console.log(`Sending OTP ${otp} to ${email}`);
    
    // Format data according to the EmailJS template expectations
    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      {
        email: email,       // This matches the template's {{email}} parameter
        otp_code: otp,      // This matches the template's {{otp_code}} parameter
        expiry_time: expiryTime  // This matches the template's {{expiry_time}} parameter
      },
      EMAIL_USER_ID
    );

    console.log('OTP email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error };
  }
};

// Gmail OAuth URL generator
export const getGmailAuthUrl = () => {
  const state = Math.random().toString(36).substring(2);
  localStorage.setItem('gmail_oauth_state', state);
  
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.append('client_id', GMAIL_CLIENT_ID);
  url.searchParams.append('redirect_uri', GMAIL_REDIRECT_URI);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('state', state);
  url.searchParams.append('scope', GMAIL_SCOPES.join(' '));
  url.searchParams.append('prompt', 'consent');
  url.searchParams.append('access_type', 'offline');
  
  return url.toString();
};

// Exchange code for tokens
export const exchangeCodeForTokens = async (code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token?: string;
}> => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GMAIL_CLIENT_ID,
        client_secret: GMAIL_CLIENT_SECRET,
        redirect_uri: GMAIL_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${await response.text()}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error;
  }
};

// Get user profile information
export const getUserProfile = async (accessToken: string): Promise<{
  email: string;
  name?: string;
  picture?: string;
}> => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${await response.text()}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Fetch emails from Gmail API
export const fetchGmailEmails = async (
  accessToken: string,
  maxResults = 10
): Promise<Partial<Email>[]> => {
  try {
    // Due to CORS limitations in the preview, we'll use mock data
    // In a real app, this would call the Gmail API
    console.log('Fetching emails with token:', accessToken);
    
    // This would be the real API call
    /*
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch emails: ${await response.text()}`);
    }
    
    const data = await response.json();
    const emails = [];
    
    for (const messageInfo of data.messages) {
      const msgResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (!msgResponse.ok) continue;
      
      const messageData = await msgResponse.json();
      // Process email data and push to emails array
      // ...
    }
    */
    
    // Generate mock emails to simulate API response
    const mockEmails = generateMockEmails(accessToken);
    
    return mockEmails;
  } catch (error) {
    console.error('Error fetching Gmail emails:', error);
    throw error;
  }
};

// Save email accounts to localStorage
export const saveEmailAccount = (account: EmailAccount): void => {
  try {
    const existingAccounts = getEmailAccounts();
    
    // Check if account already exists
    const existingIndex = existingAccounts.findIndex(acc => acc.email === account.email);
    
    if (existingIndex >= 0) {
      existingAccounts[existingIndex] = account;
    } else {
      existingAccounts.push(account);
    }
    
    localStorage.setItem('email_accounts', JSON.stringify(existingAccounts));
  } catch (error) {
    console.error('Error saving email account:', error);
  }
};

// Get email accounts from localStorage
export const getEmailAccounts = (): EmailAccount[] => {
  try {
    const accounts = localStorage.getItem('email_accounts');
    return accounts ? JSON.parse(accounts) : [];
  } catch (error) {
    console.error('Error getting email accounts:', error);
    return [];
  }
};

// Remove email account
export const removeEmailAccount = (accountId: string): void => {
  try {
    const existingAccounts = getEmailAccounts();
    const updatedAccounts = existingAccounts.filter(acc => acc.id !== accountId);
    localStorage.setItem('email_accounts', JSON.stringify(updatedAccounts));
  } catch (error) {
    console.error('Error removing email account:', error);
  }
};

// Generate AI summary for an email
export const generateEmailSummary = async (emailContent: string): Promise<string> => {
  try {
    const prompt = `Please summarize the following email in 2-3 concise sentences, highlighting the main points and any action items:
    
${emailContent}`;

    const response = await generateGeminiResponse(prompt);
    return response.text;
  } catch (error) {
    console.error('Error generating email summary:', error);
    return "Could not generate summary. Please try again.";
  }
};

// Mock function to generate dummy emails
const generateMockEmails = (accountId: string): Email[] => {
  const folders = ['inbox', 'important', 'archived'] as const;
  const senders = [
    { name: 'John Smith', email: 'john@company.com' },
    { name: 'Project Management', email: 'pm@company.com' },
    { name: 'Sarah Johnson', email: 'sarah@company.com' },
    { name: 'Product Team', email: 'product@company.com' },
    { name: 'Airlines Booking', email: 'bookings@airline.com' },
    { name: 'Marketing Team', email: 'news@company.com' },
    { name: 'Security Team', email: 'security@company.com' },
  ];
  
  const subjects = [
    'Weekly Report - Q1 Performance',
    'Meeting Reminder: Project Alpha',
    'New Feature Release - v2.4.0',
    'Your Flight Confirmation',
    'Monthly Newsletter',
    'Account Security Alert',
    'Urgent: Team Meeting Update',
    'Invoice for recent purchase',
    'Your subscription is expiring soon',
    'Project deadline extension',
    'Application Status Update',
  ];
  
  const previews = [
    "Here's the summary of our quarterly performance as discussed in yesterday's meeting. Key highlights include a 15% increase in revenue and 8% decrease in operational costs.",
    "This is a friendly reminder about tomorrow's meeting regarding Project Alpha. Please prepare your status reports and be ready to discuss the next phase of development.",
    "We're excited to announce the release of version 2.4.0 with the following features: improved user interface, faster load times, and enhanced security measures.",
    "Thank you for booking with us. Your flight from New York to London on June 15th has been confirmed. Boarding pass and additional information will be sent 24 hours before departure.",
    "Check out our monthly newsletter featuring industry insights, company updates, and employee spotlights. This month we're featuring the successful launch of our international expansion.",
    "We've detected a login attempt from a new device. If this was you, no action is needed. If you didn't attempt to login, please secure your account immediately by changing your password.",
    "The team meeting scheduled for tomorrow has been moved to 2:00 PM instead of 10:00 AM. Please update your calendars accordingly and let me know if you have any conflicts.",
    "Attached is the invoice for your recent purchase of office supplies. Payment is due within 30 days. Thank you for your business.",
    "Your subscription to our premium service will expire in 7 days. To continue enjoying uninterrupted service, please renew your subscription.",
    "Due to unforeseen circumstances, the project deadline has been extended by two weeks. The new submission date is July 15th.",
    "We have reviewed your application and would like to schedule an interview. Please let us know your availability for next week.",
  ];
  
  const emails: Email[] = [];
  
  // Generate 15 random emails
  for (let i = 0; i < 15; i++) {
    const senderIdx = Math.floor(Math.random() * senders.length);
    const subjectIdx = Math.floor(Math.random() * subjects.length);
    const previewIdx = Math.floor(Math.random() * previews.length);
    const folderIdx = Math.floor(Math.random() * folders.length);
    
    const daysAgo = Math.floor(Math.random() * 14);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const formattedDate = daysAgo === 0 
      ? 'Today, ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ' ' + (date.getHours() >= 12 ? 'PM' : 'AM')
      : daysAgo === 1 
      ? 'Yesterday'
      : 'May ' + date.getDate();
    
    emails.push({
      id: `email-${accountId}-${i}`,
      threadId: `thread-${i}`,
      subject: subjects[subjectIdx],
      sender: `${senders[senderIdx].name} <${senders[senderIdx].email}>`,
      senderEmail: senders[senderIdx].email,
      preview: previews[previewIdx],
      date: formattedDate,
      read: Math.random() > 0.5,
      important: Math.random() > 0.7,
      folder: folders[folderIdx],
      accountId
    });
  }
  
  return emails;
};

// Save voice preference settings
export const saveVoiceSettings = (settings: {
  style: 'detailed' | 'concise';
  speed: 'slow' | 'normal' | 'fast';
  voiceType: 'male' | 'female';
}): void => {
  try {
    localStorage.setItem('voice_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving voice settings:', error);
  }
};

// Get voice preference settings
export const getVoiceSettings = (): {
  style: 'detailed' | 'concise';
  speed: 'slow' | 'normal' | 'fast';
  voiceType: 'male' | 'female';
} => {
  try {
    const settings = localStorage.getItem('voice_settings');
    return settings ? JSON.parse(settings) : {
      style: 'detailed',
      speed: 'normal',
      voiceType: 'female'
    };
  } catch (error) {
    console.error('Error getting voice settings:', error);
    return {
      style: 'detailed',
      speed: 'normal',
      voiceType: 'female'
    };
  }
};
