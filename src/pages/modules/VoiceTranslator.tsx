import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, Languages, ArrowRight, History, Bookmark, RefreshCw, Copy, Star, Upload, FileAudio, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateGeminiResponse } from "@/utils/aiHelpers";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const [targetLanguage, setTargetLanguage] = useState("bn");
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"source" | "target">("source");
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [autoPlayTranslation, setAutoPlayTranslation] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState<"audio" | "image">("audio");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { speak, stop, speaking, settings, updateSettings } = useSpeechSynthesis();
  
  // Speech recognition setup with timeout for automatic translation
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);
  const previousTranscriptRef = useRef<string>("");

  const [translationHistory, setTranslationHistory] = useState<Translation[]>([
    {
      id: "1",
      sourceText: "Hello, how are you doing today?",
      translatedText: "হ্যালো, আজ আপনি কেমন আছেন?",
      sourceLanguage: "en",
      targetLanguage: "bn",
      timestamp: "Today, 10:30 AM",
      isFavorite: true
    },
    {
      id: "2",
      sourceText: "Where is the nearest restaurant?",
      translatedText: "নিকটতম রেস্টুরেন্ট কোথায়?",
      sourceLanguage: "en",
      targetLanguage: "bn",
      timestamp: "Yesterday, 3:15 PM",
      isFavorite: false
    },
    {
      id: "3",
      sourceText: "I need to find a pharmacy.",
      translatedText: "আমার একটি ফার্মেসি খুঁজে পেতে হবে।",
      sourceLanguage: "en",
      targetLanguage: "bn",
      timestamp: "Yesterday, 11:45 AM",
      isFavorite: true
    }
  ]);

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
    { code: "bn", name: "Bengali", flag: "🇧🇩" },
    { code: "th", name: "Thai", flag: "🇹🇭" },
    { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
    { code: "tr", name: "Turkish", flag: "🇹🇷" },
  ];

  // Enhanced speech recognition with auto translation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        try {
          recognitionRef.current = new SpeechRecognitionAPI();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          
          recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join('');
            
            setSourceText(transcript);
            
            // If there's a silence detection timeout running, clear it
            if (speechTimeoutRef.current !== null) {
              clearTimeout(speechTimeoutRef.current);
            }
            
            // Set a new timeout - if no new speech is detected in 1.5 seconds, trigger translation
            speechTimeoutRef.current = window.setTimeout(() => {
              // Only translate if we have new content and user is still in listening mode
              if (transcript.trim() !== previousTranscriptRef.current.trim() && 
                  transcript.trim() !== "" && isListening) {
                previousTranscriptRef.current = transcript;
                handleTranslateClick();
                
                // Optional: stop listening after translation
                if (recognitionRef.current) {
                  recognitionRef.current.stop();
                  setIsListening(false);
                  toast({
                    title: "Voice Input Complete",
                    description: "Your speech has been recorded and translated.",
                  });
                }
              }
            }, 1500);
          };
          
          recognitionRef.current.onend = () => {
            if (isListening) {
              recognitionRef.current?.start();
            } else {
              setIsListening(false);
              // If listening manually ended and we have text, translate it
              if (sourceText.trim() !== "" && sourceText.trim() !== previousTranscriptRef.current.trim()) {
                previousTranscriptRef.current = sourceText;
                handleTranslateClick();
              }
            }
          };
          
          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
            toast({
              title: "Speech Recognition Error",
              description: `Error: ${event.error}. Please try again.`,
              variant: "destructive",
            });
          };
        } catch (error) {
          console.error('Error initializing speech recognition:', error);
          toast({
            title: "Speech Recognition Error",
            description: "Failed to initialize speech recognition. Please try a different browser.",
            variant: "destructive",
          });
        }
      } else {
        console.error('Speech Recognition API not supported in this browser');
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser does not support speech recognition.",
          variant: "destructive",
        });
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        try {
          // Only call abort if recognition is active
          if (isListening) {
            recognitionRef.current.abort();
          }
        } catch (error) {
          console.error('Error cleaning up speech recognition:', error);
        }
      }
      
      // Clear any pending timeouts
      if (speechTimeoutRef.current !== null) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }
    };
  }, [toast, isListening, sourceText]);

  // Update speech recognition language when source language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = sourceLanguage;
    }
  }, [sourceLanguage]);

  const getLanguageNameByCode = (code: string): string => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  const getLanguageFlagByCode = (code: string): string => {
    const language = languages.find(lang => lang.code === code);
    return language ? language.flag : "";
  };

  const handleListenClick = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser does not support speech recognition.",
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Voice Input Complete",
        description: "Your speech has been recorded.",
      });
    } else {
      // Reset state for new recording
      setSourceText(""); 
      previousTranscriptRef.current = "";
      setIsListening(true);
      recognitionRef.current.lang = sourceLanguage;
      try {
        recognitionRef.current.start();
        toast({
          title: "Listening",
          description: "Speak now... Translation will start after you pause speaking.",
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleTranslateClick = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter or record some text to translate.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTranslating(true);
    
    try {
      // Construct a prompt for Gemini that asks for translation
      const translationPrompt = `Translate the following text from ${getLanguageNameByCode(sourceLanguage)} to ${getLanguageNameByCode(targetLanguage)}. Only provide the translation, no explanations or additional text:\n\n"${sourceText}"`;
      
      // Call the Gemini API using our helper
      const response = await generateGeminiResponse(translationPrompt);
      
      // Check if there's an error in the response
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Extract the translation from response
      const newTranslatedText = response.text.trim();
      setTranslatedText(newTranslatedText);
      
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
      
      // Auto-play if enabled
      if (autoPlayTranslation && newTranslatedText) {
        setTimeout(() => {
          handlePlayTranslation(newTranslatedText);
        }, 500);
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation Failed",
        description: error instanceof Error ? error.message : "Failed to translate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePlayTranslation = (text: string = translatedText) => {
    if (!text) {
      toast({
        title: "No Translation",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }
    
    if (speaking) {
      stop();
      setIsPlaying(false);
      toast({
        title: "Audio Stopped",
        description: "Translation audio has been stopped.",
      });
    } else {
      speak(text);
      setIsPlaying(true);
      
      toast({
        title: "Playing Audio",
        description: `Playing translation in ${getLanguageNameByCode(targetLanguage)}`,
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
    
    navigator.clipboard.writeText(translatedText)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: "Translation has been copied to clipboard.",
        });
      })
      .catch(err => {
        console.error("Clipboard copy failed:", err);
        toast({
          title: "Copy Failed",
          description: "Failed to copy text to clipboard.",
          variant: "destructive",
        });
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

  const handleFileUpload = () => {
    setShowFileUploadDialog(true);
  };

  const processFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 95) {
            clearInterval(interval);
            return 95;
          }
          return newProgress;
        });
      }, 200);
      
      // Process the file based on type
      if (uploadType === "audio") {
        // For audio, we'd need to transcribe it first, then set as source text
        // In a real app, this would use an API for speech-to-text
        const simulatedTranscription = "This is a sample transcription from an audio file. In a production environment, this would use a speech-to-text API to extract the actual content from your audio.";
        
        setTimeout(() => {
          clearInterval(interval);
          setUploadProgress(100);
          setSourceText(simulatedTranscription);
          setShowFileUploadDialog(false);
          setIsUploading(false);
          toast({
            title: "Audio Processed",
            description: "Audio file has been transcribed.",
          });
        }, 2000);
      } else if (uploadType === "image") {
        // For images, we'd use OCR to extract text
        // In a real app, this would use an API for OCR
        const simulatedOcrText = "This is sample text extracted from an image. In a production environment, this would use an OCR service to extract the actual text content from your image.";
        
        setTimeout(() => {
          clearInterval(interval);
          setUploadProgress(100);
          setSourceText(simulatedOcrText);
          setShowFileUploadDialog(false);
          setIsUploading(false);
          toast({
            title: "Image Processed",
            description: "Text has been extracted from image.",
          });
        }, 2000);
      }
    } catch (error) {
      console.error("File processing error:", error);
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Processing Failed",
        description: "Failed to process the uploaded file.",
        variant: "destructive",
      });
    }
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
              <div className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleFileUpload}
                >
                  <Upload className="h-4 w-4" /> Upload File
                </Button>
              </div>
            
              <div className="relative">
                <Textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className="w-full h-32 p-3 resize-none bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="Enter text or press the mic button to speak..."
                />
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  className={`absolute bottom-3 right-3 rounded-full ${isListening ? 'animate-pulse' : ''}`}
                  onClick={handleListenClick}
                >
                  <Mic className={`h-4 w-4 ${isListening ? 'text-white' : ''}`} />
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
                <Textarea
                  value={translatedText}
                  readOnly
                  className="w-full h-32 p-3 resize-none bg-gray-50 dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="Translation will appear here..."
                />
                
                {translatedText && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => handleCopyTranslation()}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={speaking ? "default" : "outline"}
                      size="icon"
                      className={`rounded-full ${speaking ? 'bg-lifemate-purple text-white' : ''}`}
                      onClick={() => handlePlayTranslation()}
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
                    className="justify-start text-left"
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
                  <div 
                    className={`h-6 w-12 rounded-full cursor-pointer flex items-center transition-colors ${autoDetectLanguage ? 'bg-lifemate-purple' : 'bg-secondary'}`} 
                    onClick={() => {
                      setAutoDetectLanguage(!autoDetectLanguage);
                      toast({
                        title: "Auto-Detect",
                        description: `Auto-detect language has been ${!autoDetectLanguage ? 'enabled' : 'disabled'}`,
                      });
                    }}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white shadow-md transition-all ${autoDetectLanguage ? 'ml-auto mr-0.5' : 'ml-0.5'}`}></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Auto-Play Translation</h3>
                    <p className="text-xs text-muted-foreground">Automatically play translation audio</p>
                  </div>
                  <div 
                    className={`h-6 w-12 rounded-full cursor-pointer flex items-center transition-colors ${autoPlayTranslation ? 'bg-lifemate-purple' : 'bg-secondary'}`}
                    onClick={() => {
                      setAutoPlayTranslation(!autoPlayTranslation);
                      toast({
                        title: "Auto-Play",
                        description: `Auto-play translation has been ${!autoPlayTranslation ? 'enabled' : 'disabled'}`,
                      });
                    }}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white shadow-md transition-all ${autoPlayTranslation ? 'ml-auto mr-0.5' : 'ml-0.5'}`}></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium">Offline Mode</h3>
                    <p className="text-xs text-muted-foreground">Use offline translation when available</p>
                  </div>
                  <div 
                    className={`h-6 w-12 rounded-full cursor-pointer flex items-center transition-colors ${offlineMode ? 'bg-lifemate-purple' : 'bg-secondary'}`}
                    onClick={() => {
                      setOfflineMode(!offlineMode);
                      toast({
                        title: "Offline Mode",
                        description: `Offline mode has been ${!offlineMode ? 'enabled' : 'disabled'}`,
                      });
                    }}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white shadow-md transition-all ${offlineMode ? 'ml-auto mr-0.5' : 'ml-0.5'}`}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Voice Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs">Speaking Rate</label>
                    <Select 
                      value={settings.speed}
                      onValueChange={(value) => updateSettings({ speed: value as "slow" | "normal" | "fast" })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select speed" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs">Voice Gender</label>
                    <Select 
                      value={settings.voiceType} 
                      onValueChange={(value) => updateSettings({ voiceType: value as "female" | "male" })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white">
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
                        <p className="mt-1 text-black dark:text-white">{translation.translatedText}</p>
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
                  </
