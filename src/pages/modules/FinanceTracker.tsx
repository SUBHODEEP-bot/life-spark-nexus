
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { Wallet } from "lucide-react";

const FinanceTracker = () => {
  return (
    <ModulePlaceholder
      title="Finance & Budget Tracker"
      description="Manage expenses, track income, and get AI-powered saving suggestions"
      icon={Wallet}
      color="text-emerald-400"
    />
  );
};

export default FinanceTracker;
