
import { EmailAuthProvider } from "@/context/EmailAuthContext";
import EmailDashboard from "@/components/email/EmailDashboard";

// Simplified main component that just wraps the dashboard with auth provider
const EmailSummary = () => {
  return (
    <EmailAuthProvider>
      <EmailDashboard />
    </EmailAuthProvider>
  );
};

export default EmailSummary;
