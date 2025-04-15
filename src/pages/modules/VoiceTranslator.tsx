
import ModulePlaceholder from "@/components/ModulePlaceholder";
import { Mic } from "lucide-react";

const VoiceTranslator = () => {
  return (
    <ModulePlaceholder
      title="Real-Time Voice Translator"
      description="Translate between languages in real-time with voice input and output"
      icon={Mic}
      color="text-cyan-400"
    />
  );
};

export default VoiceTranslator;
