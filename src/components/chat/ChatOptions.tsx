
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const ChatOptions: React.FC = () => {
  return (
    <div className="w-full md:w-64 space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Chat Options</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Chat Mode</p>
            <select className="w-full bg-secondary rounded-md border border-border px-3 py-2 text-sm">
              <option>General Chat</option>
              <option>Daily Journal</option>
              <option>Emotional Support</option>
              <option>Stress Management</option>
              <option>Meditation Guide</option>
            </select>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Privacy Settings</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Save Chat History</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-lifemate-purple"></div>
              </label>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Topics & Skills</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline">Journaling</Badge>
              <Badge variant="outline">Stress Relief</Badge>
              <Badge variant="outline">Meditation</Badge>
              <Badge variant="outline">Mindfulness</Badge>
              <Badge variant="outline">Sleep Better</Badge>
              <Badge variant="outline">Self-Care</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-lifemate-purple/30 bg-lifemate-purple/5">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Resources</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Remember that while I'm here to listen and help, I'm not a replacement for professional mental health care.
          </p>
          <Separator />
          <div>
            <p className="text-sm font-medium">Emergency Support:</p>
            <p className="text-sm text-muted-foreground">Call 988 for Suicide & Crisis Lifeline</p>
          </div>
          <Separator />
          <Button variant="outline" className="w-full">
            Find Professional Help
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
