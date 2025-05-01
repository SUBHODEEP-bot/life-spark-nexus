
import { useState } from "react";
import { Star, Calendar, CheckCircle2, ClipboardList, PlusCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Wish {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  progress: number;
  category: string;
}

const WishGrantSystem = () => {
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: "1",
      title: "Learn Spanish",
      description: "Achieve B2 level proficiency in Spanish",
      dueDate: "December 2023",
      progress: 65,
      category: "Personal"
    },
    {
      id: "2",
      title: "Run a Marathon",
      description: "Complete a full marathon under 4 hours",
      dueDate: "October 2023",
      progress: 40,
      category: "Health"
    },
    {
      id: "3",
      title: "Start a Side Business",
      description: "Launch an online store selling handmade crafts",
      dueDate: "January 2024",
      progress: 25,
      category: "Career"
    }
  ]);
  
  const { toast } = useToast();

  const handleAddWish = () => {
    toast({
      title: "Add New Wish",
      description: "The wish creation form will be available soon",
    });
  };

  const handleUpdateProgress = (id: string, increment: number) => {
    setWishes(wishes.map(wish => 
      wish.id === id 
        ? { ...wish, progress: Math.min(100, Math.max(0, wish.progress + increment)) } 
        : wish
    ));
    
    toast({
      title: "Progress Updated",
      description: `Wish progress ${increment > 0 ? 'increased' : 'decreased'} by ${Math.abs(increment)}%`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Wish Grant System</h1>
          <p className="text-muted-foreground">Set goals, track progress, and get customized motivation nudges</p>
        </div>
        <Button onClick={handleAddWish} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Add Wish
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" /> Active Wishes
            </CardTitle>
            <CardDescription>{wishes.length} wishes in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{wishes.length}</div>
            <p className="text-sm text-muted-foreground">You're on track with most of your wishes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> Completed
            </CardTitle>
            <CardDescription>Wishes you've accomplished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">You've completed 12 wishes this year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" /> Coming Due
            </CardTitle>
            <CardDescription>Wishes with upcoming deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-sm text-muted-foreground">2 wishes due in the next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8">Your Active Wishes</h2>
      <div className="space-y-4">
        {wishes.map(wish => (
          <Card key={wish.id} className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-lifemate-purple to-lifemate-purple-dark" style={{ width: `${wish.progress}%` }}></div>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{wish.title}</CardTitle>
                <span className="text-sm px-2 py-1 bg-secondary rounded-full">{wish.category}</span>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Due by {wish.dueDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{wish.description}</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{wish.progress}%</span>
                </div>
                <Progress value={wish.progress} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleUpdateProgress(wish.id, -5)}>
                Decrease
              </Button>
              <Button size="sm" onClick={() => handleUpdateProgress(wish.id, 10)}>
                Update Progress
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-lifemate-purple" /> AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Based on your progress, our AI recommends focusing on your "Run a Marathon" wish this week. 
          You're falling slightly behind on your training schedule.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View Detailed Analysis</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WishGrantSystem;
