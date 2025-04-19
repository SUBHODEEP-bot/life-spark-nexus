
import { useState } from "react";
import { format } from "date-fns";
import { Activity, Award, Calendar, CheckCircle, Clock, Play, Flame, Info, Video, Plus, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface YogaClass {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "20 min"
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail?: string;
  youtubeId: string;
  completedToday: boolean;
}

interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  benefits: string[];
  image?: string;
  youtubeId?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface YogaStreak {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  lastPracticeDate: Date;
}

const YoutubeEmbed = ({ youtubeId }: { youtubeId: string }) => {
  return (
    <div className="aspect-video w-full">
      <iframe
        className="w-full h-full rounded-md"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const YogaModule = () => {
  // Sample data
  const [classes, setClasses] = useState<YogaClass[]>([
    {
      id: "1",
      title: "Morning Flow",
      description: "Start your day with energizing yoga flow to awaken body and mind",
      duration: "20 min",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
      youtubeId: "J9VnPbdqQ4Q", // 20 Minute Morning Yoga Flow
      completedToday: false,
    },
    {
      id: "2",
      title: "Evening Relaxation",
      description: "Wind down with gentle stretches and relaxing poses for better sleep",
      duration: "15 min",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7",
      youtubeId: "v7AYKMP6rOE", // Yoga For Bedtime
      completedToday: false,
    },
    {
      id: "3",
      title: "Core Strengthening",
      description: "Focus on building core strength with challenging yoga poses",
      duration: "30 min",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b",
      youtubeId: "apXlxPaMNnM", // Core Yoga Workout
      completedToday: false,
    },
    {
      id: "4",
      title: "Balance Practice",
      description: "Improve your balance and concentration with these focused poses",
      duration: "25 min",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      youtubeId: "iEVnN2R0_vg", // Yoga For Balance
      completedToday: true,
    },
  ]);

  const [poses, setPoses] = useState<YogaPose[]>([
    {
      id: "1",
      name: "Downward-Facing Dog",
      sanskritName: "Adho Mukha Svanasana",
      description: "This pose stretches the hamstrings, shoulders, calves, arches, hands, and spine while building strength in the arms, shoulders, and legs.",
      benefits: ["Energizes the body", "Stretches shoulders, hamstrings, calves", "Strengthens arms and legs"],
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      youtubeId: "YqOqM79McYY",
      level: "Beginner",
    },
    {
      id: "2",
      name: "Tree Pose",
      sanskritName: "Vrksasana",
      description: "This balancing pose strengthens the legs and core while improving concentration and balance.",
      benefits: ["Improves balance", "Strengthens thighs, calves, and ankles", "Stretches the groins and inner thighs"],
      image: "https://images.unsplash.com/photo-1566501206188-5dd0cf160a0e",
      youtubeId: "wdln9qWYloU",
      level: "Beginner",
    },
    {
      id: "3",
      name: "Warrior II",
      sanskritName: "Virabhadrasana II",
      description: "This standing pose strengthens and stretches the legs and ankles, while also expanding the chest and shoulders.",
      benefits: ["Strengthens legs and opens hips", "Builds stamina and concentration", "Stimulates abdominal organs"],
      image: "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539",
      youtubeId: "4Ejz7IgODlU",
      level: "Beginner",
    },
  ]);

  const [streak, _setStreak] = useState<YogaStreak>({
    currentStreak: 7,
    longestStreak: 14,
    totalSessions: 32,
    lastPracticeDate: new Date(),
  });

  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const { toast } = useToast();

  // Mark a class as completed
  const markAsCompleted = (classId: string) => {
    setClasses(
      classes.map((c) =>
        c.id === classId ? { ...c, completedToday: true } : c
      )
    );
    
    toast({
      title: "Practice completed",
      description: "Great job! Your progress has been saved.",
    });
  };

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily-practice">Daily Practice</TabsTrigger>
          <TabsTrigger value="pose-library">Pose Library</TabsTrigger>
          <TabsTrigger value="custom-routines">Custom Routines</TabsTrigger>
        </TabsList>

        {/* Daily Practice Tab */}
        <TabsContent value="daily-practice">
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
                        onClick={() => {
                          markAsCompleted(selectedClass.id);
                          setSelectedClass(null);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>

            <Card className="border-lifemate-purple/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-lifemate-purple" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Weekly Goal (5 sessions)</p>
                    <p className="text-sm text-muted-foreground">3/5 completed</p>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Monthly Practice (minutes)</p>
                    <p className="text-sm text-muted-foreground">180/300 min</p>
                  </div>
                  <Progress value={60} className="h-2" />
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pose Library Tab */}
        <TabsContent value="pose-library">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Yoga Poses</h2>
              
              <div className="relative">
                <select className="bg-secondary rounded-md border border-border px-3 py-2 text-sm appearance-none pr-8">
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {poses.map((pose) => (
                <Card key={pose.id}>
                  <div className="relative h-48 overflow-hidden">
                    {pose.image && (
                      <img
                        src={pose.image}
                        alt={pose.name}
                        className="object-cover w-full h-full"
                      />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-secondary/70 backdrop-blur-sm">
                        {pose.level}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{pose.name}</h3>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      {pose.sanskritName}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pose.description}
                    </p>
                  </CardContent>
                  <CardFooter className="px-4 py-3 bg-secondary/40 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedPose(pose)}
                    >
                      <Info className="h-4 w-4 mr-1" /> Details
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (pose.youtubeId) {
                          window.open(`https://www.youtube.com/watch?v=${pose.youtubeId}`, '_blank');
                        }
                      }}
                    >
                      <Video className="h-4 w-4 mr-1" /> Tutorial
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pose Detail Dialog */}
            <Dialog open={!!selectedPose} onOpenChange={() => setSelectedPose(null)}>
              {selectedPose && (
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{selectedPose.name}</DialogTitle>
                    <DialogDescription>{selectedPose.sanskritName}</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4">
                    {selectedPose.youtubeId ? (
                      <YoutubeEmbed youtubeId={selectedPose.youtubeId} />
                    ) : (
                      selectedPose.image && (
                        <div className="aspect-video bg-secondary/40 rounded-md overflow-hidden">
                          <img
                            src={selectedPose.image}
                            alt={selectedPose.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">
                        {selectedPose.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Benefits</h3>
                      <ul className="space-y-1">
                        {selectedPose.benefits.map((benefit, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-muted-foreground"
                          >
                            <span className="text-lifemate-purple mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>

            <div className="flex justify-center">
              <Button variant="outline">
                Load More Poses
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Custom Routines Tab */}
        <TabsContent value="custom-routines">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Custom Routines</h2>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Create New Routine
              </Button>
            </div>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Morning Energizer</CardTitle>
                <CardDescription>Custom 15-min routine for morning energy boost</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This custom routine focuses on energizing poses to wake up your body
                  and prepare for the day ahead.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span>15 minutes</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Poses</span>
                      <span>6 poses</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Level</span>
                      <span>Beginner</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">Focus areas</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">Core</Badge>
                      <Badge variant="outline">Flexibility</Badge>
                      <Badge variant="outline">Balance</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-secondary/40">
                <Button variant="outline">Edit Routine</Button>
                <Button>Start Practice</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bedtime Wind Down</CardTitle>
                <CardDescription>Custom 10-min routine for evening relaxation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  A gentle sequence of poses designed to release tension and prepare
                  your body and mind for restful sleep.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span>10 minutes</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Poses</span>
                      <span>5 poses</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Level</span>
                      <span>Beginner</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">Focus areas</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">Relaxation</Badge>
                      <Badge variant="outline">Stretching</Badge>
                      <Badge variant="outline">Breathing</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Edit Routine</Button>
                <Button>Start Practice</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YogaModule;
