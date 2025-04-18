
interface AIResponse {
  text: string;
  error?: string;
}

export const generateGeminiResponse = async (prompt: string): Promise<AIResponse> => {
  const GEMINI_API_KEY = "AIzaSyB4frRuhdWmCrUfyUojOTYcFJ9HQFqbhTY";
  const MODEL_NAME = "gemini-1.5-flash-latest";
  
  try {
    // Check if API key is valid
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "") {
      return {
        text: "API key is missing. Please configure a valid Gemini API key.",
        error: "Missing API key"
      };
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY  // Changed from 'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate AI response');
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return {
      text: data.candidates[0].content.parts[0].text
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      text: "I apologize, but I'm having trouble processing your message right now. Could you please try again?",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
