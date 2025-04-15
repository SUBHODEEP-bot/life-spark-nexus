
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { Star } from "lucide-react";

const DailyMotivation = () => {
  return (
    <ModulePlaceholder
      title="Daily Motivation & Quote Generator"
      description="AI-generated quotes to inspire and motivate you based on your mood"
      icon={Star}
      color="text-yellow-400"
    />
  );
};

export default DailyMotivation;
