
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, Clock, Calendar, PlusCircle, Brain, Zap, 
  Circle, RotateCw, User, BarChart3, AlarmCheck, Timer, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for scheduled tasks and activities
const mockScheduledItems = [
  { 
    id: 1, 
    title: "Morning Exercise", 
    description: "30 min cardio workout", 
    time: "07:00", 
    duration: 30, 
    category: "health", 
    status: "completed",
    optimized: true 
  },
  { 
    id: 2, 
    title: "Team Meeting", 
    description: "Weekly project review", 
    time: "10:00", 
    duration: 60, 
    category: "work", 
    status: "in-progress",
    optimized: true 
  },
  { 
    id: 3, 
    title: "Lunch Break", 
    description: "Healthy meal prep", 
    time: "12:30", 
    duration: 45, 
    category: "personal", 
    status: "pending",
    optimized: true 
  },
  { 
    id: 4, 
    title: "Client Call", 
    description: "Discuss project requirements", 
    time: "14:00", 
    duration: 30, 
    category: "work", 
    status: "pending",
    optimized: false 
  },
  { 
    id: 5, 
    title: "Focus Work", 
    description: "Complete project proposal", 
    time: "15:00", 
    duration: 90, 
    category: "work", 
    status: "pending",
    optimized: true 
  },
  { 
    id: 6, 
    title: "Grocery Shopping", 
    description: "Pick up items for dinner", 
    time: "17:30", 
    duration: 45, 
    category: "personal", 
    status: "pending",
    optimized: false 
  },
  { 
    id: 7, 
    title: "Reading", 
    description: "Continue current book", 
    time: "20:00", 
    duration: 45, 
    category: "personal", 
    status: "pending",
    optimized: true 
  }
];

// AI optimization suggestions
const mockOptimizationSuggestions = [
  {
    id: 101,
    title: "Reschedule Client Call",
    description: "Your focus is typically better in the morning. Consider moving your client call from 2:00 PM to 9:00 AM tomorrow.",
    benefit: "Improved focus and engagement",
    difficulty: "easy"
  },
  {
    id: 102,
    title: "Batch Similar Tasks",
    description: "Group email responses and communication tasks together during 11:30 AM - 12:00 PM instead of throughout the day.",
    benefit: "15% time savings through reduced context switching",
    difficulty: "medium"
  },
  {
    id: 103,
    title: "Add Break After Meeting",
    description: "Schedule a 15-minute break after your 10:00 AM team meeting to process information before moving to your next task.",
    benefit: "Improved information retention and reduced stress",
    difficulty: "easy"
  }
];

// Productivity metrics
const productivityMetrics = {
  focusTime: 4.5,
  taskCompletion: 68,
  deepWorkBlocks: 3,
  contextSwitching: 14
};

