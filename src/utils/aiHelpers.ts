
interface AIResponse {
  text: string;
  error?: string;
}

export const generateGeminiResponse = async (prompt: string): Promise<AIResponse> => {
  const GEMINI_API_KEY = "AIzaSyB4frRuhdWmCrUfyUojOTYcFJ9HQFqbhTY";
  const MODEL = "gemini-1.5-flash-latest";
  
  try {
    if (!GEMINI_API_KEY) {
      return {
        text: "API key is missing. Please configure a valid Gemini API key.",
        error: "Missing API key"
      };
    }
    
    console.log("Sending request to Gemini API with prompt:", prompt.substring(0, 100) + "...");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2, // Lower temperature for more accurate translations
          maxOutputTokens: 1024,
        },
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle quota exceeded error specifically
      if (errorData.error?.status === 'RESOURCE_EXHAUSTED') {
        return {
          text: "I apologize, but the Gemini API quota has been exceeded. Please check your billing details or try again later.",
          error: "API quota exceeded"
        };
      }
      
      throw new Error(errorData.error?.message || 'Failed to generate AI response');
    }

    const data = await response.json();
    console.log("Received response from Gemini API:", data);
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return {
      text: data.candidates[0].content.parts[0].text
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Check if error message contains information about quota
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    if (errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('limit')) {
      return {
        text: "I apologize, but the Gemini API quota has been exceeded. Please check your billing details or try again later.",
        error: "API quota exceeded"
      };
    }
    
    return {
      text: "I apologize, but I'm having trouble processing your message right now. Could you please try again?",
      error: errorMsg
    };
  }
};

// Specialized function for translations
export const translateText = async (text: string, sourceLanguage: string, targetLanguage: string): Promise<AIResponse> => {
  const translationPrompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only provide the translation, no explanations:
  
  "${text}"`;
  
  return generateGeminiResponse(translationPrompt);
};

// Add support for image-to-text when available (using Gemini's multimodal capabilities)
export const extractTextFromImage = async (imageBase64: string): Promise<AIResponse> => {
  // Note: This is a placeholder - in a real app, you would use Gemini's multimodal API
  // to extract text from images, or another OCR service
  return {
    text: "Image-to-text extraction is not yet implemented. This would use Gemini's vision capabilities in a production environment.",
    error: "Not implemented"
  };
};

// Function for audio transcription (placeholder)
export const transcribeAudio = async (audioBase64: string): Promise<AIResponse> => {
  // Note: This is a placeholder - in a real app, you would use a speech-to-text service
  return {
    text: "Audio transcription is not yet implemented. This would use a speech-to-text service in a production environment.",
    error: "Not implemented"
  };
};

// Make OpenAI function use Gemini for backward compatibility
export const generateOpenAIResponse = generateGeminiResponse;
