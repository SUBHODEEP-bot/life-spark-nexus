
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Bell, Clock, Calendar, CheckSquare, Trash2, PlusCircle, 
  ArrowRight, Sparkles, Zap, Settings, RotateCw, Brain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Mock data for reminders
const mockReminders = [
  { 
    id: 1, 
    title: "Team meeting", 
    description: "Weekly project status update", 
    date: "2025-04-17", 
    time: "14:00", 
    priority: "high", 
    category: "work", 
    status: "pending" 
  },
  { 
    id: 2, 
    title: "Pick up dry cleaning", 
    description: "Ticket #45692", 
    date: "2025-04-17", 
    time: "17:30", 
    priority: "medium", 
    category: "personal", 
    status: "pending" 
  },
  { 
    id: 3, 
    title: "Call mom", 
    description: "Birthday wishes", 
    date: "2025-04-18", 
    time: "18:00", 
    priority: "medium", 
    category: "personal", 
    status: "pending" 
  },
  { 
    id: 4, 
    title: "Pay electricity bill", 
    description: "$87.45 due", 
    date: "2025-04-19", 
    time: "00:00", 
    priority: "high", 
    category: "finance", 
    status: "pending" 
  },
  { 
    id: 5, 
    title: "Grocery shopping", 
    description: "Get milk, eggs, bread", 
    date: "2025-04-16", 
    time: "10:00", 
    priority: "low", 
    category: "household", 
    status: "completed" 
  },
];

// AI suggestions for tasks
const mockAISuggestions = [
  { 
    id: 101, 
    title: "Schedule dentist appointment", 
    description: "Based on your calendar, it's been 6 months since your last checkup", 
    confidence: "high", 
    source: "calendar" 
  },
  { 
    id: 102, 
    title: "Renew passport", 
    description: "Your passport expires in 3 months based on your document records", 
    confidence: "medium", 
    source: "documents" 
  },
  { 
    id: 103, 
    title: "Car maintenance", 
    description: "Your vehicle is due for service based on your last maintenance record", 
    confidence: "high", 
    source: "maintenance" 
  },
];

