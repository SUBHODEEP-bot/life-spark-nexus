
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { YogaClass, YogaPose, YogaStreak } from '@/types/yoga';
import { Clock, Play, CheckCircle, ExternalLink } from 'lucide-react';
import YoutubeEmbed from './YoutubeEmbed';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DailyPracticeProps {
  classes: YogaClass[];
  poses: YogaPose[];
  streak: YogaStreak;
  onMarkCompleted: (classId: string) => void;
}

const DailyPractice: React.FC<DailyPracticeProps> = ({ classes, poses, streak, onMarkCompleted }) => {
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);

  const handleMarkCompleted = (classId: string) => {
    onMarkCompleted(classId);
    setSelectedClass(null);
    
    toast({
      title: "Practice completed",
      description: "Great job! Your progress has been saved.",
    });
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recommended for Today</h2>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM do")}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {classes.map((yogaClass) => (
          <Card
            key={yogaClass.id}
            className={cn(
              "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md group",
              yogaClass.completedToday && "opacity-85"
            )}
            onClick={() => setSelectedClass(yogaClass)}
          >
            <div className="relative h-40 overflow-hidden">
              {yogaClass.thumbnail && (
                <img
                  src={yogaClass.thumbnail}
                  alt={yogaClass.title}
                  className="object-cover w-full h-full"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-semibold text-white">
                      {yogaClass.title}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-black/40 text-white border-white/20">
                        <Clock className="h-3 w-3 mr-1" />
                        {yogaClass.duration}
                      </Badge>
                      <Badge variant="outline" className="bg-black/40 text-white border-white/20">
                        {yogaClass.level}
                      </Badge>
                    </div>
                  </div>
                  {yogaClass.completedToday ? (
                    <Badge className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Done
                    </Badge>
                  ) : (
                    <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-4 w-4 mr-1" /> Start
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                {yogaClass.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Class details dialog */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        {selectedClass && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedClass.title}</DialogTitle>
              <DialogDescription>
                {selectedClass.level} • {selectedClass.duration}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <YoutubeEmbed youtubeId={selectedClass.youtubeId} />

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About this practice</h3>
                  <p className="text-muted-foreground">
                    {selectedClass.description}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">What you'll need</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Yoga mat</li>
                    <li>• Comfortable clothing</li>
                    <li>• Water bottle</li>
                    <li>• Optional: yoga blocks</li>
                  </ul>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold">Included poses</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {poses.map((pose) => (
                      <div
                        key={pose.id}
                        className="bg-secondary/40 rounded-md p-3 flex flex-col"
                      >
                        <div className="font-medium text-sm">{pose.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {pose.sanskritName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open(`https://www.youtube.com/watch?v=${selectedClass.youtubeId}`, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in YouTube
                </Button>

                <Button
                  onClick={() => handleMarkCompleted(selectedClass.id)}
                  disabled={selectedClass.completedToday}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {selectedClass.completedToday ? "Completed" : "Mark as Completed"}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Card className="border-lifemate-purple/30">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <span className="text-lifemate-purple">Your Progress</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">Weekly Goal (5 sessions)</p>
              <p className="text-sm text-muted-foreground">
                {classes.filter(c => c.completedToday).length}/5 completed
              </p>
            </div>
            <Progress 
              value={classes.filter(c => c.completedToday).length / 5 * 100} 
              className="h-2" 
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">Monthly Practice (minutes)</p>
              <p className="text-sm text-muted-foreground">
                {classes.filter(c => c.completedToday).reduce((total, c) => {
                  const minutes = parseInt(c.duration.split(' ')[0]);
                  return total + (isNaN(minutes) ? 0 : minutes);
                }, 0)}/300 min
              </p>
            </div>
            <Progress 
              value={classes.filter(c => c.completedToday).reduce((total, c) => {
                const minutes = parseInt(c.duration.split(' ')[0]);
                return total + (isNaN(minutes) ? 0 : minutes);
              }, 0) / 300 * 100} 
              className="h-2" 
            />
          </div>

          <div className="pt-2">
            <p className="text-sm font-medium mb-4">Last 7 Days</p>
            <div className="flex justify-between">
              {[...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dayName = format(date, "EEE");
                const isToday = i === 6;
                
                // Calculate if this day had a practice (just for demo)
                const hadPractice = i === 6 || i === 4 || i === 3 || i === 0;
                
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                        isToday && "bg-lifemate-purple text-white",
                        hadPractice && !isToday && "bg-lifemate-purple/20 text-lifemate-purple",
                        !hadPractice && !isToday && "bg-secondary text-muted-foreground"
                      )}
                    >
                      {hadPractice && <CheckCircle className="h-4 w-4" />}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DailyPractice;
