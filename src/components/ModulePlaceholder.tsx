
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

const ModulePlaceholder = ({
  title,
  description,
  icon: Icon,
  color = "text-lifemate-purple",
}: ModulePlaceholderProps) => {
  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>

      <Card className="border-lifemate-purple/30 bg-lifemate-purple/5 p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className={`p-6 rounded-full bg-secondary/80 ${color}`}>
            <Icon className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-semibold">Coming Soon</h2>
          <p className="text-muted-foreground max-w-lg">
            This module is currently under development. We're working hard to
            bring you a great experience with all the features you need.
          </p>
          <Button className="bg-lifemate-purple hover:bg-lifemate-purple-dark mt-4">
            Get Notified When Ready
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ModulePlaceholder;
