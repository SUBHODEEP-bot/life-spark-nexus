
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Cake, Gift, Heart, Plus, Star, Trash2, Trophy, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Types
type CelebrationType = "birthday" | "anniversary" | "achievement" | "holiday" | "custom";
type Celebration = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: CelebrationType;
  person?: string;
};

// Sample celebrations data
const sampleCelebrations: Celebration[] = [
  {
    id: "1",
    title: "Mom's Birthday",
    description: "Don't forget to buy flowers and a cake",
    date: "2025-06-15",
    type: "birthday",
    person: "Mom"
  },
  {
    id: "2",
    title: "Wedding Anniversary",
    description: "Dinner reservation at 7pm",
    date: "2025-08-22",
    type: "anniversary",
    person: "Parents"
  },
  {
    id: "3",
    title: "Graduation",
    description: "University graduation ceremony",
    date: "2025-05-18",
    type: "achievement",
    person: "Alex"
  },
  {
    id: "4",
    title: "New Year's Eve",
    description: "Party at Mike's house",
    date: "2025-12-31",
    type: "holiday"
  },
  {
    id: "5",
    title: "Job Promotion",
    description: "Celebrate the new position",
    date: "2025-07-10",
    type: "achievement",
    person: "Sarah"
  }
];

// Form schema
const celebrationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  type: z.enum(["birthday", "anniversary", "achievement", "holiday", "custom"]),
  person: z.string().optional(),
});

