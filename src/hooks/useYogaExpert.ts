
import { useState } from 'react';
import { generateGeminiResponse } from '@/utils/aiHelpers';
import { YogaExpertResponse } from '@/types/yoga';

export const useYogaExpert = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getYogaAdvice = async (userInput: string): Promise<YogaExpertResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `
        You are a professional yoga expert AI. Your task is to understand the user's health-related problems, questions, or conditions and suggest the most suitable yoga poses and helpful advice.
        
        The user says: "${userInput}"
        
        Please provide a response with the following structure:
        1. Mention the issue or condition (e.g., back pain, stress, headache).
        2. Recommend 2–3 suitable yoga poses for the issue.
        3. For each pose, explain step-by-step how to do it in simple language.
        4. Mention the benefits of each yoga pose.
        5. Suggest a search term for YouTube for each yoga pose.
        6. Provide some general advice for the condition.
        
        Format your response in JSON like this:
        {
          "issue": "The main issue identified",
          "poses": [
            {
              "name": "Pose name",
              "steps": ["Step 1", "Step 2", "Step 3"],
              "benefits": ["Benefit 1", "Benefit 2"],
              "youtubeSearchTerm": "search term for YouTube"
            }
          ],
          "advice": "General advice for the condition"
        }
        
        Only return the valid JSON, no introductory or explanatory text.
      `;

      const response = await generateGeminiResponse(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Extract JSON from response
      let jsonString = response.text;
      if (jsonString.includes('```json')) {
        jsonString = jsonString.split('```json')[1].split('```')[0].trim();
      } else if (jsonString.includes('```')) {
        jsonString = jsonString.split('```')[1].split('```')[0].trim();
      }

      return JSON.parse(jsonString);
    } catch (err) {
      console.error('Error getting yoga expert advice:', err);
      setError(err instanceof Error ? err.message : 'Failed to get yoga expert advice');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getYogaAdvice, loading, error };
};
