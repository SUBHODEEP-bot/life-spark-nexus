
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
    setHealthConcerns(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };
  
  const handleToggleGoal = (value: string) => {
    setGoals(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
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
        const updatedRecommendationsPromises = newRecommendations.map(async rec => {
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
  
  // Fix: Return JSX instead of void
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Yoga Recommendations</h2>
          <p className="text-muted-foreground">
            Get personalized yoga routines based on your needs and goals
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lifemate-purple hover:bg-lifemate-purple/90">
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Recommendations
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Yoga Recommendations</DialogTitle>
              <DialogDescription>
                Tell us about your preferences and needs to get personalized recommendations.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Fitness Level</Label>
                <div className="flex gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <Button 
                      key={level}
                      type="button"
                      variant={fitnessLevel === level ? "default" : "outline"}
                      onClick={() => setFitnessLevel(level)}
                      className={fitnessLevel === level ? "bg-lifemate-purple hover:bg-lifemate-purple/90" : ""}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Time Available</Label>
                <div className="flex gap-2">
                  {["5-15 minutes", "15-30 minutes", "30-60 minutes"].map((time) => (
                    <Button 
                      key={time}
                      type="button"
                      variant={timeAvailable === time ? "default" : "outline"}
                      onClick={() => setTimeAvailable(time)}
                      className={timeAvailable === time ? "bg-lifemate-purple hover:bg-lifemate-purple/90" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Time of Day</Label>
                <div className="flex gap-2">
                  {["Morning", "Afternoon", "Evening", "Before Bed"].map((time) => (
                    <Button 
                      key={time}
                      type="button"
                      variant={preferredTime === time ? "default" : "outline"}
                      onClick={() => setPreferredTime(time)}
                      className={preferredTime === time ? "bg-lifemate-purple hover:bg-lifemate-purple/90" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Health Concerns (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {healthConcernsList.map((concern) => (
                    <div key={concern} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`concern-${concern}`} 
                        checked={healthConcerns.includes(concern)}
                        onCheckedChange={() => handleToggleHealthConcern(concern)}
                      />
                      <Label htmlFor={`concern-${concern}`} className="text-sm font-normal">
                        {concern}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Goals (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {goalsList.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`goal-${goal}`} 
                        checked={goals.includes(goal)}
                        onCheckedChange={() => handleToggleGoal(goal)}
                      />
                      <Label htmlFor={`goal-${goal}`} className="text-sm font-normal">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleGenerateRecommendations} 
                disabled={aiLoading}
                className="bg-lifemate-purple hover:bg-lifemate-purple/90"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="overflow-hidden">
              {recommendation.thumbnail && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={recommendation.thumbnail} 
                    alt={recommendation.title} 
                    className="w-full h-full object-cover"
                  />
                  {recommendation.youtubeId && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        className="bg-white text-red-600 hover:bg-red-100"
                        onClick={() => setSelectedRecommendation(recommendation)}
                      >
                        <Youtube className="mr-2 h-4 w-4" />
                        Watch Video
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <CardHeader>
                <CardTitle>{recommendation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{recommendation.description}</p>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Benefits:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {recommendation.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recommended for:</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-lifemate-purple/10 text-lifemate-purple text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-lifemate-purple hover:bg-lifemate-purple/90"
                  onClick={() => setSelectedRecommendation(recommendation)}
                >
                  <Video className="mr-2 h-4 w-4" />
                  View Routine
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Lightbulb className="h-16 w-16 text-lifemate-purple/30 mb-4" />
          <h3 className="text-xl font-medium">No recommendations yet</h3>
          <p className="text-muted-foreground mb-6">
            Generate personalized recommendations based on your preferences
          </p>
          <Button 
            className="bg-lifemate-purple hover:bg-lifemate-purple/90"
            onClick={() => setIsDialogOpen(true)}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Generate Recommendations
          </Button>
        </div>
      )}
      
      <Dialog open={!!selectedRecommendation} onOpenChange={(isOpen) => !isOpen && setSelectedRecommendation(null)}>
        <DialogContent className="max-w-4xl">
          {selectedRecommendation && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRecommendation.title}</DialogTitle>
                <DialogDescription>
                  {selectedRecommendation.description}
                </DialogDescription>
              </DialogHeader>
              
              {selectedRecommendation.youtubeId && (
                <div className="aspect-video overflow-hidden rounded-md">
                  <YoutubeEmbed videoId={selectedRecommendation.youtubeId} />
                </div>
              )}
              
              <div className="grid gap-4 py-4">
                <div>
                  <h4 className="text-lg font-medium mb-2">Routine Details</h4>
                  <p className="text-muted-foreground">{selectedRecommendation.instructions}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {selectedRecommendation.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recommended for:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecommendation.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-lifemate-purple/10 text-lifemate-purple text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIRecommendations;
