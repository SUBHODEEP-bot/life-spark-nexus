
import { useState } from 'react';
import { generateGeminiResponse } from '@/utils/aiHelpers';
import { YogaRecommendation } from '@/types/yoga';

export const useGeminiYogaRecommendations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async (
    userPreferences: {
      fitnessLevel: string;
      healthConcerns?: string[];
      goals?: string[];
      timeAvailable: string;
      preferredTimeOfDay?: string;
    }
  ): Promise<YogaRecommendation[]> => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `
        As a yoga expert, please recommend 3 different yoga practices for a person with the following profile:
        - Fitness level: ${userPreferences.fitnessLevel}
        - Health concerns: ${userPreferences.healthConcerns?.join(', ') || 'None specified'}
        - Goals: ${userPreferences.goals?.join(', ') || 'General wellness'}
        - Time available: ${userPreferences.timeAvailable}
        - Preferred time of day: ${userPreferences.preferredTimeOfDay || 'Any time'}

        For each recommendation, provide:
        1. A title for the yoga practice
        2. A short description (under 100 words)
        3. A clear reason why this practice is good for this person
        4. YouTube search terms to find a video for this practice

        Format your response in JSON like this:
        [
          {
            "title": "Practice Title",
            "description": "Practice description",
            "reason": "Reason this practice is recommended",
            "youtubeSearchTerm": "search term for YouTube"
          }
        ]

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

      const recommendations = JSON.parse(jsonString);
      
      return recommendations.map((rec: any, index: number) => ({
        id: `recommendation-${Date.now()}-${index}`,
        title: rec.title,
        description: rec.description,
        reason: rec.reason,
        youtubeId: '', // Will be populated separately through YouTube search
        thumbnail: '',  // Will be populated separately through YouTube search
      }));
    } catch (err) {
      console.error('Error generating yoga recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { generateRecommendations, loading, error };
};
