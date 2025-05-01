
import { useState, useEffect } from "react";
import { Mic, Volume2, Languages, ArrowRight, History, Bookmark, RefreshCw, CheckCircle2, Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: string;
  isFavorite: boolean;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const VoiceTranslator = () => {
  const [activeTab, setActiveTab] = useState("translate");
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [translationHistory, setTranslationHistory] = useState<Translation[]>([
    {
      id: "1",
      sourceText: "Hello, how are you doing today?",
      translatedText: "Hola, ¿cómo estás hoy?",
      sourceLanguage: "en",
      targetLanguage: "es",
      timestamp: "Today, 10:30 AM",
      isFavorite: true
    },
    {
      id: "2",
      sourceText: "Where is the nearest restaurant?",
      translatedText: "¿Dónde está el restaurante más cercano?",
      sourceLanguage: "en",
      targetLanguage: "es",
      timestamp: "Yesterday, 3:15 PM",
      isFavorite: false
    },
    {
      id: "3",
      sourceText: "I need to find a pharmacy.",
      translatedText: "Necesito encontrar una farmacia.",
      sourceLanguage: "en",
      targetLanguage: "es",
      timestamp: "Yesterday, 11:45 AM",
      isFavorite: true
    }
  ]);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"source" | "target">("source");
  const { toast } = useToast();

  const languages: Language[] = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
  ];

  const getLanguageNameByCode = (code: string): string => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  const getLanguageFlagByCode = (code: string): string => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.flag : "";
  };

  const handleListenClick = () => {
    if (isListening) {
      setIsListening(false);
      setSourceText("Hello, how are you doing today? I'm looking for directions to the nearest hotel. Can you help me please?");
      
      toast({
        title: "Voice Input Complete",
        description: "Your speech has been recorded.",
      });
    } else {
      setIsListening(true);
      setSourceText("");
      
      toast({
        title: "Listening",
        description: "Speak now...",
      });
      
      // Simulate listening for 3 seconds
      setTimeout(() => {
        setIsListening(false);
        setSourceText("Hello, how are you doing today? I'm looking for directions to the nearest hotel. Can you help me please?");
        
        toast({
          title: "Voice Input Complete",
          description: "Your speech has been recorded.",
        });
      }, 3000);
    }
  };

  const handleTranslateClick = () => {
    if (!sourceText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter or record some text to translate.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTranslating(true);
    
    // Simulate translation
    setTimeout(() => {
      const translations = {
        "es": "Hola, ¿cómo estás hoy? Estoy buscando direcciones al hotel más cercano. ¿Puedes ayudarme por favor?",
        "fr": "Bonjour, comment allez-vous aujourd'hui? Je cherche des directions vers l'hôtel le plus proche. Pouvez-vous m'aider s'il vous plaît?",
        "de": "Hallo, wie geht es dir heute? Ich suche nach einer Wegbeschreibung zum nächsten Hotel. Können Sie mir bitte helfen?",
        "it": "Ciao, come stai oggi? Sto cercando indicazioni per l'hotel più vicino. Puoi aiutarmi per favore?",
        "pt": "Olá, como você está hoje? Estou procurando direções para o hotel mais próximo. Você pode me ajudar, por favor?",
        "ru": "Здравствуйте, как у вас дела сегодня? Я ищу дорогу к ближайшему отелю. Не могли бы вы мне помочь, пожалуйста?",
        "zh": "你好，今天过得怎么样？我正在寻找去最近酒店的路线。你能帮助我吗？",
        "ja": "こんにちは、今日の調子はどうですか？最寄りのホテルまでの道順を探しています。手伝っていただけますか？",
        "ko": "안녕하세요, 오늘 어떻게 지내세요? 가장 가까운 호텔로 가는 길을 찾고 있습니다. 도와주시겠어요?",
        "ar": "مرحبًا ، كيف حالك اليوم؟ أنا أبحث عن الاتجاهات إلى أقرب فندق. هل يمكنك مساعدتي من فضلك؟",
        "hi": "नमस्ते, आज आप कैसे हैं? मैं निकटतम होटल के लिए दिशा-निर्देश ढूंढ रहा हूं। क्या आप मेरी मदद कर सकते हैं?"
      };
      
      const newTranslatedText = translations[targetLanguage as keyof typeof translations] || "Translation not available for this language";
      setTranslatedText(newTranslatedText);
      setIsTranslating(false);
      
      // Add to history
      const newTranslation: Translation = {
        id: Date.now().toString(),
        sourceText: sourceText,
        translatedText: newTranslatedText,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        timestamp: "Just now",
        isFavorite: false
      };
      
      setTranslationHistory([newTranslation, ...translationHistory]);
      
      toast({
        title: "Translation Complete",
        description: `Translated from ${getLanguageNameByCode(sourceLanguage)} to ${getLanguageNameByCode(targetLanguage)}`,
      });
    }, 2000);
  };

  const handlePlayTranslation = () => {
    if (!translatedText) {
      toast({
        title: "No Translation",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      toast({
        title: "Playing Audio",
        description: `Playing translation in ${getLanguageNameByCode(targetLanguage)}`,
      });
      
      // Simulate audio playing for 3 seconds
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } else {
      toast({
        title: "Audio Stopped",
        description: "Translation audio has been stopped.",
      });
    }
  };

  const handleCopyTranslation = () => {
    if (!translatedText) {
      toast({
        title: "No Translation",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would use navigator.clipboard.writeText(translatedText);
    toast({
      title: "Copied to Clipboard",
      description: "Translation has been copied to clipboard.",
    });
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    
    // Swap text as well if both exist
    if (sourceText && translatedText) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
    
    toast({
      title: "Languages Swapped",
      description: `Now translating from ${getLanguageNameByCode(targetLanguage)} to ${getLanguageNameByCode(temp)}`,
    });
  };

  const handleSelectLanguage = (language: string) => {
    if (dialogMode === "source") {
      setSourceLanguage(language);
    } else {
      setTargetLanguage(language);
    }
    setShowLanguageDialog(false);
  };

  const toggleFavorite = (id: string) => {
    setTranslationHistory(history => 
      history.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const loadFromHistory = (translation: Translation) => {
    setSourceLanguage(translation.sourceLanguage);
    setTargetLanguage(translation.targetLanguage);
    setSourceText(translation.sourceText);
    setTranslatedText(translation.translatedText);
    setActiveTab("translate");
    
    toast({
      title: "Translation Loaded",
      description: "Historical translation has been loaded.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Real-Time Voice Translator</h1>
        <p className="text-muted-foreground">Translate between languages in real-time with voice input</p>
      </div>

      <Tabs defaultValue="translate" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="translate" className="flex items-center gap-2">
            <Languages className="h-4 w-4" /> Translate
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> History
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" /> Saved
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="translate" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 min-w-[120px]"
                    onClick={() => {
                      setDialogMode("source");
                      setShowLanguageDialog(true);
                    }}
                  >
                    <span className="text-lg">{getLanguageFlagByCode(sourceLanguage)}</span>
                    {getLanguageNameByCode(sourceLanguage)}
                  </Button>
                </div>
                
                <div className="mx-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0"
                    onClick={handleSwapLanguages}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 flex justify-end">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 min-w-[120px]"
                    onClick={() => {
                      setDialogMode("target");
                      setShowLanguageDialog(true);
                    }}
                  >
                    <span className="text-lg">{getLanguageFlagByCode(targetLanguage)}</span>
                    {getLanguageNameByCode(targetLanguage)}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className="w-full h-32 p-3 border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-lifemate-purple"
                  placeholder="Enter text or press the mic button to speak..."
                ></textarea>
                <Button
                  variant="outline"
                  size="icon"
                  className={`absolute bottom-3 right-3 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : ''}`}
                  onClick={handleListenClick}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full flex items-center gap-2"
                onClick={handleTranslateClick}
                disabled={isTranslating || !sourceText.trim()}
              >
                {isTranslating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="h-4 w-4" />
                    Translate
                  </>
                )}
              </Button>
              
              <div className="relative">
                <textarea
                  value={translatedText}
                  readOnly
                  className="w-full h-32 p-3 border rounded-md resize-none bg-secondary/50"
                  placeholder="Translation will appear here..."
                ></textarea>
                
                {translatedText && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={handleCopyTranslation}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={isPlaying ? "default" : "outline"}
                      size="icon"
                      className={`rounded-full ${isPlaying ? 'bg-lifemate-purple text-white' : ''}`}
                      onClick={handlePlayTranslation}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Phrases</CardTitle>
              <CardDescription>Common phrases for quick translation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {["Hello, how are you?", "Where is the bathroom?", "How much does this cost?", "I don't understand", "Can you help me?", "My name is..."].map((phrase, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => {
                      setSourceText(phrase);
                      toast({
                        title: "Phrase Selected",
                        description: "You can now translate this phrase.",
                      });
                    }}
                  >
                    {phrase}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Translation Settings</CardTitle>
              <CardDescription>Customize your translation experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Auto-Detect Language</h3>
                    <p className="text-xs text-muted-foreground">Automatically detect source language</p>
                  </div>
                  <div className="h-6 w-12 rounded-full bg-lifemate-purple cursor-pointer flex items-center" onClick={() => {
                    toast({
                      title: "Auto-Detect",
                      description: "Auto-detect language has been disabled",
                    });
                  }}>
                    <div className="h-5 w-5 rounded-full bg-white ml-auto mr-0.5"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Auto-Play Translation</h3>
                    <p className="text-xs text-muted-foreground">Automatically play translation audio</p>
                  </div>
                  <div className="h-6 w-12 rounded-full bg-secondary cursor-pointer flex items-center" onClick={() => {
                    toast({
                      title: "Auto-Play",
                      description: "Auto-play translation has been enabled",
                    });
                  }}>
                    <div className="h-5 w-5 rounded-full bg-white ml-0.5"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Offline Mode</h3>
                    <p className="text-xs text-muted-foreground">Use offline translation when available</p>
                  </div>
                  <div className="h-6 w-12 rounded-full bg-secondary cursor-pointer flex items-center" onClick={() => {
                    toast({
                      title: "Offline Mode",
                      description: "Offline mode has been enabled",
                    });
                  }}>
                    <div className="h-5 w-5 rounded-full bg-white ml-0.5"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Voice Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs">Speaking Rate</label>
                    <Select defaultValue="normal">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select speed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs">Voice Gender</label>
                    <Select defaultValue="female">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-3">
            {translationHistory.length > 0 ? (
              translationHistory.map(translation => (
                <Card key={translation.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getLanguageFlagByCode(translation.sourceLanguage)}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="text-lg">{getLanguageFlagByCode(translation.targetLanguage)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{translation.timestamp}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">{getLanguageNameByCode(translation.sourceLanguage)}:</span>
                        <p className="mt-1 text-muted-foreground">{translation.sourceText}</p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{getLanguageNameByCode(translation.targetLanguage)}:</span>
                        <p className="mt-1">{translation.translatedText}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => toggleFavorite(translation.id)}
                    >
                      <Star className={`h-4 w-4 ${translation.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      {translation.isFavorite ? 'Saved' : 'Save'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => loadFromHistory(translation)}
                    >
                      Use Again
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-secondary rounded-full mb-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium">No Translation History</h3>
                <p className="text-muted-foreground">Your translation history will appear here</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              toast({
                title: "History Cleared",
                description: "Translation history has been cleared",
              });
              setTranslationHistory([]);
            }}
          >
            Clear History
          </Button>
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-4">
          <div className="grid gap-3">
            {translationHistory.filter(t => t.isFavorite).length > 0 ? (
              translationHistory.filter(t => t.isFavorite).map(translation => (
                <Card key={translation.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getLanguageFlagByCode(translation.sourceLanguage)}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="text-lg">{getLanguageFlagByCode(translation.targetLanguage)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => toggleFavorite(translation.id)}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">{getLanguageNameByCode(translation.sourceLanguage)}:</span>
                        <p className="mt-1 text-muted-foreground">{translation.sourceText}</p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{getLanguageNameByCode(translation.targetLanguage)}:</span>
                        <p className="mt-1">{translation.translatedText}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        // In a real app, we would use navigator.clipboard.writeText(translation.translatedText);
                        toast({
                          title: "Copied to Clipboard",
                          description: "Translation has been copied to clipboard.",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => loadFromHistory(translation)}
                    >
                      Use Again
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-secondary rounded-full mb-4">
                  <Bookmark className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium">No Saved Translations</h3>
                <p className="text-muted-foreground">Your favorite translations will appear here</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Language Skills</CardTitle>
          <CardDescription>Track your language proficiency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spanish</span>
                <span>Intermediate</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>French</span>
                <span>Beginner</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Japanese</span>
                <span>Novice</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => {
              toast({
                title: "Language Learning",
                description: "Language learning features coming soon",
              });
            }}
          >
            View Language Courses
          </Button>
        </CardFooter>
      </Card>
      
      {/* Language Selection Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "source" ? "Select Source Language" : "Select Target Language"}
            </DialogTitle>
            <DialogDescription>
              Choose the language you want to {dialogMode === "source" ? "translate from" : "translate to"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-2">
              {languages.map(language => (
                <Button
                  key={language.code}
                  variant={
                    (dialogMode === "source" && sourceLanguage === language.code) ||
                    (dialogMode === "target" && targetLanguage === language.code)
                      ? "default"
                      : "outline"
                  }
                  className="justify-start"
                  onClick={() => handleSelectLanguage(language.code)}
                >
                  <span className="text-lg mr-2">{language.flag}</span>
                  {language.name}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLanguageDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoiceTranslator;
