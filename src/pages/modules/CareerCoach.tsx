
import { useState } from "react";
import { GraduationCap, BookOpen, Briefcase, Brain, Target, ChevronRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const CareerCoach = () => {
  const [activeTab, setActiveTab] = useState("learning");
  const { toast } = useToast();
  
  const handleStartSession = () => {
    toast({
      title: "Session Started",
      description: "Your coaching session is being prepared",
    });
  };
  
  const handleCompleteModule = () => {
    toast({
      title: "Module Completed",
      description: "Great job! Your progress has been saved",
    });
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
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Frontend Fundamentals</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Backend Development</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Database Design</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleCompleteModule}>
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
                  <li className="p-2 rounded-md hover:bg-secondary/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">React Advanced Patterns</p>
                        <p className="text-sm text-muted-foreground">4 hours • Intermediate</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </li>
                  <li className="p-2 rounded-md hover:bg-secondary/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Node.js Microservices</p>
                        <p className="text-sm text-muted-foreground">6 hours • Advanced</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </li>
                  <li className="p-2 rounded-md hover:bg-secondary/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">SQL Database Optimization</p>
                        <p className="text-sm text-muted-foreground">3 hours • Intermediate</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </li>
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
              <p>Our AI coach will analyze your learning patterns and provide personalized guidance on improving your study techniques and career advancement.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartSession} className="w-full">Schedule Session</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="career" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Development</CardTitle>
              <CardDescription>Your career path and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Career planning and development tools will appear here. Check back soon for updates!</p>
                <Button onClick={handleStartSession}>Explore Career Options</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>Track your professional skills development</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Skills assessment and development tools will appear here. Check back soon for updates!</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Goal Setting</CardTitle>
              <CardDescription>Define and track your professional goals</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Goal setting and tracking tools will appear here. Check back soon for updates!</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Certificates & Achievements</CardTitle>
              <CardDescription>Your earned certifications and badges</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Your certificates and achievements will appear here. Check back soon for updates!</p>
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
              <p>Your learning history and progress will appear here. Check back soon for updates!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareerCoach;
