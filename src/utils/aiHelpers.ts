
interface AIResponse {
  text: string;
  error?: string;
}

export const generateOpenAIResponse = async (prompt: string): Promise<AIResponse> => {
  const OPENAI_API_KEY = "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";
  
  try {
    // Check if API key exists and is not an empty string
    if (!OPENAI_API_KEY) {
      return {
        text: "API key is missing. Please configure a valid OpenAI API key.",
        error: "Missing API key"
      };
    }
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Fallback to a model with potentially higher quota limits
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant that provides thoughtful, empathetic responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle quota exceeded error specifically
      if (errorData.error?.code === 'insufficient_quota') {
        return {
          text: "I apologize, but the OpenAI API quota has been exceeded. Please check your billing details on the OpenAI platform or try again later.",
          error: "API quota exceeded"
        };
      }
      
      throw new Error(errorData.error?.message || 'Failed to generate AI response');
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return {
      text: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Check if error message contains information about quota
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    if (errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('billing')) {
      return {
        text: "I apologize, but the OpenAI API quota has been exceeded. Please check your billing details on the OpenAI platform or try again later.",
        error: "API quota exceeded"
      };
    }
    
    return {
      text: "I apologize, but I'm having trouble processing your message right now. Could you please try again?",
      error: errorMsg
    };
  }
};

// Keep the old function for backward compatibility
export const generateGeminiResponse = generateOpenAIResponse;
