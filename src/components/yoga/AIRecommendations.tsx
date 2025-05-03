
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { YogaRecommendation } from '@/types/yoga';
import { Lightbulb, Loader2, Search, Video, Youtube } from 'lucide-react';
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
  
  const handleToggleHealthConcern = (value: string) => {
    setHealthConcerns(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleToggleGoal = (value: string) => {
    setGoals(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleGenerateRecommendations = async () => {
    try {
      const newRecommendations = await generateRecommendations({
        fitnessLevel,
        healthConcerns,
        goals,
        timeAvailable,
        preferredTimeOfDay: preferredTime
      });
      
      if (newRecommendations && newRecommendations.length > 0) {
        // Find YouTube videos for each recommendation
        const updatedRecommendationsPromises = newRecommendations.map(async (rec) => {
          try {
            await searchVideos(`yoga ${rec.title}`, 1);
            // Wait a moment for results to populate
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (videoResults && videoResults.length > 0) {
              return {
                ...rec,
                youtubeId: videoResults[0]?.id || '',
                thumbnail: videoResults[0]?.thumbnail || ''
              };
            }
            return rec;
          } catch (error) {
            console.error("Error searching YouTube for recommendation:", error);
            return rec;
          }
        });

        const updatedRecommendations = await Promise.all(updatedRecommendationsPromises);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personalized Recommendations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lifemate-purple hover:bg-lifemate-purple/80">
              <Lightbulb className="h-4 w-4 mr-2" />
              Get New Recommendations
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Get Personalized Yoga Recommendations</DialogTitle>
              <DialogDescription>
                Tell us about your preferences and we'll use AI to suggest perfect yoga routines for you.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fitness-level">Your Fitness Level</Label>
                <select
                  id="fitness-level"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="time-available">Time Available</Label>
                <select
                  id="time-available"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={timeAvailable}
                  onChange={(e) => setTimeAvailable(e.target.value)}
                >
                  <option>5-15 minutes</option>
                  <option>15-30 minutes</option>
                  <option>30-60 minutes</option>
                  <option>60+ minutes</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="preferred-time">Preferred Time of Day</Label>
                <select
                  id="preferred-time"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                >
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Before bed</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label>Health Concerns (optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {healthConcernsList.map((concern) => (
                    <div className="flex items-center space-x-2" key={concern}>
                      <Checkbox 
                        id={`concern-${concern}`} 
                        checked={healthConcerns.includes(concern)}
                        onCheckedChange={() => handleToggleHealthConcern(concern)}
                      />
                      <label 
                        htmlFor={`concern-${concern}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {concern}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Your Goals (optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {goalsList.map((goal) => (
                    <div className="flex items-center space-x-2" key={goal}>
                      <Checkbox 
                        id={`goal-${goal}`} 
                        checked={goals.includes(goal)}
                        onCheckedChange={() => handleToggleGoal(goal)}
                      />
                      <label 
                        htmlFor={`goal-${goal}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {goal}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateRecommendations} 
                disabled={aiLoading}
                className="bg-lifemate-purple hover:bg-lifemate-purple/80"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Recommendations
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {recommendations && recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((recommendation) => (
            <Card 
              key={recommendation.id} 
              className="overflow-hidden hover:shadow-md transition-all duration-300"
              onClick={() => setSelectedRecommendation(recommendation)}
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                {recommendation.thumbnail ? (
                  <img 
                    src={recommendation.thumbnail} 
                    alt={recommendation.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-secondary/30">
                    <Lightbulb className="h-12 w-12 text-muted-foreground opacity-40" />
                  </div>
                )}
                {recommendation.youtubeId && (
                  <div className="absolute top-2 right-2">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-7 px-2 bg-red-600 text-white hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.youtube.com/watch?v=${recommendation.youtubeId}`, '_blank');
                      }}
                    >
                      <Youtube className="h-3 w-3 mr-1" /> 
                      YouTube
                    </Button>
                  </div>
                )}
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {recommendation.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {recommendation.reason && <span>Recommended because: {recommendation.reason}</span>}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-10 text-center bg-secondary/30">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
          <p className="text-muted-foreground mb-6">
            Tell us about your preferences, and we'll generate personalized yoga recommendations for you.
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="bg-lifemate-purple hover:bg-lifemate-purple/80"
          >
            Get Started
          </Button>
        </Card>
      )}

      {/* Recommendation Details Dialog */}
      <Dialog open={!!selectedRecommendation} onOpenChange={() => setSelectedRecommendation(null)}>
        {selectedRecommendation && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedRecommendation.title}</DialogTitle>
              <DialogDescription>
                {selectedRecommendation.reason && (
                  <span>Recommended because: {selectedRecommendation.reason}</span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedRecommendation.youtubeId ? (
                <YoutubeEmbed youtubeId={selectedRecommendation.youtubeId} />
              ) : (
                <div className="aspect-video bg-secondary/30 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">No video available</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {selectedRecommendation.description}
                </p>
              </div>
              
              <div className="flex justify-end">
                {selectedRecommendation.youtubeId && (
                  <Button 
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedRecommendation.youtubeId}`, '_blank')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AIRecommendations;
