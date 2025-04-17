
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Users, CalendarDays, CheckSquare, MapPin, Bell, PlusCircle,
  UserPlus, MessageSquare, Settings, RefreshCw, Clock, Shield,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

// Mock data
const familyMembers = [
  { id: 1, name: "Alex Chen", role: "Parent", avatar: "AC", status: "active", location: "Home" },
  { id: 2, name: "Jamie Chen", role: "Parent", avatar: "JC", status: "active", location: "Office" },
  { id: 3, name: "Sam Chen", role: "Child", avatar: "SC", status: "away", location: "School" },
  { id: 4, name: "Taylor Chen", role: "Child", avatar: "TC", status: "offline", location: "Unknown" },
];

const familyEvents = [
  { id: 1, title: "Sam's Soccer Practice", date: "2025-04-18 16:00", assigned: ["Sam Chen"], location: "City Sports Park" },
  { id: 2, title: "Family Dinner", date: "2025-04-18 19:30", assigned: ["All"], location: "Home" },
  { id: 3, title: "Taylor's Doctor Appointment", date: "2025-04-19 10:15", assigned: ["Taylor Chen", "Jamie Chen"], location: "Medical Center" },
  { id: 4, title: "Grocery Shopping", date: "2025-04-20 14:00", assigned: ["Alex Chen"], location: "Supermarket" },
];

const familyTasks = [
  { id: 1, title: "Take out the trash", assigned: "Sam Chen", dueDate: "2025-04-17", status: "completed" },
  { id: 2, title: "Clean the kitchen", assigned: "Alex Chen", dueDate: "2025-04-17", status: "pending" },
  { id: 3, title: "Pick up dry cleaning", assigned: "Jamie Chen", dueDate: "2025-04-18", status: "pending" },
  { id: 4, title: "Homework help", assigned: "Jamie Chen", dueDate: "2025-04-17", status: "pending" },
];

const locationUpdates = [
  { id: 1, name: "Sam Chen", time: "15:30", location: "Leaving School", coordinates: "34.052235, -118.243683" },
  { id: 2, name: "Jamie Chen", time: "14:45", location: "At Office", coordinates: "34.043567, -118.267254" },
  { id: 3, name: "Alex Chen", time: "13:20", location: "Grocery Store", coordinates: "34.061210, -118.293891" },
];

