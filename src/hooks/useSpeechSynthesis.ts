
import { useState, useEffect, useCallback } from 'react';
import { getVoiceSettings, saveVoiceSettings } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';

export type VoiceStyle = 'detailed' | 'concise';
export type VoiceSpeed = 'slow' | 'normal' | 'fast';
export type VoiceType = 'male' | 'female';

export interface VoiceSettings {
  style: VoiceStyle;
  speed: VoiceSpeed;
  voiceType: VoiceType;
}

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings>({
    style: 'detailed',
    speed: 'normal',
    voiceType: 'female'
  });
  const { toast } = useToast();

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    // Load initial voices
    loadVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Load saved settings
    try {
      const savedSettings = getVoiceSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading voice settings:', error);
      // Use defaults if there's an error
    }
    
    // Clean up speech synthesis on unmount
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Select appropriate voice based on settings
  const getVoice = useCallback(() => {
    if (voices.length === 0) return null;
    
    // Filter by gender keywords
    const genderKeywords = settings.voiceType === 'female' 
      ? ['female', 'woman', 'girl'] 
      : ['male', 'man', 'boy'];
    
    // Try to find a voice matching the gender and that's in English
    const matchingVoices = voices.filter(voice => 
      voice.lang.startsWith('en') && 
      genderKeywords.some(keyword => 
        voice.name.toLowerCase().includes(keyword)
      )
    );
    
    // If we found matching voices, return the first one
    if (matchingVoices.length > 0) {
      return matchingVoices[0];
    }
    
    // If no matching gender voice, just get any English voice
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
    if (englishVoices.length > 0) {
      return englishVoices[0];
    }
    
    // Fall back to the first available voice
    return voices[0];
  }, [voices, settings.voiceType]);

  // Speak text
  const speak = useCallback((text: string) => {
    if (!text) return;
    
    try {
      // Cancel any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice
      const selectedVoice = getVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Set speech rate based on speed setting
      switch (settings.speed) {
        case 'slow':
          utterance.rate = 0.8;
          break;
        case 'normal':
          utterance.rate = 1.0;
          break;
        case 'fast':
          utterance.rate = 1.2;
          break;
      }
      
      // Events for tracking speaking state
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (event) => {
        setSpeaking(false);
        console.error("Speech synthesis error:", event.error);
        toast({
          title: 'Speech Error',
          description: `There was an error with the speech synthesis: ${event.error}`,
          variant: 'destructive'
        });
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      toast({
        title: 'Speech Error',
        description: 'Failed to initialize speech synthesis',
        variant: 'destructive'
      });
    }
  }, [settings.speed, getVoice, toast]);

  // Stop speaking
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        saveVoiceSettings(updated);
      } catch (error) {
        console.error('Error saving voice settings:', error);
      }
      return updated;
    });
  }, []);

  return {
    speak,
    stop,
    speaking,
    settings,
    updateSettings,
    voices
  };
};
