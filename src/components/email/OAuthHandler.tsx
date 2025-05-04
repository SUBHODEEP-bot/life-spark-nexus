
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface OAuthHandlerProps {
  onProcessOAuth: (searchParams: URLSearchParams) => Promise<boolean>;
}

const OAuthHandler = ({ onProcessOAuth }: OAuthHandlerProps) => {
  const [searchParams] = useSearchParams();
  const [oauthProcessed, setOauthProcessed] = useState(false);
  const { toast } = useToast();

  // Process OAuth callback if code is present in URL
  useEffect(() => {
    const processOAuthCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const savedState = localStorage.getItem('gmail_oauth_state');
      
      // Check if we have a code and haven't processed this callback yet
      if (!code || oauthProcessed) {
        return;
      }
      
      // Validate state parameter to prevent CSRF attacks
      if (state !== savedState) {
        console.error("State mismatch in OAuth callback", { state, savedState });
        toast({
          title: "Security Error",
          description: "Authentication failed due to state parameter mismatch. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Processing OAuth callback with code:", code);
      setOauthProcessed(true);
      
      try {
        const success = await onProcessOAuth(searchParams);
        
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
      } finally {
        // Clean up the state from localStorage regardless of outcome
        localStorage.removeItem('gmail_oauth_state');
      }
    };
    
    processOAuthCallback();
  }, [searchParams, onProcessOAuth, toast, oauthProcessed]);

  // This is a utility component that doesn't render anything
  return null;
};

export default OAuthHandler;