const FamilySync = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  const handleRefreshLocation = () => {
    toast({
      title: "Refreshing locations",
      description: "Family member locations are being updated",
    });
  };

  const handleAddMember = () => {
    toast({
      title: "Invite sent",
      description: "Invitation email has been sent to the new family member",
    });
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Family Sync System</h1>
        <p className="text-muted-foreground">
          Share calendars, tasks, and location with family members
        </p>
      </header>

      <Tabs defaultValue="dashboard" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Family Members
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={handleAddMember}>
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.avatar}`} />
                          <AvatarFallback>{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={
                            member.status === "active" ? "bg-green-500/10 text-green-500 border-green-200" :
                            member.status === "away" ? "bg-yellow-500/10 text-yellow-500 border-yellow-200" :
                            "bg-secondary text-muted-foreground"
                          }
                        >
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-400" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="flex items-start gap-4 p-3 bg-secondary/40 rounded-lg">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <p className="text-xs text-muted-foreground">{event.location}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {event.assigned.map((person, idx) => (
                            person === "All" ? (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                Everyone
                              </Badge>
                            ) : (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {person}
                              </Badge>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View Full Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-blue-400" />
                  Family Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {familyTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          task.status === "completed" 
                            ? "bg-blue-500 border-blue-500" 
                            : "border-blue-500/50 bg-transparent"
                        }`}>
                          {task.status === "completed" && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                          <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              Assigned to: {task.assigned}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              Due: {task.dueDate}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    Current Locations
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={handleRefreshLocation}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {familyMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.avatar}`} />
                          <AvatarFallback>{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {member.location}
                      </Badge>
                    </div>
                  ))}

                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg mt-4">
                    <p className="text-sm text-center">
                      <span className="font-medium">Safety Tip:</span> Location sharing helps keep your family connected in case of emergency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-500">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Sam left the school zone</h4>
                      <p className="text-sm text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-full text-blue-500">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Jamie added 'Doctor Appointment' to the calendar</h4>
                      <p className="text-sm text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500/20 rounded-full text-green-500">
                      <CheckSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Sam completed 'Take out the trash'</h4>
                      <p className="text-sm text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-400" />
                Family Calendar
              </CardTitle>
              <CardDescription>
                Shared calendar for all family members
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-7 gap-px bg-border">
                {[...Array(35)].map((_, i) => {
                  const day = i - 3; // Start with previous month
                  const isCurrentMonth = day > 0 && day <= 30;
                  const isToday = day === 17; // Assuming today is the 17th
                  
                  return (
                    <div
                      key={i}
                      className={`min-h-24 p-2 ${
                        isCurrentMonth 
                          ? isToday
                            ? "bg-blue-500/10"
                            : "bg-secondary/40" 
                          : "bg-secondary/20 text-muted-foreground"
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">
                        {day > 0 ? (day <= 30 ? day : day - 30) : 31 + day}
                      </div>
                      
                      {/* Events for specific days */}
                      {isCurrentMonth && day === 18 && (
                        <div className="space-y-1">
                          <div className="text-xs p-1 rounded bg-blue-500/20 text-blue-700 truncate">
                            Soccer Practice (4pm)
                          </div>
                          <div className="text-xs p-1 rounded bg-purple-500/20 text-purple-700 truncate">
                            Family Dinner (7:30pm)
                          </div>
                        </div>
                      )}
                      
                      {isCurrentMonth && day === 19 && (
                        <div className="space-y-1">
                          <div className="text-xs p-1 rounded bg-red-500/20 text-red-700 truncate">
                            Doctor (10:15am)
                          </div>
                        </div>
                      )}
                      
                      {isCurrentMonth && day === 20 && (
                        <div className="space-y-1">
                          <div className="text-xs p-1 rounded bg-green-500/20 text-green-700 truncate">
                            Grocery (2pm)
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyEvents.map(event => (
                    <div key={event.id} className="flex items-start gap-4 p-3 bg-secondary/40 rounded-lg">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                          <p className="text-xs text-muted-foreground">{event.location}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {event.assigned.map((person, idx) => (
                            person === "All" ? (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                Everyone
                              </Badge>
                            ) : (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {person}
                              </Badge>
                            )
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Calendar Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Visible Calendars</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="cal-family" className="mr-2" defaultChecked />
                      <label htmlFor="cal-family" className="text-sm">Family Events</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cal-school" className="mr-2" defaultChecked />
                      <label htmlFor="cal-school" className="text-sm">School Activities</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cal-work" className="mr-2" defaultChecked />
                      <label htmlFor="cal-work" className="text-sm">Work Schedule</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cal-personal" className="mr-2" defaultChecked />
                      <label htmlFor="cal-personal" className="text-sm">Personal Appointments</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Notification Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-day" className="mr-2" defaultChecked />
                      <label htmlFor="notify-day" className="text-sm">Day before event</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-hour" className="mr-2" defaultChecked />
                      <label htmlFor="notify-hour" className="text-sm">1 hour before event</label>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-blue-400" />
                      Family Tasks
                    </CardTitle>
                    <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Today</h3>
                    <div className="space-y-3">
                      {familyTasks.filter(task => task.dueDate === "2025-04-17").map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              task.status === "completed" 
                                ? "bg-blue-500 border-blue-500" 
                                : "border-blue-500/50 bg-transparent"
                            }`}>
                              {task.status === "completed" && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <div>
                              <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">
                                  Assigned to: {task.assigned}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Upcoming</h3>
                    <div className="space-y-3">
                      {familyTasks.filter(task => task.dueDate !== "2025-04-17").map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-blue-500/50 bg-transparent">
                            </div>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">
                                  Assigned to: {task.assigned}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  Due: {task.dueDate}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Task Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {familyMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between bg-secondary/40 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.avatar}`} />
                            <AvatarFallback>{member.avatar}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                        <Badge variant="outline">
                          {familyTasks.filter(task => task.assigned === member.name).length} tasks
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-blue-400" />
                      Task Rotation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Enable weekly task rotation to automatically redistribute chores among family members
                    </p>
                    <div className="mt-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium">Auto-rotate tasks</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Task Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <h4 className="font-medium">Weekly Chores</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Set of 5 recurring household tasks
                    </p>
                    <Button variant="outline" className="w-full mt-2 text-sm">
                      Apply Template
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <h4 className="font-medium">School Preparation</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tasks for school week preparation
                    </p>
                    <Button variant="outline" className="w-full mt-2 text-sm">
                      Apply Template
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <h4 className="font-medium">Weekend Cleanup</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Deep cleaning tasks for weekends
                    </p>
                    <Button variant="outline" className="w-full mt-2 text-sm">
                      Apply Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  Family Location Map
                </CardTitle>
                <Button variant="outline" onClick={handleRefreshLocation}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Simulated map display */}
              <div className="relative bg-secondary/50 rounded-lg overflow-hidden" style={{ height: "400px" }}>
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Interactive map would display here with family member locations
                </div>
                
                {/* Family member location markers - simulated */}
                <div className="absolute top-[30%] left-[40%] p-2 bg-blue-500 rounded-full border-2 border-white">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=AC" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="absolute top-[50%] left-[65%] p-2 bg-blue-500 rounded-full border-2 border-white">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=JC" />
                    <AvatarFallback>JC</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="absolute top-[70%] left-[30%] p-2 bg-yellow-500 rounded-full border-2 border-white">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=SC" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="absolute top-[40%] right-[20%] p-2 bg-secondary rounded-full border-2 border-white">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=TC" />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="absolute bottom-4 left-4 p-2 bg-secondary/80 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">Away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="text-xs">Offline</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Location Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationUpdates.map((update, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-secondary/40 rounded-lg">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{update.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <p className="text-xs text-muted-foreground">{update.time}</p>
                          <p className="text-xs font-medium text-blue-500">{update.location}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Coordinates: {update.coordinates}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Location Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Safe Zones</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-secondary/40 rounded-lg">
                      <span className="text-sm">Home</span>
                      <Badge variant="outline">500m radius</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary/40 rounded-lg">
                      <span className="text-sm">School</span>
                      <Badge variant="outline">750m radius</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary/40 rounded-lg">
                      <span className="text-sm">Office</span>
                      <Badge variant="outline">300m radius</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Safe Zone
                  </Button>
                </div>
                
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium mb-2">Location Sharing</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Share my location</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Location history (30 days)</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Notify on zone entry/exit</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-lg">
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    Privacy Information
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Location data is only shared with family members and is not used for advertising or shared with third parties.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-400" />
                Family Settings
              </CardTitle>
              <CardDescription>
                Manage family members and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-4">Family Members</h3>
                <div className="space-y-4">
                  {familyMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.avatar}`} />
                          <AvatarFallback>{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button className="w-full" onClick={handleAddMember}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Family Member
                  </Button>
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <h3 className="text-base font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Task reminders</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Calendar events</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Location alerts</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Weekly summary</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <h3 className="text-base font-medium mb-4">Privacy & Security</h3>
                <div className="space-y-4">
                  <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-lg">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      Data Privacy
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your family data is encrypted and stored securely. We never share your information with third parties.
                    </p>
                    <Button variant="link" className="text-blue-500 p-0 h-auto mt-2">
                      View Privacy Policy
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
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

export default FamilySync;
