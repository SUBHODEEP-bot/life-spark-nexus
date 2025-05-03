
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

      console.log('Sending prompt to Gemini:', prompt);
      const response = await generateGeminiResponse(prompt);
      console.log('Received response from Gemini:', response);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Extract JSON from response
      let jsonString = response.text;
      
      // Clean up the response to get valid JSON
      if (jsonString.includes('```json')) {
        jsonString = jsonString.split('```json')[1].split('```')[0].trim();
      } else if (jsonString.includes('```')) {
        jsonString = jsonString.split('```')[1].split('```')[0].trim();
      }
      
      // Further cleanup to handle common issues
      jsonString = jsonString.replace(/(\r\n|\n|\r)/gm, "");
      
      console.log('Parsed JSON string:', jsonString);
      
      try {
        const recommendations = JSON.parse(jsonString);
        console.log('Parsed recommendations:', recommendations);
        
        if (!Array.isArray(recommendations)) {
          throw new Error('Response is not an array');
        }
        
        return recommendations.map((rec: any, index: number) => ({
          id: `recommendation-${Date.now()}-${index}`,
          title: rec.title || 'Yoga Practice',
          description: rec.description || 'Custom yoga practice',
          reason: rec.reason || 'Personalized for your needs',
          youtubeSearchTerm: rec.youtubeSearchTerm || 'yoga practice',
          youtubeId: '', // Will be populated separately through YouTube search
          thumbnail: '',  // Will be populated separately through YouTube search
        }));
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        console.error('Raw JSON string:', jsonString);
        throw new Error('Failed to parse AI response');
      }
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
