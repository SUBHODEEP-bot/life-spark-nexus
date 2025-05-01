
import { useState } from "react";
import { Mic, Globe, Languages, Play, Square, Save, History, ListRestart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" }
];

const VoiceTranslator = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  
  const { toast } = useToast();

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate translation happening
      setTimeout(() => {
        const sampleTexts: Record<string, string> = {
          en: "Hello, how are you today? I'm testing this voice translation app.",
          es: "¿Hola, cómo estás hoy? Estoy probando esta aplicación de traducción de voz.",
          fr: "Bonjour, comment allez-vous aujourd'hui? Je teste cette application de traduction vocale.",
          de: "Hallo, wie geht es Ihnen heute? Ich teste diese Sprachübersetzungs-App."
        };
        
        setTranscript(sampleTexts[sourceLanguage] || sampleTexts.en);
        
        const translations: Record<string, string> = {
          es: "Hola, ¿cómo estás hoy? Estoy probando esta aplicación de traducción de voz.",
          en: "Hello, how are you today? I'm testing this voice translation app.",
          fr: "Bonjour, comment allez-vous aujourd'hui? Je teste cette application de traduction vocale.",
          de: "Hallo, wie geht es Ihnen heute? Ich teste diese Sprachübersetzungs-App."
        };
        
        setTranslation(translations[targetLanguage] || translations.es);
        
        toast({
          title: "Translation Complete",
          description: "Your speech has been translated successfully",
        });
      }, 1000);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      setTranscript("");
      setTranslation("");
      
      toast({
        title: "Recording Started",
        description: "Speak now to translate your voice",
      });
      
      // Simulate recording time increasing
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            clearInterval(timer);
            setIsRecording(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    
    toast({
      title: "Languages Swapped",
      description: `Now translating from ${languages.find(l => l.code === targetLanguage)?.name} to ${languages.find(l => l.code === sourceLanguage)?.name}`,
    });
  };

  const handlePlayTranslation = () => {
    toast({
      title: "Playing Translation",
      description: "Translation audio is now playing",
    });
  };

  const handleSaveTranslation = () => {
    toast({
      title: "Translation Saved",
      description: "Your translation has been saved to history",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Real-Time Voice Translator</h1>
        <p className="text-muted-foreground">Translate between languages in real-time with voice input and output</p>
      </div>

      <Card className="overflow-hidden">
        <div className={`h-1 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-lifemate-purple'}`}></div>
        <CardHeader>
          <CardTitle>Voice Translator</CardTitle>
          <CardDescription>Speak in one language, hear in another</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">From</label>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSwapLanguages}
                className="mb-2"
              >
                <ListRestart className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">To</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            {isRecording && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Recording ({recordingTime}s)</span>
                  <span className="text-sm text-red-500">●</span>
                </div>
                <Progress value={(recordingTime / 60) * 100} className="h-1" />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2">Transcript</label>
              <div className="p-3 min-h-20 bg-secondary/50 rounded-md text-sm">
                {transcript || (isRecording ? 
                  <span className="text-muted-foreground">Listening to your voice...</span> : 
                  <span className="text-muted-foreground">Press the microphone button to start recording</span>
                )}
              </div>
            </div>
            
            {translation && (
              <div>
                <label className="block text-sm font-medium mb-2">Translation</label>
                <div className="p-3 min-h-20 bg-secondary/50 rounded-md text-sm border-l-2 border-l-lifemate-purple">
                  {translation}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3">
          <Button 
            onClick={handleToggleRecording}
            variant={isRecording ? "destructive" : "default"}
            className="flex-1"
          >
            {isRecording ? (
              <>
                <Square className="h-4 w-4 mr-2" /> Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" /> Start Recording
              </>
            )}
          </Button>
          
          {translation && (
            <>
              <Button 
                variant="outline" 
                onClick={handlePlayTranslation}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" /> Play Translation
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={handleSaveTranslation}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" /> Save Translation
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-500" /> Supported Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Currently supporting 10 major languages including Spanish, French, German, Chinese, and more.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Languages</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-500" /> Translation History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Access your past 5 translations with audio playback.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View History</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-500" /> Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Customize voice speed, accent, and gender preferences.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Adjust Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VoiceTranslator;
