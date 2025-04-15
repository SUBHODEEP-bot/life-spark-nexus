
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { UserCog } from "lucide-react";

const AppIntegration = () => {
  return (
    <ModulePlaceholder
      title="App Integration Panel"
      description="Connect with Gmail, Calendar, WhatsApp and other essential services"
      icon={UserCog}
      color="text-violet-400"
    />
  );
};

export default AppIntegration;
