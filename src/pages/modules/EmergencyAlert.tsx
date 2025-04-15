
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { AlertTriangle } from "lucide-react";

const EmergencyAlert = () => {
  return (
    <ModulePlaceholder
      title="Emergency & Disaster Alert"
      description="Critical alerts, emergency checklists, and location sharing"
      icon={AlertTriangle}
      color="text-orange-400"
    />
  );
};

export default EmergencyAlert;