const TaskReminder = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [reminders, setReminders] = useState(mockReminders);
  const [suggestions, setSuggestions] = useState(mockAISuggestions);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    priority: "medium",
    category: "personal"
  });
  const { toast } = useToast();

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.date || !newReminder.time) {
      toast({
        title: "Missing information",
        description: "Please enter title, date and time for your reminder",
        variant: "destructive"
      });
      return;
    }

    const reminder = {
      id: Date.now(),
      ...newReminder,
      status: "pending"
    };

    setReminders([reminder, ...reminders]);
    setIsAddingReminder(false);
    setNewReminder({
      title: "",
      description: "",
      date: "",
      time: "",
      priority: "medium",
      category: "personal"
    });

    toast({
      title: "Reminder added",
      description: "Your reminder has been scheduled"
    });
  };

  const handleToggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, status: reminder.status === "pending" ? "completed" : "pending" } 
        : reminder
    ));
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder deleted",
      description: "Your reminder has been removed"
    });
  };

  const handleAcceptSuggestion = (suggestion) => {
    const newTask = {
      id: Date.now(),
      title: suggestion.title,
      description: suggestion.description,
      date: new Date().toISOString().split('T')[0],
      time: "12:00",
      priority: "medium",
      category: "ai-suggested",
      status: "pending"
    };

    setReminders([newTask, ...reminders]);
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));

    toast({
      title: "Suggestion accepted",
      description: "The suggested task has been added to your reminders"
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-200";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-200";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "work":
        return "bg-blue-500/10 text-blue-500 border-blue-200";
      case "personal":
        return "bg-purple-500/10 text-purple-500 border-purple-200";
      case "finance":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-200";
      case "household":
        return "bg-orange-500/10 text-orange-500 border-orange-200";
      case "ai-suggested":
        return "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-200";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Task Reminder & Suggestion AI</h1>
        <p className="text-muted-foreground">
          Smart reminders that adapt to your habits and routines
        </p>
      </header>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <Button onClick={() => setIsAddingReminder(true)} className="bg-fuchsia-600 hover:bg-fuchsia-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Reminder
          </Button>
        </div>
        
        <TabsContent value="upcoming" className="space-y-6">
          {isAddingReminder && (
            <Card className="border-fuchsia-500/30 bg-fuchsia-500/5">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Add New Reminder</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsAddingReminder(false)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input 
                      id="title" 
                      placeholder="What do you need to remember?" 
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description (optional)
                    </label>
                    <Textarea 
                      id="description" 
                      placeholder="Add more details..." 
                      rows={2}
                      value={newReminder.description}
                      onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 gap-2">
                      <label htmlFor="date" className="text-sm font-medium">
                        Date
                      </label>
                      <Input 
                        id="date" 
                        type="date"
                        value={newReminder.date}
                        onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <label htmlFor="time" className="text-sm font-medium">
                        Time
                      </label>
                      <Input 
                        id="time" 
                        type="time"
                        value={newReminder.time}
                        onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 gap-2">
                      <label htmlFor="priority" className="text-sm font-medium">
                        Priority
                      </label>
                      <Select 
                        value={newReminder.priority}
                        onValueChange={(value) => setNewReminder({...newReminder, priority: value})}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <Select 
                        value={newReminder.category}
                        onValueChange={(value) => setNewReminder({...newReminder, category: value})}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="household">Household</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-fuchsia-600 hover:bg-fuchsia-700" onClick={handleAddReminder}>
                    <Bell className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Today</h2>
            <div className="space-y-3">
              {reminders.filter(
                r => r.date === new Date().toISOString().split('T')[0] && r.status === "pending"
              ).map(reminder => (
                <Card key={reminder.id} className="bg-fuchsia-500/5 border-fuchsia-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className={`rounded-full h-5 w-5 p-0 ${reminder.status === "completed" ? "bg-fuchsia-500 text-white border-fuchsia-500" : "border-fuchsia-500/50"}`}
                          onClick={() => handleToggleReminder(reminder.id)}
                        >
                          {reminder.status === "completed" && (
                            <CheckSquare className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`font-medium ${reminder.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                            {reminder.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteReminder(reminder.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {reminder.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {reminder.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {reminder.time}
                          </Badge>
                          
                          <Badge variant="outline" className={getPriorityColor(reminder.priority)}>
                            {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                          </Badge>
                          
                          <Badge variant="outline" className={getCategoryColor(reminder.category)}>
                            {reminder.category.charAt(0).toUpperCase() + reminder.category.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {!reminders.some(r => r.date === new Date().toISOString().split('T')[0] && r.status === "pending") && (
                <div className="bg-secondary/40 rounded-lg border border-border/40 p-4 text-center">
                  <p className="text-muted-foreground">No reminders for today</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Upcoming</h2>
            <div className="space-y-3">
              {reminders.filter(
                r => new Date(r.date) > new Date(new Date().toISOString().split('T')[0]) && r.status === "pending"
              ).map(reminder => (
                <Card key={reminder.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-5 w-5 p-0 border-fuchsia-500/50"
                          onClick={() => handleToggleReminder(reminder.id)}
                        >
                          {reminder.status === "completed" && (
                            <CheckSquare className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium">{reminder.title}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteReminder(reminder.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {reminder.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {reminder.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(reminder.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Badge>
                          
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {reminder.time}
                          </Badge>
                          
                          <Badge variant="outline" className={getPriorityColor(reminder.priority)}>
                            {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                          </Badge>
                          
                          <Badge variant="outline" className={getCategoryColor(reminder.category)}>
                            {reminder.category.charAt(0).toUpperCase() + reminder.category.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {!reminders.some(r => new Date(r.date) > new Date(new Date().toISOString().split('T')[0]) && r.status === "pending") && (
                <div className="bg-secondary/40 rounded-lg border border-border/40 p-4 text-center">
                  <p className="text-muted-foreground">No upcoming reminders</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          <div className="space-y-3">
            {reminders.filter(r => r.status === "completed").map(reminder => (
              <Card key={reminder.id} className="bg-secondary/30 opacity-80">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-5 w-5 p-0 bg-fuchsia-500 text-white border-fuchsia-500"
                        onClick={() => handleToggleReminder(reminder.id)}
                      >
                        <CheckSquare className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium line-through text-muted-foreground">
                          {reminder.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {reminder.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-through">
                          {reminder.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(reminder.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Badge>
                        
                        <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {reminder.time}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {!reminders.some(r => r.status === "completed") && (
              <div className="bg-secondary/40 rounded-lg border border-border/40 p-6 text-center">
                <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
                <p className="text-muted-foreground mt-2">No completed tasks yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="suggestions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-fuchsia-400" />
                AI-Suggested Tasks
              </CardTitle>
              <CardDescription>
                Based on your habits, calendar events, and past activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map(suggestion => (
                    <div key={suggestion.id} className="flex items-start gap-4 p-4 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-lg">
                      <div className="p-2 bg-fuchsia-500/10 text-fuchsia-500 rounded-md">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{suggestion.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline" className={
                            suggestion.confidence === "high" 
                              ? "bg-green-500/10 text-green-500 border-green-200" 
                              : suggestion.confidence === "medium"
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-200"
                                : "bg-red-500/10 text-red-500 border-red-200"
                          }>
                            {suggestion.confidence.charAt(0).toUpperCase() + suggestion.confidence.slice(1)} confidence
                          </Badge>
                          <Button size="sm" onClick={() => handleAcceptSuggestion(suggestion)}>
                            Accept <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Sparkles className="h-12 w-12 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground mt-4">No suggestions available at the moment</p>
                  <p className="text-sm text-muted-foreground">Check back later as our AI analyzes your patterns</p>
                  <Button className="mt-4" variant="outline" onClick={() => toast({ title: "Generating suggestions", description: "AI is analyzing your patterns and will provide suggestions soon" })}>
                    <RotateCw className="h-4 w-4 mr-2" />
                    Generate New Suggestions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-fuchsia-400" />
                How AI Generates Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Calendar Analysis</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI analyzes your calendar patterns to identify recurring events, missed appointments, and upcoming deadlines that might require reminders.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Habit Recognition</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your daily routines and habits are analyzed to suggest tasks at optimal times based on when you're most productive or likely to complete them.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Task Completion Patterns</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI learns from your completed tasks to better predict what types of tasks you prioritize and when you typically complete them.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-fuchsia-400" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Default Notification Time</h4>
                    <p className="text-sm text-muted-foreground">When to send reminders before the scheduled time</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                      <SelectItem value="120">2 hours before</SelectItem>
                      <SelectItem value="1440">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Notification Sound</h4>
                    <p className="text-sm text-muted-foreground">Sound alert for reminders</p>
                  </div>
                  <Select defaultValue="chime">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select sound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chime">Gentle Chime</SelectItem>
                      <SelectItem value="bell">Bell</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h4 className="text-base font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive important reminders via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Repeat Notifications</h4>
                    <p className="text-sm text-muted-foreground">Repeat until the task is marked as done</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-fuchsia-400" />
                AI Suggestion Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Enable AI Suggestions</h4>
                    <p className="text-sm text-muted-foreground">Allow AI to suggest tasks based on your patterns</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Suggestion Frequency</h4>
                    <p className="text-sm text-muted-foreground">How often to generate new suggestions</p>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Calendar Integration</h4>
                    <p className="text-sm text-muted-foreground">Allow AI to analyze your calendar events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Location-based Suggestions</h4>
                    <p className="text-sm text-muted-foreground">Suggest tasks based on your location</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-fuchsia-400" />
                Other Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Default Priority</h4>
                    <p className="text-sm text-muted-foreground">Default priority for new tasks</p>
                  </div>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Default Category</h4>
                    <p className="text-sm text-muted-foreground">Default category for new tasks</p>
                  </div>
                  <Select defaultValue="personal">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="household">Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Dark Mode Scheduling</h4>
                    <p className="text-sm text-muted-foreground">Auto-switch between light/dark mode</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium">Data Backup</h4>
                    <p className="text-sm text-muted-foreground">Automatically back up your tasks</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Export Reminder Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskReminder;
