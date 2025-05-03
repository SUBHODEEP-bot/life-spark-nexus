import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { YogaRecommendation } from '@/types/yoga';
import { Lightbulb, Loader2, Search, Video } from 'lucide-react';
import { useGeminiYogaRecommendations } from '@/hooks/useGeminiYogaRecommendations';
import { useYouTubeSearch } from '@/hooks/useYouTubeSearch';
import { toast } from '@/hooks/use-toast';
import YoutubeEmbed from './YoutubeEmbed';
interface AIRecommendationsProps {
  recommendations: YogaRecommendation[];
}
const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations: savedRecommendations
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [timeAvailable, setTimeAvailable] = useState('15-30 minutes');
  const [preferredTime, setPreferredTime] = useState('Morning');
  const [healthConcerns, setHealthConcerns] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<YogaRecommendation[]>(savedRecommendations || []);
  const [selectedRecommendation, setSelectedRecommendation] = useState<YogaRecommendation | null>(null);
  const {
    generateRecommendations,
    loading: aiLoading
  } = useGeminiYogaRecommendations();
  const {
    searchVideos,
    results: videoResults,
    loading: searchLoading
  } = useYouTubeSearch();
  const handleGenerateRecommendations = async () => {
    try {
      const newRecommendations = await generateRecommendations({
        fitnessLevel,
        healthConcerns,
        goals,
        timeAvailable,
        preferredTimeOfDay: preferredTime
      });
      if (newRecommendations.length > 0) {
        // Find YouTube videos for each recommendation
        const updatedRecommendations = await Promise.all(newRecommendations.map(async (rec, index) => {
          await searchVideos(`yoga ${rec.title}`, 1);
          // This is a workaround since we can't easily access the results of searchVideos directly
          // In a real app, we'd refactor this to return the results
          const videoId = videoResults[0]?.id || '';
          const thumbnail = videoResults[0]?.thumbnail || '';
          return {
            ...rec,
            youtubeId: videoId,
            thumbnail
          };
        }));
        setRecommendations(updatedRecommendations);
        setIsDialogOpen(false);
        toast({
          title: "Recommendations Generated",
          description: "AI has created personalized yoga recommendations for you."
        });

        // Save to localStorage (ideally this would be handled by the hook)
        localStorage.setItem('yoga-recommendations', JSON.stringify(updatedRecommendations));
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };
  const healthConcernsList = ["Back pain", "Stress/anxiety", "Poor flexibility", "Joint pain", "Posture issues", "Insomnia", "Low energy"];
  const goalsList = ["Increase flexibility", "Build strength", "Improve balance", "Reduce stress", "Better sleep", "Weight management", "Mental clarity"];
  return;
};
export default AIRecommendations;