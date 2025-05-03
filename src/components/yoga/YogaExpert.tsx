
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { YogaExpertResponse } from '@/types/yoga';
import { useYogaExpert } from '@/hooks/useYogaExpert';
import { useYouTubeSearch } from '@/hooks/useYouTubeSearch';
import { Loader2, Search, Video } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const YogaExpert: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState<YogaExpertResponse | null>(null);
  const [videoResults, setVideoResults] = useState<Record<string, string>>({});
  
  const { getYogaAdvice, loading: expertLoading } = useYogaExpert();
  const { searchVideos, results: searchResults, loading: searchLoading } = useYouTubeSearch();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe your condition or ask a question.",
        variant: "destructive",
      });
      return;
    }
    
    // Get yoga expert advice
    const expertResponse = await getYogaAdvice(userInput);
    if (expertResponse) {
      setResponse(expertResponse);
      
      // Search for videos for each pose
      const videoSearchPromises = expertResponse.poses.map(async (pose) => {
        if (pose.youtubeSearchTerm) {
          await searchVideos(`yoga ${pose.youtubeSearchTerm}`, 1);
          if (searchResults && searchResults.length > 0) {
            return { [pose.name]: searchResults[0].id };
          }
        }
        return null;
      });
      
      const videoResultsArray = await Promise.all(videoSearchPromises);
      const combinedResults = videoResultsArray.reduce((acc, result) => {
        return result ? { ...acc, ...result } : acc;
      }, {});
      
      setVideoResults(combinedResults);
    }
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Yoga Expert AI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-input">
                Describe your health concern or ask for yoga advice
              </Label>
              <Textarea
                id="user-input"
                placeholder="e.g., I have lower back pain, what yoga poses should I do?"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="h-24"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={expertLoading || searchLoading}
            >
              {(expertLoading || searchLoading) ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Getting Advice...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Get Yoga Advice
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>{response.issue}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {response.poses.map((pose, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold text-lifemate-purple">{pose.name}</h3>
                
                <div className="space-y-2">
                  <h4 className="font-medium">How to do it:</h4>
                  <ol className="space-y-2 pl-5 list-decimal">
                    {pose.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Benefits:</h4>
                  <ul className="space-y-1 pl-5 list-disc">
                    {pose.benefits.map((benefit, benefitIdx) => (
                      <li key={benefitIdx} className="text-muted-foreground">{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                {videoResults[pose.name] && (
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${videoResults[pose.name]}`, '_blank')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Watch Tutorial
                  </Button>
                )}
                
                {index < response.poses.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-secondary/40 rounded-lg">
              <h4 className="font-medium mb-2">General Advice:</h4>
              <p className="text-muted-foreground">{response.advice}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YogaExpert;
