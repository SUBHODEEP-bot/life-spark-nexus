import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, Calendar, Clock, Activity, Brain, 
  Lightbulb, BookOpen, Zap, Download, Plus 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Mock data for the analytics
const mockProductivityData = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 65 },
  { day: "Wed", score: 85 },
  { day: "Thu", score: 78 },
  { day: "Fri", score: 67 },
  { day: "Sat", score: 45 },
  { day: "Sun", score: 40 },
];

const mockHabitData = [
  { name: "Exercise", adherence: 65, trend: "up" },
  { name: "Reading", adherence: 40, trend: "down" },
  { name: "Meditation", adherence: 85, trend: "up" },
  { name: "Healthy Eating", adherence: 55, trend: "stable" },
];

const mockInsights = [
  {
    title: "Peak Productivity Time",
    description: "You're most productive between 9AM-11AM. Schedule important tasks during this window.",
    icon: Clock,
  },
  {
    title: "Exercise Impact",
    description: "Days with morning exercise show 27% higher focus scores compared to other days.",
    icon: Activity,
  },
  {
    title: "Digital Distraction",
    description: "Social media usage has increased by 15% this week, possibly affecting focus.",
    icon: Brain,
  },
  {
    title: "Better Sleep Opportunity",
    description: "Going to bed 30 minutes earlier could improve your morning energy by 18%.",
    icon: Lightbulb,
  },
];

const mockGoals = [
  { name: "Read 20 books", progress: 35, category: "personal" },
  { name: "Exercise 3x weekly", progress: 66, category: "health" },
  { name: "Learn Spanish", progress: 20, category: "education" },
  { name: "Meditate daily", progress: 82, category: "wellbeing" },
];

const LifeAnalyzer = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleGenerateReport = () => {
    toast({
      title: "Generating comprehensive report",
      description: "Your personalized insights will be ready in a few moments",
    });
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Life Analyzer AI Report</h1>
        <p className="text-muted-foreground">
          Get insights into your lifestyle, habits, and productivity patterns
        </p>
      </header>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>
          
          <Button onClick={handleGenerateReport}>
            <Download className="h-4 w-4 mr-2" />
            Generate Full Report
          </Button>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-400" />
                Weekly Summary
              </CardTitle>
              <CardDescription>Your performance metrics for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary/40 p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-2">Productivity Score</div>
                  <div className="text-3xl font-bold">72%</div>
                  <div className="text-xs text-green-500 mt-1">↑ 7% from last week</div>
                </div>
                <div className="bg-secondary/40 p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-2">Habits Maintained</div>
                  <div className="text-3xl font-bold">5/8</div>
                  <div className="text-xs text-yellow-500 mt-1">Same as last week</div>
                </div>
                <div className="bg-secondary/40 p-4 rounded-md">
                  <div className="text-sm text-muted-foreground mb-2">Goal Progress</div>
                  <div className="text-3xl font-bold">48%</div>
                  <div className="text-xs text-green-500 mt-1">↑ 5% from last week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-end justify-between pt-6">
                  {mockProductivityData.map((day) => (
                    <div key={day.day} className="flex flex-col items-center gap-2">
                      <div className="text-xs text-muted-foreground">{day.score}%</div>
                      <div 
                        className="w-8 bg-indigo-500 rounded-t-md"
                        style={{ height: `${day.score * 0.5}px` }}
                      ></div>
                      <div className="text-xs">{day.day}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockInsights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-400">
                      <insight.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-400" />
                Productivity Analysis
              </CardTitle>
              <CardDescription>Detailed breakdown of your efficiency and focus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Daily Productivity</h3>
                  <div className="h-80 flex items-end justify-between pt-6">
                    {mockProductivityData.map((day) => (
                      <div key={day.day} className="flex flex-col items-center gap-2">
                        <div className="text-xs text-muted-foreground">{day.score}%</div>
                        <div 
                          className="w-12 bg-indigo-500 rounded-t-md"
                          style={{ height: `${day.score * 0.7}px` }}
                        ></div>
                        <div className="text-xs">{day.day}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Focus Sessions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Deep Work</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: "65%" }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">65%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Shallow Work</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: "35%" }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">35%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Task Completion</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: "78%" }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">78%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h4 className="text-sm font-medium">Peak Performance Hours</h4>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-400">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm">9:00 AM - 11:00 AM</p>
                        <p className="text-xs text-muted-foreground">Schedule important tasks during this window</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="text-lg font-medium mb-4">Insights & Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-secondary/40 rounded-lg">
                      <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 shrink-0">
                        <insight.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="habits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                Habit Tracking
              </CardTitle>
              <CardDescription>Your consistent behaviors and routines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Habits</h3>
                  <div className="space-y-4">
                    {mockHabitData.map((habit) => (
                      <div key={habit.name} className="bg-secondary/40 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{habit.name}</h4>
                          <Badge variant="outline" className={
                            habit.trend === "up" 
                              ? "bg-green-500/10 text-green-500 border-green-200" 
                              : habit.trend === "down" 
                                ? "bg-red-500/10 text-red-500 border-red-200"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-200"
                          }>
                            {habit.trend === "up" ? "Improving" : habit.trend === "down" ? "Declining" : "Stable"}
                          </Badge>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${habit.trend === "up" 
                              ? "bg-green-500" 
                              : habit.trend === "down" 
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`} 
                            style={{ width: `${habit.adherence}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {habit.adherence}% consistency
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Habit Insights</h3>
                  <div className="space-y-4">
                    <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-400" />
                        Habit Formation
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        You're 12 days into your "meditation" habit streak. Research suggests habits typically form after 66 days of consistent practice.
                      </p>
                    </div>
                    
                    <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        Wellness Impact
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your exercise routine has shown a 15% improvement in your overall energy levels according to your reported mood metrics.
                      </p>
                    </div>
                    
                    <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4 text-yellow-500" />
                        Habit Stacking
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Try combining your reading habit with your morning coffee to increase consistency. Linking new habits to established ones improves adherence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-indigo-400" />
                Goal Tracking
              </CardTitle>
              <CardDescription>Your progress towards personal goals and objectives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Goals</h3>
                  <div className="space-y-4">
                    {mockGoals.map((goal) => (
                      <div key={goal.name} className="bg-secondary/40 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{goal.name}</h4>
                          <Badge variant="outline" className={
                            goal.category === "health" 
                              ? "bg-red-500/10 text-red-500 border-red-200" 
                              : goal.category === "education" 
                                ? "bg-blue-500/10 text-blue-500 border-blue-200"
                                : goal.category === "wellbeing"
                                  ? "bg-green-500/10 text-green-500 border-green-200"
                                  : "bg-yellow-500/10 text-yellow-500 border-yellow-200"
                          }>
                            {goal.category}
                          </Badge>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full" 
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {goal.progress}% complete
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Goal Insights</h3>
                  <div className="space-y-4">
                    <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-indigo-400" />
                        Achievement Pace
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        At your current pace, you'll complete your "Learn Spanish" goal 2 months behind schedule. Consider allocating 15 more minutes daily.
                      </p>
                    </div>
                    
                    <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        Progress Momentum
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your "Meditate daily" goal has shown the most consistent progress. You've maintained this habit for 24 consecutive days.
                      </p>
                    </div>
                    
                    <Button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Goal
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      View Goal History
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LifeAnalyzer;
