
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { Mail } from "lucide-react";

const EmailSummary = () => {
  return (
    <ModulePlaceholder
      title="AI Voice Summary of Emails"
      description="Get audio summaries of your emails and important notifications"
      icon={Mail}
      color="text-indigo-400"
    />
  );
};

export default EmailSummary;
