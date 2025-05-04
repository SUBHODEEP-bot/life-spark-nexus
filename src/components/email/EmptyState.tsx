
import { Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddAccountDialog from "./AddAccountDialog";

const EmptyState = () => {
  return (
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
  );
};

export default EmptyState;
