
import { useState } from "react";
import { Award, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useYogaData } from "@/hooks/useYogaData";
import DailyPractice from "@/components/yoga/DailyPractice";
import PoseLibrary from "@/components/yoga/PoseLibrary";
import CustomRoutines from "@/components/yoga/CustomRoutines";
import AIRecommendations from "@/components/yoga/AIRecommendations";

const YogaModule = () => {
  // Get yoga data from hook
  const { 
    classes, 
    poses, 
    streak, 
    routines, 
    recommendations,
    markClassAsCompleted,
    addRoutine,
    deleteRoutine,
    updateRoutine
  } = useYogaData();

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">YOUR YOGA</h1>
        <p className="text-muted-foreground">
          Daily practice, custom routines, and guided videos
        </p>
      </header>

      {/* Stats and Streak Banner */}
      <Card className="border-lifemate-purple/30 bg-lifemate-purple/5 overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-lifemate-purple">
                {streak.currentStreak}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Day Streak</div>
              <div className="flex gap-1 mt-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 w-4 rounded-full",
                      i < streak.currentStreak % 7
                        ? "bg-lifemate-purple"
                        : "bg-lifemate-purple/30"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-lg font-medium">Level Progress</span>
              </div>
              <Progress
                value={65}
                className="h-2 w-full max-w-[180px] mt-2 bg-secondary"
              />
              <div className="text-sm text-muted-foreground mt-2">
                Beginner Level 3
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-lifemate-purple">
                {streak.totalSessions}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Total Sessions
              </div>
              <div className="text-sm mt-2">
                <Badge variant="outline" className="bg-secondary/70">
                  <Flame className="h-3 w-3 mr-1 text-orange-400" />
                  {streak.longestStreak} Day Best Streak
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily-practice" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily-practice">Daily Practice</TabsTrigger>
          <TabsTrigger value="pose-library">Pose Library</TabsTrigger>
          <TabsTrigger value="custom-routines">Custom Routines</TabsTrigger>
          <TabsTrigger value="ai-recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        {/* Daily Practice Tab */}
        <TabsContent value="daily-practice">
          <DailyPractice 
            classes={classes} 
            poses={poses} 
            streak={streak} 
            onMarkCompleted={markClassAsCompleted} 
          />
        </TabsContent>

        {/* Pose Library Tab */}
        <TabsContent value="pose-library">
          <PoseLibrary poses={poses} />
        </TabsContent>

        {/* Custom Routines Tab */}
        <TabsContent value="custom-routines">
          <CustomRoutines 
            routines={routines}
            onAddRoutine={addRoutine}
            onDeleteRoutine={deleteRoutine}
            onUpdateRoutine={updateRoutine}
          />
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="ai-recommendations">
          <AIRecommendations recommendations={recommendations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YogaModule;
