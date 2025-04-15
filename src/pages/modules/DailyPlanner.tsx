
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Check, Mic, Plus, Trash2, X, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { Skeleton } from "@/components/ui/skeleton";

// Task schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.date(),
  priority: z.enum(["low", "medium", "high"]),
});

const DailyPlanner = () => {
  const { user } = useAuth();
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const [isRecording, setIsRecording] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      priority: "medium",
    },
  });

  const handleSubmit = (values: z.infer<typeof taskSchema>) => {
    createTask.mutate({
      title: values.title,
      description: values.description,
      due_date: values.dueDate.toISOString(),
      priority: values.priority,
      status: 'pending',
      // The user_id will be added by the useTasks hook from the current authenticated user
    }, {
      onSuccess: () => {
        setIsAddingTask(false);
        form.reset();
      }
    });
  };

  const handleToggleTask = (id: string, completed: boolean) => {
    updateTask.mutate({
      id,
      status: completed ? 'completed' : 'pending'
    });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate(id);
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsRecording(false);
      setIsAddingTask(true);
      form.setValue("title", "Task from voice input");
      form.setValue("description", "This task was created using voice input");
      
      toast({
        title: "Voice Input Detected",
        description: "Your voice input has been processed.",
      });
    }, 2000);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return task.status !== 'completed';
    if (filter === "completed") return task.status === 'completed';
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  if (!user) {
    return (
      <div className="container max-w-5xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to use the Daily Planner</h2>
        <p className="text-muted-foreground">You need to be logged in to view and manage your tasks.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">AI Daily Planner</h1>
        <p className="text-muted-foreground">
          Organize your day, manage tasks and get AI-powered suggestions
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column: Current tasks */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsRecording(true)}
                className={cn(isRecording && "text-red-500 animate-pulse-slow")}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsAddingTask(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>
            </div>
          </div>

          {isAddingTask && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Add New Task</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsAddingTask(false);
                      form.reset();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Task title" {...field} />
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Task description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Due Date</FormLabel>
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
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit">Save Task</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border border-border/40">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="rounded-full h-5 w-5 shrink-0 mt-1" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-48 mt-1" />
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Skeleton className="h-5 w-16 rounded-md" />
                          <Skeleton className="h-5 w-16 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-secondary/40 rounded-lg border border-border/40 p-6 text-center">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className={cn(
                    "border border-border/40",
                    task.status === 'completed' && "bg-secondary/30 opacity-75"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "rounded-full h-5 w-5 p-0 shrink-0 mt-1",
                          task.status === 'completed' && "bg-lifemate-purple text-white border-lifemate-purple"
                        )}
                        onClick={() => updateTask.mutate({
                          id: task.id,
                          status: task.status === 'completed' ? 'pending' : 'completed'
                        })}
                      >
                        {task.status === 'completed' && <Check className="h-3 w-3" />}
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={cn(
                              "font-medium line-clamp-1",
                              task.status === 'completed' && "line-through text-muted-foreground"
                            )}
                          >
                            {task.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteTask.mutate(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {task.description && (
                          <p
                            className={cn(
                              "text-sm text-muted-foreground mt-1",
                              task.status === 'completed' && "line-through"
                            )}
                          >
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={getPriorityColor(task.priority)}
                          >
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </Badge>

                          <Badge variant="outline" className="bg-secondary/50">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {format(new Date(task.due_date || new Date()), "MMM d")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Stats and suggestions */}
        <div className="w-full md:w-64 lg:w-80 space-y-6">
          <Card className="bg-secondary/40">
            <CardHeader>
              <CardTitle className="text-lg">Today's Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tasks Progress</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-lifemate-purple"
                      style={{
                        width: `${
                          tasks.length > 0
                            ? Math.round(
                                (tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm">
                    {tasks.filter((t) => t.status === 'completed').length}/{tasks.length}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">Priorities</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-red-500/10 text-red-500 rounded-md px-2 py-1 text-xs">
                    {tasks.filter((t) => t.priority === "high").length} High
                  </div>
                  <div className="bg-yellow-500/10 text-yellow-500 rounded-md px-2 py-1 text-xs">
                    {tasks.filter((t) => t.priority === "medium").length} Medium
                  </div>
                  <div className="bg-green-500/10 text-green-500 rounded-md px-2 py-1 text-xs">
                    {tasks.filter((t) => t.priority === "low").length} Low
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-lifemate-purple/10 border-lifemate-purple/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">AI Suggestions</CardTitle>
              <CardDescription>Based on your schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <Clock className="h-4 w-4 text-lifemate-purple" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Focus on high priority tasks first</p>
                    <p className="text-xs text-muted-foreground">
                      You have 1 high priority task due today
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <Clock className="h-4 w-4 text-lifemate-purple" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Schedule a break after 2 hours</p>
                    <p className="text-xs text-muted-foreground">
                      To maintain productivity throughout the day
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <Clock className="h-4 w-4 text-lifemate-purple" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Your most productive hours</p>
                    <p className="text-xs text-muted-foreground">
                      10:00 AM - 12:00 PM based on your patterns
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyPlanner;
