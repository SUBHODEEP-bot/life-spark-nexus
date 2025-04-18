
interface AIResponse {
  text: string;
  error?: string;
}

export const generateGeminiResponse = async (prompt: string): Promise<AIResponse> => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer AIzaSyB4frRuhdWmCrUfyUojOTYcFJ9HQFqbhTY`
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
      throw new Error('Failed to generate AI response');
    }

    const data = await response.json();
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