const CelebrationTracker = () => {
  const [celebrations, setCelebrations] = useState<Celebration[]>(sampleCelebrations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("upcoming");

  const form = useForm<z.infer<typeof celebrationSchema>>({
    resolver: zodResolver(celebrationSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      type: "birthday",
      person: "",
    },
  });

  const handleAddCelebration = (values: z.infer<typeof celebrationSchema>) => {
    const newCelebration: Celebration = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description || "",
      date: values.date.toISOString().split('T')[0],
      type: values.type,
      person: values.person,
    };

    setCelebrations([newCelebration, ...celebrations]);
    setIsAddDialogOpen(false);
    form.reset();
    
    toast({
      title: "Celebration added",
      description: "Your celebration has been added to the tracker",
    });
  };

  const handleDelete = (id: string) => {
    setCelebrations(celebrations.filter(cele => cele.id !== id));
    toast({
      title: "Celebration removed",
      description: "The celebration has been removed from your tracker",
    });
  };

  const getIcon = (type: CelebrationType) => {
    switch (type) {
      case "birthday":
        return <Cake className="h-5 w-5" />;
      case "anniversary":
        return <Heart className="h-5 w-5" />;
      case "achievement":
        return <Trophy className="h-5 w-5" />;
      case "holiday":
        return <Gift className="h-5 w-5" />;
      case "custom":
        return <Star className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: CelebrationType) => {
    switch (type) {
      case "birthday":
        return "bg-pink-500/10 text-pink-500 border-pink-200";
      case "anniversary":
        return "bg-red-500/10 text-red-500 border-red-200";
      case "achievement":
        return "bg-amber-500/10 text-amber-500 border-amber-200";
      case "holiday":
        return "bg-green-500/10 text-green-500 border-green-200";
      case "custom":
        return "bg-purple-500/10 text-purple-500 border-purple-200";
    }
  };

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const currentDate = new Date();
    
    // Set time to midnight for proper comparison
    targetDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    // Calculate difference in milliseconds
    const diffInMs = targetDate.getTime() - currentDate.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays < 0) return `${Math.abs(diffInDays)} days ago`;
    return `in ${diffInDays} days`;
  };

  const filteredCelebrations = celebrations.filter((celebration) => {
    const celebrationDate = parseISO(celebration.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (activeTab === "upcoming") {
      return isAfter(celebrationDate, today) || format(celebrationDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    } else if (activeTab === "past") {
      return isBefore(celebrationDate, today);
    }
    return true;
  });

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Celebration Tracker</h1>
        <p className="text-muted-foreground">
          Track special moments and never miss an important celebration
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column: Celebrations list */}
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="h-5 w-5 text-pink-500" />
                  Celebrations
                </CardTitle>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Celebration
                </Button>
              </div>
              
              <div className="flex space-x-2 mt-2">
                <Button
                  variant={activeTab === "upcoming" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming
                </Button>
                <Button
                  variant={activeTab === "past" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("past")}
                >
                  Past
                </Button>
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("all")}
                >
                  All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredCelebrations.length === 0 ? (
                <div className="text-center p-6">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground mt-2">
                    No {activeTab} celebrations found
                  </p>
                  {activeTab !== "all" && (
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveTab("all")}>
                      View all celebrations
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCelebrations.map((celebration) => (
                    <Card key={celebration.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-start p-4">
                          <div className="p-2 rounded-full mr-4" style={{ backgroundColor: `var(--${celebration.type === "birthday" ? "pink" : celebration.type === "anniversary" ? "red" : celebration.type === "achievement" ? "amber" : celebration.type === "holiday" ? "green" : "purple"}-100)` }}>
                            {getIcon(celebration.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <h3 className="text-base font-medium">{celebration.title}</h3>
                                {celebration.person && (
                                  <p className="text-sm text-muted-foreground">
                                    For: {celebration.person}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getTypeColor(celebration.type)}>
                                  {celebration.type.charAt(0).toUpperCase() + celebration.type.slice(1)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDelete(celebration.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {celebration.description && (
                              <p className="text-sm mt-1 text-muted-foreground">
                                {celebration.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 mt-2">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm">{format(parseISO(celebration.date), "MMM d, yyyy")}</span>
                              <Badge variant="secondary" className="text-xs">
                                {getDaysUntil(celebration.date)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right column: Stats and upcoming highlights */}
        <div className="w-full md:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Celebration Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-secondary/40 rounded-lg p-3">
                  <div className="text-2xl font-bold">
                    {celebrations.filter(c => {
                      const celebDate = parseISO(c.date);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return isAfter(celebDate, today) || format(celebDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
                    }).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Upcoming</div>
                </div>
                <div className="bg-secondary/40 rounded-lg p-3">
                  <div className="text-2xl font-bold">
                    {celebrations.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Celebration Types</h4>
                <div className="space-y-2">
                  {["birthday", "anniversary", "achievement", "holiday", "custom"].map((type) => {
                    const count = celebrations.filter(c => c.type === type).length;
                    const percentage = celebrations.length ? Math.round((count / celebrations.length) * 100) : 0;
                    
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize">{type}s</span>
                          <span>{count}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              type === "birthday" ? "bg-pink-500" : 
                              type === "anniversary" ? "bg-red-500" : 
                              type === "achievement" ? "bg-amber-500" : 
                              type === "holiday" ? "bg-green-500" : "bg-purple-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Celebrations</CardTitle>
              <CardDescription>Coming up soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {celebrations
                .filter(c => {
                  const celebDate = parseISO(c.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return isAfter(celebDate, today) || format(celebDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 3)
                .map((celebration) => (
                  <div key={celebration.id} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      celebration.type === "birthday" ? "bg-pink-500/10" : 
                      celebration.type === "anniversary" ? "bg-red-500/10" : 
                      celebration.type === "achievement" ? "bg-amber-500/10" : 
                      celebration.type === "holiday" ? "bg-green-500/10" : "bg-purple-500/10"
                    }`}>
                      {getIcon(celebration.type)}
                    </div>
                    <div>
                      <p className="font-medium">{celebration.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(parseISO(celebration.date), "MMM d, yyyy")}</span>
                      </div>
                      {celebration.person && (
                        <p className="text-sm mt-1">For: {celebration.person}</p>
                      )}
                    </div>
                  </div>
                ))}
              
              {celebrations.filter(c => {
                const celebDate = parseISO(c.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return isAfter(celebDate, today) || format(celebDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
              }).length === 0 && (
                <div className="text-center py-6">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground mt-2">No upcoming celebrations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Celebration Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Celebration</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddCelebration)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Celebration title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add some details about this celebration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="birthday">Birthday</SelectItem>
                          <SelectItem value="anniversary">Anniversary</SelectItem>
                          <SelectItem value="achievement">Achievement</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Person (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Who is this celebration for?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Save Celebration</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CelebrationTracker;
