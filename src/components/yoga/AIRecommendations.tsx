
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

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ recommendations: savedRecommendations }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [timeAvailable, setTimeAvailable] = useState('15-30 minutes');
  const [preferredTime, setPreferredTime] = useState('Morning');
  const [healthConcerns, setHealthConcerns] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<YogaRecommendation[]>(savedRecommendations || []);
  const [selectedRecommendation, setSelectedRecommendation] = useState<YogaRecommendation | null>(null);

  const { generateRecommendations, loading: aiLoading } = useGeminiYogaRecommendations();
  const { searchVideos, results: videoResults, loading: searchLoading } = useYouTubeSearch();

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
        const updatedRecommendations = await Promise.all(
          newRecommendations.map(async (rec, index) => {
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
          })
        );
        
        setRecommendations(updatedRecommendations);
        setIsDialogOpen(false);
        
        toast({
          title: "Recommendations Generated",
          description: "AI has created personalized yoga recommendations for you.",
        });
        
        // Save to localStorage (ideally this would be handled by the hook)
        localStorage.setItem('yoga-recommendations', JSON.stringify(updatedRecommendations));
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const healthConcernsList = [
    "Back pain", 
    "Stress/anxiety", 
    "Poor flexibility", 
    "Joint pain",
    "Posture issues", 
    "Insomnia", 
    "Low energy"
  ];
  
  const goalsList = [
    "Increase flexibility", 
    "Build strength", 
    "Improve balance", 
    "Reduce stress", 
    "Better sleep",
    "Weight management", 
    "Mental clarity"
  ];

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI Yoga Recommendations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Lightbulb className="h-4 w-4 mr-2" />
              Get Personalized Recommendations
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Personalized Yoga Recommendations</DialogTitle>
              <DialogDescription>
                Tell us about yourself and your preferences to get AI-powered yoga recommendations.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fitness-level">Your Yoga Experience</Label>
                  <select
                    id="fitness-level"
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Beginner">Beginner - New to yoga</option>
                    <option value="Intermediate">Intermediate - Some experience</option>
                    <option value="Advanced">Advanced - Regular practitioner</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time-available">Time Available</Label>
                  <select
                    id="time-available"
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="5-15 minutes">Quick session (5-15 minutes)</option>
                    <option value="15-30 minutes">Medium session (15-30 minutes)</option>
                    <option value="30-60 minutes">Long session (30-60 minutes)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferred-time">Preferred Time of Practice</Label>
                  <select
                    id="preferred-time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Midday">Midday</option>
                    <option value="Evening">Evening</option>
                    <option value="Before bed">Before bed</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Health Concerns (if any)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {healthConcernsList.map((concern) => (
                      <div key={concern} className="flex items-center space-x-2">
                        <Checkbox
                          id={`concern-${concern}`}
                          checked={healthConcerns.includes(concern)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setHealthConcerns([...healthConcerns, concern]);
                            } else {
                              setHealthConcerns(
                                healthConcerns.filter((item) => item !== concern)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`concern-${concern}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {concern}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Your Goals</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {goalsList.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={`goal-${goal}`}
                          checked={goals.includes(goal)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setGoals([...goals, goal]);
                            } else {
                              setGoals(goals.filter((item) => item !== goal));
                            }
                          }}
                        />
                        <label
                          htmlFor={`goal-${goal}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {goal}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                onClick={handleGenerateRecommendations}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Recommendations"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-muted-foreground mb-4">
            <Lightbulb className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get personalized yoga recommendations based on your preferences and goals.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            Get Recommendations
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="overflow-hidden">
              <div className="h-40 overflow-hidden relative">
                {recommendation.thumbnail ? (
                  <img 
                    src={recommendation.thumbnail} 
                    alt={recommendation.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <Lightbulb className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {recommendation.description}
                </p>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecommendation(recommendation)}
                >
                  View Details
                </Button>
                
                {recommendation.youtubeId && (
                  <Button
                    size="sm"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${recommendation.youtubeId}`, '_blank')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Watch Video
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Recommendation Detail Dialog */}
      <Dialog open={!!selectedRecommendation} onOpenChange={() => setSelectedRecommendation(null)}>
        {selectedRecommendation && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedRecommendation.title}</DialogTitle>
              <DialogDescription>Personalized recommendation based on your profile</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6">
              {selectedRecommendation.youtubeId && (
                <YoutubeEmbed youtubeId={selectedRecommendation.youtubeId} />
              )}
              
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {selectedRecommendation.description}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Why This is Recommended for You</h3>
                <p className="text-muted-foreground">
                  {selectedRecommendation.reason}
                </p>
              </div>
              
              <DialogFooter>
                {selectedRecommendation.youtubeId && (
                  <Button
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedRecommendation.youtubeId}`, '_blank')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                )}
              </DialogFooter>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AIRecommendations;
