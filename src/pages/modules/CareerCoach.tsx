
import { useState, useEffect } from "react";
import { GraduationCap, BookOpen, Briefcase, Brain, Target, ChevronRight, Award, CheckCircle, Calendar, Clock, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  title: string;
  duration: string;
  level: string;
  completed: boolean;
  progress: number;
  category: string;
  dueDate?: string;
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  expiry?: string;
  type: "professional" | "academic" | "skill";
}

interface CoachingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  coach: string;
  status: "scheduled" | "completed" | "cancelled";
}

const CareerCoach = () => {
  const [activeTab, setActiveTab] = useState("learning");
  const [currentCourses, setCurrentCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Frontend Fundamentals",
      duration: "20 hours",
      level: "Intermediate",
      completed: false,
      progress: 80,
      category: "Web Development"
    },
    {
      id: "2",
      title: "Backend Development",
      duration: "25 hours",
      level: "Intermediate",
      completed: false,
      progress: 45,
      category: "Web Development",
      dueDate: "May 30, 2023"
    },
    {
      id: "3",
      title: "Database Design",
      duration: "15 hours",
      level: "Advanced",
      completed: false,
      progress: 30,
      category: "Database"
    }
  ]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([
    {
      id: "4",
      title: "React Advanced Patterns",
      duration: "4 hours",
      level: "Intermediate",
      completed: false,
      progress: 0,
      category: "Frontend"
    },
    {
      id: "5",
      title: "Node.js Microservices",
      duration: "6 hours",
      level: "Advanced",
      completed: false,
      progress: 0,
      category: "Backend"
    },
    {
      id: "6",
      title: "SQL Database Optimization",
      duration: "3 hours",
      level: "Intermediate",
      completed: false,
      progress: 0,
      category: "Database"
    }
  ]);
  
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      title: "Full Stack Web Developer",
      issuer: "Tech Academy",
      date: "January 2023",
      type: "professional"
    },
    {
      id: "2",
      title: "JavaScript Advanced Concepts",
      issuer: "JavaScript Institute",
      date: "September 2022",
      type: "skill"
    },
    {
      id: "3",
      title: "Agile Project Management",
      issuer: "PM Certification Board",
      date: "March 2022",
      expiry: "March 2025",
      type: "professional"
    }
  ]);
  
  const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>([
    {
      id: "1",
      title: "Career Path Planning",
      date: "May 20, 2023",
      time: "10:00 AM",
      duration: "45 minutes",
      coach: "Sarah Johnson",
      status: "scheduled"
    },
    {
      id: "2",
      title: "Resume Review",
      date: "May 15, 2023",
      time: "2:00 PM",
      duration: "30 minutes",
      coach: "Michael Chen",
      status: "completed"
    },
    {
      id: "3",
      title: "Technical Interview Prep",
      date: "May 25, 2023",
      time: "11:00 AM",
      duration: "60 minutes",
      coach: "David Wilson",
      status: "scheduled"
    }
  ]);
  
  const [showCoachingDialog, setShowCoachingDialog] = useState(false);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Data is already set in state
    }, 500);
  }, []);
  
  const handleStartSession = () => {
    setShowCoachingDialog(true);
  };
  
  const handleScheduleCoaching = () => {
    const newSession: CoachingSession = {
      id: `new-${Date.now()}`,
      title: "Custom Coaching Session",
      date: "May 22, 2023",
      time: "3:00 PM",
      duration: "45 minutes",
      coach: "Alex Rivera",
      status: "scheduled"
    };
    
    setCoachingSessions([newSession, ...coachingSessions]);
    
    toast({
      title: "Session Scheduled",
      description: "Your coaching session has been scheduled for May 22, 3:00 PM",
    });
    
    setShowCoachingDialog(false);
  };
  
  const handleCompleteModule = (courseId: string) => {
    setCurrentCourses(courses => 
      courses.map(course => 
        course.id === courseId 
          ? { ...course, progress: Math.min(100, course.progress + 10) } 
          : course
      )
    );
    
    toast({
      title: "Progress Updated",
      description: "Your course progress has been updated",
    });
  };
  
  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDialog(true);
  };
  
  const handleEnrollCourse = () => {
    if (selectedCourse) {
      // Move from recommended to current courses
      setCurrentCourses([...currentCourses, {...selectedCourse, progress: 0}]);
      setRecommendedCourses(recommendedCourses.filter(course => course.id !== selectedCourse.id));
      
      toast({
        title: "Enrolled Successfully",
        description: `You've been enrolled in ${selectedCourse.title}`,
      });
      
      setShowCourseDialog(false);
      setSelectedCourse(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career & Study Coach</h1>
        <p className="text-muted-foreground">Study plans, exam preparation, and career advice tailored to your goals</p>
      </div>

      <Tabs defaultValue="learning" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Learning
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Career
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Brain className="h-4 w-4" /> Skills
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" /> Goals
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="h-4 w-4" /> Certificates
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="learning" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-lifemate-purple" /> 
                  Current Learning Path
                </CardTitle>
                <CardDescription>Full Stack Web Development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentCourses.map(course => (
                    <div key={course.id} className="space-y-1">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{course.title}</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{course.level} • {course.duration}</span>
                        {course.dueDate && (
                          <span className="flex items-center text-orange-500">
                            <AlertCircle className="h-3 w-3 mr-1" /> Due {course.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleCompleteModule(currentCourses[0].id)}
                >
                  Continue Learning
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recommended Courses</CardTitle>
                <CardDescription>Based on your goals and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendedCourses.map(course => (
                    <li 
                      key={course.id}
                      className="p-2 rounded-md hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => handleCourseClick(course)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.duration} • {course.level}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Next Coaching Session</CardTitle>
              <CardDescription>Schedule your next personalized coaching session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p>Our AI coach will analyze your learning patterns and provide personalized guidance on improving your study techniques and career advancement.</p>
                
                {coachingSessions.filter(session => session.status === "scheduled").length > 0 && (
                  <div className="bg-secondary/50 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Your next session:</p>
                    {coachingSessions
                      .filter(session => session.status === "scheduled")
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 1)
                      .map(session => (
                        <div key={session.id} className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-lifemate-purple" />
                          <span>{session.date}</span>
                          <Clock className="h-4 w-4 text-lifemate-purple ml-2" />
                          <span>{session.time}</span>
                          <Badge className="ml-2">{session.duration}</Badge>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartSession} className="w-full">Schedule Session</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="career" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Career Path Analysis</CardTitle>
                <CardDescription>Based on your skills and interests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Primary Path: Full Stack Developer</h3>
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-muted-foreground">You've completed 75% of recommended skills</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Alternative Path: DevOps Specialist</h3>
                  <Progress value={40} className="h-2" />
                  <p className="text-sm text-muted-foreground">You've completed 40% of recommended skills</p>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium mb-2">Next Steps:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Complete Node.js Microservices course</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Build 2 portfolio projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Prepare for technical interviews</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  toast({
                    title: "Career Path Report",
                    description: "Your detailed career path report has been generated",
                  });
                }} className="flex gap-2 items-center w-full">
                  <Download className="h-4 w-4" /> Download Full Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Job Market Analysis</CardTitle>
                <CardDescription>Trends for your target roles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Full Stack Developer</h3>
                    <Badge className="bg-green-500">High Demand</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Average salary: $95,000 - $120,000</p>
                  <p className="text-sm text-muted-foreground">15% growth expected over next 3 years</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Frontend Developer</h3>
                    <Badge className="bg-green-500">High Demand</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Average salary: $85,000 - $110,000</p>
                  <p className="text-sm text-muted-foreground">12% growth expected over next 3 years</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">DevOps Engineer</h3>
                    <Badge className="bg-blue-500">Moderate Demand</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Average salary: $100,000 - $130,000</p>
                  <p className="text-sm text-muted-foreground">8% growth expected over next 3 years</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Job Alerts",
                    description: "Job alerts have been set up for your target roles",
                  });
                }} className="w-full">
                  Set Up Job Alerts
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Resume & Interview Preparation</CardTitle>
              <CardDescription>Tools to enhance your job application materials</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <Button onClick={() => {
                toast({
                  title: "Resume Builder",
                  description: "Resume builder tool will be available in the next update",
                });
              }} className="flex flex-col items-center justify-center h-32 bg-secondary/50 hover:bg-secondary">
                <Briefcase className="h-8 w-8 mb-2" />
                <span>Resume Builder</span>
              </Button>
              
              <Button onClick={() => {
                toast({
                  title: "Interview Simulator",
                  description: "Interview simulator will be available in the next update",
                });
              }} className="flex flex-col items-center justify-center h-32 bg-secondary/50 hover:bg-secondary">
                <GraduationCap className="h-8 w-8 mb-2" />
                <span>Interview Simulator</span>
              </Button>
              
              <Button onClick={() => {
                toast({
                  title: "Cover Letter Assistant",
                  description: "Cover letter assistant will be available in the next update",
                });
              }} className="flex flex-col items-center justify-center h-32 bg-secondary/50 hover:bg-secondary">
                <BookOpen className="h-8 w-8 mb-2" />
                <span>Cover Letter Assistant</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>Your professional skills evaluation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Technical Skills</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>JavaScript</span>
                      <span>Advanced</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>React</span>
                      <span>Intermediate</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Node.js</span>
                      <span>Intermediate</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>SQL</span>
                      <span>Beginner</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Soft Skills</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Communication</span>
                      <span>Advanced</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Problem Solving</span>
                      <span>Advanced</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Teamwork</span>
                      <span>Intermediate</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  toast({
                    title: "Skills Assessment",
                    description: "Your comprehensive skills assessment is being prepared",
                  });
                }} className="w-full">
                  Take Full Assessment
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Skill Recommendations</CardTitle>
                <CardDescription>Based on your career goals</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="p-3 bg-secondary/50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">TypeScript</h3>
                        <p className="text-sm text-muted-foreground">Strongly typed JavaScript development</p>
                      </div>
                      <Button size="sm" onClick={() => {
                        toast({
                          title: "TypeScript Course",
                          description: "TypeScript course added to your learning path",
                        });
                      }}>
                        Add to Path
                      </Button>
                    </div>
                  </li>
                  
                  <li className="p-3 bg-secondary/50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Docker</h3>
                        <p className="text-sm text-muted-foreground">Containerization for applications</p>
                      </div>
                      <Button size="sm" onClick={() => {
                        toast({
                          title: "Docker Course",
                          description: "Docker course added to your learning path",
                        });
                      }}>
                        Add to Path
                      </Button>
                    </div>
                  </li>
                  
                  <li className="p-3 bg-secondary/50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">GraphQL</h3>
                        <p className="text-sm text-muted-foreground">API query language</p>
                      </div>
                      <Button size="sm" onClick={() => {
                        toast({
                          title: "GraphQL Course",
                          description: "GraphQL course added to your learning path",
                        });
                      }}>
                        Add to Path
                      </Button>
                    </div>
                  </li>
                  
                  <li className="p-3 bg-secondary/50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">AWS Basics</h3>
                        <p className="text-sm text-muted-foreground">Cloud infrastructure essentials</p>
                      </div>
                      <Button size="sm" onClick={() => {
                        toast({
                          title: "AWS Course",
                          description: "AWS course added to your learning path",
                        });
                      }}>
                        Add to Path
                      </Button>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="goals">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Career Goals</CardTitle>
                <CardDescription>Your defined professional objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-secondary/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Become a Senior Developer</h3>
                      <p className="text-sm text-muted-foreground mt-1">Target achievement date: December 2024</p>
                    </div>
                    <Badge>Long-term</Badge>
                  </div>
                  <Progress value={45} className="h-2 mt-2" />
                </div>
                
                <div className="p-3 bg-secondary/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Complete AWS Certification</h3>
                      <p className="text-sm text-muted-foreground mt-1">Target achievement date: August 2023</p>
                    </div>
                    <Badge>Mid-term</Badge>
                  </div>
                  <Progress value={25} className="h-2 mt-2" />
                </div>
                
                <div className="p-3 bg-secondary/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Build Portfolio Website</h3>
                      <p className="text-sm text-muted-foreground mt-1">Target achievement date: June 2023</p>
                    </div>
                    <Badge>Short-term</Badge>
                  </div>
                  <Progress value={60} className="h-2 mt-2" />
                </div>
                
                <Button onClick={() => {
                  toast({
                    title: "New Goal",
                    description: "The goal creation form will be available in the next update",
                  });
                }} variant="outline" className="w-full">
                  Add New Goal
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Goal Analysis</CardTitle>
                <CardDescription>Smart insights on your career objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/50 rounded-md">
                  <h3 className="font-medium mb-2">Goal Alignment Analysis</h3>
                  <p className="text-sm">Your current learning path is 85% aligned with your goal to become a Senior Developer. Consider adding more architectural design skills to fully prepare.</p>
                </div>
                
                <div className="p-4 bg-secondary/50 rounded-md">
                  <h3 className="font-medium mb-2">Timeline Assessment</h3>
                  <p className="text-sm">Based on your current progress, you're on track to complete AWS Certification by August 2023. Recommended study time: 5 hours/week.</p>
                </div>
                
                <div className="p-4 bg-secondary/50 rounded-md">
                  <h3 className="font-medium mb-2">Market Demand Analysis</h3>
                  <p className="text-sm">Your selected goals align with high-demand skills in the current job market. AWS Certification could increase your market value by approximately 12%.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => {
                  toast({
                    title: "Goal Optimization",
                    description: "Your personalized goal optimization plan is being prepared",
                  });
                }} className="w-full">Generate Detailed Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="certificates">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Certificates</CardTitle>
                <CardDescription>Professional certifications and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates.map(certificate => (
                    <div key={certificate.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{certificate.title}</h3>
                          <p className="text-sm text-muted-foreground">Issued by {certificate.issuer}</p>
                          <p className="text-sm text-muted-foreground">Issued: {certificate.date}</p>
                          {certificate.expiry && (
                            <p className="text-sm text-orange-500">Expires: {certificate.expiry}</p>
                          )}
                        </div>
                        <Badge>
                          {{
                            'professional': 'Professional',
                            'academic': 'Academic',
                            'skill': 'Skill'
                          }[certificate.type]}
                        </Badge>
                      </div>
                      <div className="mt-3 flex">
                        <Button size="sm" variant="outline" className="mr-2" onClick={() => {
                          toast({
                            title: "Certificate",
                            description: `Viewing ${certificate.title} certificate`,
                          });
                        }}>View</Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          toast({
                            title: "Certificate",
                            description: `Downloading ${certificate.title} certificate`,
                          });
                        }}>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommended Certifications</CardTitle>
                <CardDescription>Based on your career path</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="p-3 border rounded-md">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">AWS Solutions Architect</h3>
                      <Badge variant="outline">High Value</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Validate your AWS expertise and architectural design skills</p>
                    <Button size="sm" className="mt-2" onClick={() => {
                      toast({
                        title: "AWS Certification",
                        description: "AWS certification path has been added to your goals",
                      });
                    }}>
                      Add to Goals
                    </Button>
                  </li>
                  
                  <li className="p-3 border rounded-md">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">Google Professional Cloud Developer</h3>
                      <Badge variant="outline">High Value</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Build applications using Google Cloud technologies</p>
                    <Button size="sm" className="mt-2" onClick={() => {
                      toast({
                        title: "Google Cloud Certification",
                        description: "Google Cloud certification path has been added to your goals",
                      });
                    }}>
                      Add to Goals
                    </Button>
                  </li>
                  
                  <li className="p-3 border rounded-md">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">Microsoft Azure Developer</h3>
                      <Badge variant="outline">Medium Value</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Design, build, and maintain cloud solutions on Azure</p>
                    <Button size="sm" className="mt-2" onClick={() => {
                      toast({
                        title: "Azure Certification",
                        description: "Azure certification path has been added to your goals",
                      });
                    }}>
                      Add to Goals
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Certification Tracker</CardTitle>
              <CardDescription>Monitor your certification progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-md">
                  <div className="text-3xl font-bold mb-2">{certificates.length}</div>
                  <p className="text-sm text-muted-foreground">Active Certificates</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-md">
                  <div className="text-3xl font-bold mb-2">1</div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-md">
                  <div className="text-3xl font-bold mb-2">2</div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Learning History</CardTitle>
              <CardDescription>Track your educational journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-0 top-0 h-full w-0.5 bg-secondary"></div>
                
                <div className="space-y-8 ml-6">
                  <div className="relative">
                    <div className="absolute -left-10 top-0 h-6 w-6 rounded-full bg-lifemate-purple flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-background"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Completed: React Advanced Course</h3>
                      <p className="text-sm text-muted-foreground">April 2023</p>
                      <p className="text-sm mt-2">Learned advanced state management, custom hooks, and performance optimization</p>
                      <Badge className="mt-2">Certificate Earned</Badge>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-10 top-0 h-6 w-6 rounded-full bg-lifemate-purple flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-background"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Completed: JavaScript Algorithms & Data Structures</h3>
                      <p className="text-sm text-muted-foreground">February 2023</p>
                      <p className="text-sm mt-2">Mastered advanced algorithms and efficient problem solving techniques</p>
                      <Badge className="mt-2">Certificate Earned</Badge>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-10 top-0 h-6 w-6 rounded-full bg-lifemate-purple flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-background"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Completed: Introduction to Node.js</h3>
                      <p className="text-sm text-muted-foreground">December 2022</p>
                      <p className="text-sm mt-2">Learned server-side JavaScript, RESTful APIs, and Express framework</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-10 top-0 h-6 w-6 rounded-full bg-lifemate-purple flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-background"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Completed: HTML, CSS & JavaScript Fundamentals</h3>
                      <p className="text-sm text-muted-foreground">September 2022</p>
                      <p className="text-sm mt-2">Mastered core web development technologies and responsive design</p>
                      <Badge className="mt-2">Certificate Earned</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Learning History",
                  description: "Your complete learning history report is being prepared",
                });
              }} className="w-full">
                <Download className="h-4 w-4 mr-2" /> Download Complete History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Coaching Session Dialog */}
      <Dialog open={showCoachingDialog} onOpenChange={setShowCoachingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule a Coaching Session</DialogTitle>
            <DialogDescription>
              Choose a time for your personalized career coaching
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="session-type" className="text-sm font-medium">Session Type</label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="default">Career Guidance</Button>
                <Button variant="outline">Skill Development</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Available Dates</label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline">May 20</Button>
                <Button variant="default">May 22</Button>
                <Button variant="outline">May 25</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Available Times</label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline">10:00 AM</Button>
                <Button variant="default">3:00 PM</Button>
                <Button variant="outline">5:00 PM</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Duration</label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline">30 min</Button>
                <Button variant="default">45 min</Button>
                <Button variant="outline">60 min</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCoachingDialog(false)}>Cancel</Button>
            <Button onClick={handleScheduleCoaching}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Course Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}</DialogTitle>
            <DialogDescription>
              Course details and enrollment
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="py-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-secondary rounded-md h-40 md:w-1/3 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                </div>
                
                <div className="space-y-2 md:w-2/3">
                  <div>
                    <span className="text-sm font-medium">Category:</span>
                    <span className="text-sm ml-2">{selectedCourse.category}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Level:</span>
                    <span className="text-sm ml-2">{selectedCourse.level}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm ml-2">{selectedCourse.duration}</span>
                  </div>
                  
                  <p className="text-sm mt-2">
                    This course will help you master {selectedCourse.title} concepts and implementation techniques with hands-on projects.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">What you'll learn</h3>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Advanced techniques and best practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Real-world project implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Industry-standard workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Performance optimization strategies</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-lifemate-purple" />
                  <span className="text-sm">Start anytime</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-lifemate-purple" />
                  <span className="text-sm">Certificate included</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCourseDialog(false)}>Cancel</Button>
            <Button onClick={handleEnrollCourse}>Enroll Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareerCoach;