const LifeScheduler = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [schedule, setSchedule] = useState(mockScheduledItems);
  const [suggestions, setSuggestions] = useState(mockOptimizationSuggestions);
  const { toast } = useToast();

  const handleMarkComplete = (id: number) => {
    setSchedule(schedule.map(item => 
      item.id === id 
        ? { ...item, status: "completed" } 
        : item
    ));
    
    toast({
      title: "Task completed",
      description: "Your schedule has been updated"
    });
  };

  const getCurrentActivity = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeNumeric = currentHour + (currentMinute / 60);
    
    // For demo purposes, let's assume the current time is 10:30 AM to show the team meeting as in-progress
    const fakeCurrentTime = 10.5;
    
    for (const item of schedule) {
      const [hours, minutes] = item.time.split(':').map(Number);
      const startTimeNumeric = hours + (minutes / 60);
      const endTimeNumeric = startTimeNumeric + (item.duration / 60);
      
      // Using fake time for demo
      if (fakeCurrentTime >= startTimeNumeric && fakeCurrentTime < endTimeNumeric) {
        return item;
      }
    }
    
    return null;
  };

  const currentActivity = getCurrentActivity();

  const handleApplySuggestion = (id: number) => {
    toast({
      title: "Suggestion applied",
      description: "Your schedule has been optimized"
    });
    
    setSuggestions(suggestions.filter(suggestion => suggestion.id !== id));
  };

  const optimizationScore = 85;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-blue-500/10 text-blue-500 border-blue-200";
      case "personal":
        return "bg-purple-500/10 text-purple-500 border-purple-200";
      case "health":
        return "bg-green-500/10 text-green-500 border-green-200";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-200";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-200";
      case "pending":
        return "bg-secondary text-muted-foreground";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Auto Life Scheduler</h1>
        <p className="text-muted-foreground">
          AI-powered scheduling suggestions and time management
        </p>
      </header>

      {currentActivity && (
        <Card className="bg-sky-500/5 border-sky-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-sky-500/10">
                    <Clock className="h-5 w-5 text-sky-500" />
                  </div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium mr-2">Currently Active</h3>
                    <Badge
                      variant="outline" 
                      className="bg-blue-500/10 text-blue-500 border-blue-200"
                    >
                      In Progress
                    </Badge>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mt-1">{currentActivity.title}</h2>
                <p className="text-muted-foreground">{currentActivity.description}</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{currentActivity.duration} minutes</span>
                </div>
                <Button 
                  className="bg-sky-600 hover:bg-sky-700"
                  onClick={() => handleMarkComplete(currentActivity.id)}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="today" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="optimize">AI Optimize</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <Button className="bg-sky-600 hover:bg-sky-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
        
        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-sky-500" />
                    Daily Schedule
                  </CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {schedule.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-start gap-4 p-3 rounded-lg ${
                        item.status === "in-progress" 
                          ? "bg-blue-500/5 border border-blue-500/20" 
                          : item.status === "completed"
                            ? "bg-secondary/30 opacity-75" 
                            : "bg-secondary/40"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <span className="text-base font-medium">{item.time}</span>
                        <span className="text-xs text-muted-foreground">{item.duration}m</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h4 className={`font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getCategoryColor(item.category)}>
                              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(item.status)}>
                              {item.status === "completed" 
                                ? "Completed" 
                                : item.status === "in-progress" 
                                  ? "In Progress" 
                                  : "Pending"}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className={`text-sm ${item.status === "completed" ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
                          {item.description}
                        </p>
                        
                        {item.optimized && (
                          <div className="flex items-center gap-1 mt-2">
                            <Brain className="h-3 w-3 text-purple-500" />
                            <span className="text-xs text-purple-500">AI optimized</span>
                          </div>
                        )}
                        
                        {item.status === "pending" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => handleMarkComplete(item.id)}
                          >
                            <CheckSquare className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Schedule Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Optimization Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={optimizationScore} className="w-16 h-2" />
                      <span className="text-sm font-medium">{optimizationScore}%</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 pb-2">
                    <h4 className="text-sm font-medium mb-3">Time Allocation</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Work</span>
                          <span>3h</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: "50%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Personal</span>
                          <span>2.5h</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500" 
                            style={{ width: "40%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Health</span>
                          <span>0.5h</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: "10%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-3">Status</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-secondary/40 p-3 rounded-lg">
                        <div className="text-xl font-bold">{schedule.filter(item => item.status === "completed").length}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                      <div className="bg-secondary/40 p-3 rounded-lg">
                        <div className="text-xl font-bold">{schedule.filter(item => item.status === "in-progress").length}</div>
                        <div className="text-xs text-muted-foreground">In Progress</div>
                      </div>
                      <div className="bg-secondary/40 p-3 rounded-lg">
                        <div className="text-xl font-bold">{schedule.filter(item => item.status === "pending").length}</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <RotateCw className="h-4 w-4 mr-2" />
                    Refresh Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="optimize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-sky-500" />
                AI Schedule Optimization
              </CardTitle>
              <CardDescription>
                Personalized suggestions to improve your productivity and well-being
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      Optimization Score
                    </h3>
                    <p className="text-muted-foreground">
                      Your schedule is 85% optimized for productivity and well-being
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full border-4 border-sky-500 flex items-center justify-center">
                      <span className="text-2xl font-bold">85%</span>
                    </div>
                    <Button className="bg-sky-600 hover:bg-sky-700">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Re-analyze
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Suggested Improvements</h3>
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 bg-secondary/40 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base font-medium">{suggestion.title}</h4>
                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                            Benefit: {suggestion.benefit}
                          </Badge>
                          <Badge variant="outline" className={
                            suggestion.difficulty === "easy" 
                              ? "bg-green-500/10 text-green-500 border-green-200" 
                              : suggestion.difficulty === "medium"
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-200"
                                : "bg-red-500/10 text-red-500 border-red-200"
                          }>
                            {suggestion.difficulty.charAt(0).toUpperCase() + suggestion.difficulty.slice(1)} change
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setSuggestions(suggestions.filter(s => s.id !== suggestion.id))}
                        >
                          Dismiss
                        </Button>
                        <Button 
                          className="bg-sky-600 hover:bg-sky-700" 
                          onClick={() => handleApplySuggestion(suggestion.id)}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {suggestions.length === 0 && (
                  <div className="p-8 bg-secondary/40 rounded-lg text-center">
                    <Zap className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
                    <p className="mt-4 text-muted-foreground">All suggestions have been applied or dismissed</p>
                    <Button className="mt-4" variant="outline">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Generate New Suggestions
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Optimization Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-secondary/40 rounded-lg">
                    <div className="p-2 rounded-full bg-blue-500/10 w-fit">
                      <Brain className="h-5 w-5 text-blue-500" />
                    </div>
                    <h4 className="text-base font-medium mt-2">Deep Work Detection</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Identifies optimal time blocks for focused work based on your productivity patterns
                    </p>
                  </div>
                  
                  <div className="p-4 bg-secondary/40 rounded-lg">
                    <div className="p-2 rounded-full bg-purple-500/10 w-fit">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                    </div>
                    <h4 className="text-base font-medium mt-2">Energy Analysis</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Schedules tasks based on your natural energy levels throughout the day
                    </p>
                  </div>
                  
                  <div className="p-4 bg-secondary/40 rounded-lg">
                    <div className="p-2 rounded-full bg-green-500/10 w-fit">
                      <AlarmCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <h4 className="text-base font-medium mt-2">Break Optimization</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Strategically places breaks to maximize productivity and prevent burnout
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-sky-500" />
                Productivity Insights
              </CardTitle>
              <CardDescription>
                Analytics and patterns from your scheduling behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-secondary/40 rounded-lg">
                  <p className="text-sm text-muted-foreground">Focus Time</p>
                  <div className="flex items-center gap-1">
                    <h3 className="text-2xl font-bold">{productivityMetrics.focusTime}</h3>
                    <span className="text-xs text-muted-foreground">hours</span>
                  </div>
                  <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-200">
                    +12% vs. last week
                  </Badge>
                </div>
                
                <div className="p-4 bg-secondary/40 rounded-lg">
                  <p className="text-sm text-muted-foreground">Task Completion</p>
                  <div className="flex items-center gap-1">
                    <h3 className="text-2xl font-bold">{productivityMetrics.taskCompletion}%</h3>
                  </div>
                  <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-200">
                    +5% vs. last week
                  </Badge>
                </div>
                
                <div className="p-4 bg-secondary/40 rounded-lg">
                  <p className="text-sm text-muted-foreground">Deep Work Blocks</p>
                  <div className="flex items-center gap-1">
                    <h3 className="text-2xl font-bold">{productivityMetrics.deepWorkBlocks}</h3>
                    <span className="text-xs text-muted-foreground">blocks</span>
                  </div>
                  <Badge variant="outline" className="mt-2 bg-yellow-500/10 text-yellow-500 border-yellow-200">
                    Same as last week
                  </Badge>
                </div>
                
                <div className="p-4 bg-secondary/40 rounded-lg">
                  <p className="text-sm text-muted-foreground">Context Switches</p>
                  <div className="flex items-center gap-1">
                    <h3 className="text-2xl font-bold">{productivityMetrics.contextSwitching}</h3>
                    <span className="text-xs text-muted-foreground">times</span>
                  </div>
                  <Badge variant="outline" className="mt-2 bg-red-500/10 text-red-500 border-red-200">
                    +3 vs. last week
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Weekly Productivity Pattern</h3>
                  <div className="h-60 flex items-end justify-between">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                      // Mock data for chart
                      const heights = [70, 85, 65, 80, 75, 45, 40];
                      return (
                        <div key={day} className="flex flex-col items-center gap-2">
                          <div className="text-xs text-muted-foreground">{heights[i]}%</div>
                          <div 
                            className={`w-10 rounded-t-md ${i === 2 ? "bg-red-500" : "bg-sky-500"}`}
                            style={{ height: `${heights[i] * 0.5}px` }}
                          ></div>
                          <div className="text-xs">{day}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="text-sm flex items-center gap-2">
                      <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                      <span>Wednesday shows a productivity dip. Consider rescheduling complex tasks to other days.</span>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-secondary/40 p-4 rounded-lg">
                    <h3 className="text-base font-medium mb-4">Optimal Working Hours</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Morning (8AM-12PM)</span>
                          <span>High Focus</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Early Afternoon (12PM-3PM)</span>
                          <span>Medium Focus</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Late Afternoon (3PM-6PM)</span>
                          <span>High Focus</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Evening (6PM-10PM)</span>
                          <span>Low Focus</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Based on your past 30 days of activity and productivity metrics
                    </p>
                  </div>
                  
                  <div className="bg-secondary/40 p-4 rounded-lg">
                    <h3 className="text-base font-medium mb-4">Task Completion by Category</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Work</span>
                          <span>80%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: "80%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Personal</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Health</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                      <p className="text-sm">
                        Health-related tasks have the lowest completion rate. Consider scheduling these earlier in the day.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-sky-500" />
                Personalization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-4">Scheduler Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">AI Optimization</p>
                      <p className="text-xs text-muted-foreground">Allow AI to optimize your schedule</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Automatic Rescheduling</p>
                      <p className="text-xs text-muted-foreground">Automatically reschedule missed tasks</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Break Scheduling</p>
                      <p className="text-xs text-muted-foreground">Automatically add breaks between tasks</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive notifications for scheduled activities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-base font-medium mb-4">Working Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Time</label>
                    <Select defaultValue="08:00">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">End Time</label>
                    <Select defaultValue="18:00">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium">Working Days</label>
                  <div className="grid grid-cols-7 gap-2 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                      <div 
                        key={day} 
                        className={`p-2 text-center rounded-md border text-xs ${
                          index < 5 
                            ? "bg-sky-500/10 border-sky-500/20 text-sky-700" 
                            : "bg-secondary/20 border-border/40 text-muted-foreground"
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h3 className="text-base font-medium mb-4">Productivity Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Preferred Task Duration</label>
                    <Select defaultValue="45">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Break Duration</label>
                    <Select defaultValue="15">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Focus Duration Before Break</label>
                    <Select defaultValue="90">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 minutes</SelectItem>
                        <SelectItem value="50">50 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button className="w-full bg-sky-600 hover:bg-sky-700">
                  Save Settings
                </Button>
                <Button variant="outline" className="w-full">
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LifeScheduler;
