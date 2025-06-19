
interface GeminiResponse {
  text: string;
  error?: string;
}

export const generateGeminiResponse = async (prompt: string): Promise<GeminiResponse> => {
  const apiKey = 'AIzaSyAxTmaNTs0N9OHkFgbw2XEZOmalMW3al7A';
  const model = 'gemini-1.5-flash-latest';
  
  try {
    console.log("Calling Gemini API for:", prompt.substring(0, 100) + "...");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const generatedText = data.candidates[0].content.parts[0].text;
      return { text: generatedText };
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      text: "I apologize, but I'm having trouble processing your request right now. Could you please try again?",
      error: errorMsg
    };
  }
};
