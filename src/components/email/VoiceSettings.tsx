
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

const VoiceSettings = () => {
  const { settings, updateSettings, speak } = useSpeechSynthesis();

  const handleTestVoice = () => {
    const testText = "This is a test of the voice summary feature. You can adjust the settings to customize how your email summaries are read aloud.";
    speak(testText);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Volume2 className="h-5 w-5 mr-2 text-lifemate-purple" /> Voice Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Summary Style</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant={settings.style === "detailed" ? "default" : "outline"} 
              className="w-full"
              onClick={() => updateSettings({ style: "detailed" })}
            >
              Detailed
            </Button>
            <Button 
              size="sm" 
              variant={settings.style === "concise" ? "default" : "outline"} 
              className="w-full"
              onClick={() => updateSettings({ style: "concise" })}
            >
              Concise
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Voice Speed</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              size="sm" 
              variant={settings.speed === "slow" ? "default" : "outline"} 
              className="w-full"
              onClick={() => updateSettings({ speed: "slow" })}
            >
              Slow
            </Button>
            <Button 
              size="sm" 
              variant={settings.speed === "normal" ? "default" : "outline"} 
              className="w-full"
              onClick={() => updateSettings({ speed: "normal" })}
            >
              Normal
            </Button>
            <Button 
              size="sm" 
              variant={settings.speed === "fast" ? "default" : "outline"} 
              className="w-full"
              onClick={() => updateSettings({ speed: "fast" })}
            >
              Fast
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Voice Type</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant={settings.voiceType === "female" ? "default" : "outline"} 
              className="w-full"
              onClick={() => updateSettings({ voiceType: "female" })}
            >
              Female
            </Button>
            <Button 
              size="sm" 
              variant={settings.voiceType === "male" ? "default" : "outline"} 
              className="w-full"
              onClick={() => updateSettings({ voiceType: "male" })}
            >
              Male
            </Button>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={handleTestVoice}
        >
          Test Voice
        </Button>
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;
