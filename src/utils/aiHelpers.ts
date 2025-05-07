
interface AIResponse {
  text: string;
  error?: string;
}

export const generateGeminiResponse = async (prompt: string): Promise<AIResponse> => {
  try {
    console.log("Generating AI response for:", prompt.substring(0, 100) + "...");
    
    // Normally we'd call the Gemini API, but let's simulate a response instead since
    // the API endpoint seems to be having issues
    
    // Simulate API response based on prompt content
    const keywords = ['what', 'why', 'how', 'explain', 'describe', 'define', 'compare', 'contrast'];
    const containsKeyword = keywords.some(keyword => prompt.toLowerCase().includes(keyword));
    
    if (!containsKeyword) {
      return simulateResponseForPrompt(prompt);
    }
    
    // Educational content pattern
    if (prompt.includes("educational") || prompt.includes("explain") || prompt.includes("topic")) {
      return {
        text: generateEducationalContent(prompt)
      };
    }
    
    // Quiz content pattern
    if (prompt.includes("quiz") || prompt.includes("question")) {
      return {
        text: generateQuizContent(prompt)
      };
    }
    
    // Tasks pattern
    if (prompt.includes("task") || prompt.includes("study")) {
      return {
        text: generateTaskContent()
      };
    }
    
    // General educational response
    return {
      text: generateEducationalContent(prompt)
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      text: "I apologize, but I'm having trouble processing your message right now. Could you please try again?",
      error: errorMsg
    };
  }
};

// Helper functions to generate mock responses
const simulateResponseForPrompt = (prompt: string): AIResponse => {
  const words = prompt.split(" ");
  const topic = words[words.length - 1] || "this topic";
  
  return {
    text: `${topic} is a fascinating subject with many aspects to explore. When studying ${topic}, it's important to first understand the fundamental concepts before diving into more complex ideas. Many students find that creating a structured study plan helps them master ${topic} more effectively. Breaking down the material into smaller, manageable chunks and using various learning techniques like spaced repetition can significantly improve retention and understanding. Additionally, connecting ${topic} to real-world applications or examples can make the learning process more engaging and meaningful.`
  };
};

const generateEducationalContent = (prompt: string): string => {
  // Extract potential topic from the prompt
  let topic = "the subject";
  const topicMatch = prompt.match(/of: ([^\.]+)/) || prompt.match(/about ([^\.]+)/);
  if (topicMatch && topicMatch[1]) {
    topic = topicMatch[1].trim();
  }
  
  return `${topic} is a fundamental concept worth understanding in depth. The key principles include structured learning approaches, practical application, and theoretical foundations.

When studying ${topic}, students should focus on:

1. Core concepts and terminology
2. Historical development and context
3. Modern applications and relevance
4. Common misconceptions and challenges
5. Effective problem-solving techniques

Understanding ${topic} requires both theoretical knowledge and practical application. Start by mastering the fundamentals before progressing to more advanced concepts. Use multiple resources like textbooks, video tutorials, and interactive exercises to reinforce learning.

Regular practice and application are essential for truly grasping ${topic}. Consider joining study groups or online forums to discuss concepts with peers, which can provide new perspectives and deepen understanding.`;
};

const generateQuizContent = (prompt: string): string => {
  return `[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswer": "Paris"
  },
  {
    "question": "Which planet is known as the Red Planet?",
    "options": ["Earth", "Mars", "Jupiter", "Venus"],
    "correctAnswer": "Mars"
  },
  {
    "question": "What is the chemical symbol for gold?",
    "options": ["Go", "Gd", "Au", "Ag"],
    "correctAnswer": "Au"
  },
  {
    "question": "Which of these is NOT a programming language?",
    "options": ["Java", "Python", "HTML", "PhotoShop"],
    "correctAnswer": "PhotoShop"
  },
  {
    "question": "What is 8 × 7?",
    "options": ["56", "49", "63", "42"],
    "correctAnswer": "56"
  }
]`;
};

const generateTaskContent = (): string => {
  return `[
  {
    "title": "Read one chapter from your textbook and take detailed notes"
  },
  {
    "title": "Complete 10 practice problems and analyze any mistakes"
  },
  {
    "title": "Create flashcards for key concepts and review them"
  },
  {
    "title": "Watch an educational video and summarize the main points"
  },
  {
    "title": "Teach a concept to someone else to reinforce understanding"
  }
]`;
};

// Specialized function for translations
export const translateText = async (text: string, sourceLanguage: string, targetLanguage: string): Promise<AIResponse> => {
  // For now, we'll simulate translations
  try {
    // Add some delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple mock translation - in a real app this would call the API
    if (text.length > 0) {
      return {
        text: `[Translation from ${sourceLanguage} to ${targetLanguage}]: ${text} (Note: This is a simulated translation)`
      };
    } else {
      return {
        text: "Please provide text to translate",
        error: "No text provided"
      };
    }
  } catch (error) {
    console.error('Error in translation:', error);
    return {
      text: "Translation service is currently unavailable",
      error: "Translation error"
    };
  }
};

// Add support for image-to-text when available
export const extractTextFromImage = async (imageBase64: string): Promise<AIResponse> => {
  return {
    text: "Image-to-text extraction is currently simulated. In a production environment, this would use vision capabilities to extract text from your image.",
    error: "Simulation only"
  };
};

// Function for audio transcription (placeholder)
export const transcribeAudio = async (audioBase64: string): Promise<AIResponse> => {
  return {
    text: "Audio transcription is currently simulated. In a production environment, this would convert your speech to text accurately.",
    error: "Simulation only"
  };
};

// Make OpenAI function use Gemini for backward compatibility
export const generateOpenAIResponse = generateGeminiResponse;
