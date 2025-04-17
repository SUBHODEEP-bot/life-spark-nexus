
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  HelpCircle, 
  MessageSquare, 
  Lightbulb, 
  History, 
  PlusCircle, 
  Tag, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  Check,
  Brain,
  Sparkles,
  LifeBuoy,
  Scale,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";

// Mock data for solved problems
const mockProblems = [
  {
    id: 1,
    question: "How do I negotiate a better salary for a new job offer?",
    answer: "Research industry standards for your position and location. Highlight your unique skills and achievements that add value. Practice your negotiation points before the meeting. Be confident but flexible, and consider the total compensation package including benefits.",
    category: "career",
    timeAgo: "2 days ago",
    helpfulVotes: 43,
    unhelpfulVotes: 3
  },
  {
    id: 2,
    question: "What's the best way to resolve a conflict with a difficult coworker?",
    answer: "Start by addressing the issue privately with your coworker. Focus on specific behaviors rather than personality. Listen to their perspective and seek common ground. If needed, involve a mediator like a manager. Document interactions if the situation persists.",
    category: "workplace",
    timeAgo: "1 week ago",
    helpfulVotes: 29,
    unhelpfulVotes: 5
  },
  {
    id: 3,
    question: "How can I improve my work-life balance while working remotely?",
    answer: "Create a dedicated workspace separate from your living areas. Set a consistent schedule with clear start and end times. Take regular breaks throughout the day. Use calendar blocking for focused work and personal time. Communicate boundaries with colleagues and family members.",
    category: "lifestyle",
    timeAgo: "3 days ago",
    helpfulVotes: 51,
    unhelpfulVotes: 2
  },
  {
    id: 4,
    question: "What's the best approach to start saving for retirement in my 30s?",
    answer: "Begin by establishing an emergency fund covering 3-6 months of expenses. Next, maximize contributions to employer-matched retirement accounts like 401(k)s. Consider opening a Roth IRA for tax-free growth. Aim to save 15-20% of your income for retirement. Diversify investments based on your risk tolerance and time horizon.",
    category: "finance",
    timeAgo: "5 days ago",
    helpfulVotes: 38,
    unhelpfulVotes: 4
  }
];

// Categories with their icons
const categories = [
  { name: "career", icon: <Brain className="h-4 w-4" />, color: "bg-blue-500/10 text-blue-500 border-blue-200" },
  { name: "workplace", icon: <LifeBuoy className="h-4 w-4" />, color: "bg-amber-500/10 text-amber-500 border-amber-200" },
  { name: "lifestyle", icon: <Heart className="h-4 w-4" />, color: "bg-purple-500/10 text-purple-500 border-purple-200" },
  { name: "finance", icon: <Scale className="h-4 w-4" />, color: "bg-green-500/10 text-green-500 border-green-200" },
  { name: "technology", icon: <Sparkles className="h-4 w-4" />, color: "bg-sky-500/10 text-sky-500 border-sky-200" }
];

// Get category color
const getCategoryColor = (categoryName: string) => {
  const category = categories.find(c => c.name === categoryName);
  return category ? category.color : "bg-secondary text-muted-foreground";
};

// Get category icon
const getCategoryIcon = (categoryName: string) => {
  const category = categories.find(c => c.name === categoryName);
  return category ? category.icon : <Tag className="h-4 w-4" />;
};

const ProblemSolver = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [question, setQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("lifestyle");
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSubmitQuestion = () => {
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter your question before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAnswer(true);
    
    // Simulate AI generating an answer
    setTimeout(() => {
      let answer = "";
      
      if (question.toLowerCase().includes("career")) {
        answer = "To advance in your career, focus on continuous learning, building a professional network, and setting clear goals. Seek mentorship and regularly reassess your skills against market demands. Take initiative on high-visibility projects and communicate your achievements effectively.";
      } else if (question.toLowerCase().includes("relationship")) {
        answer = "Healthy relationships require open communication, mutual respect, and effort from both parties. Schedule regular check-ins to discuss feelings and concerns. Make time for shared activities while maintaining individual interests and friendships.";
      } else if (question.toLowerCase().includes("money") || question.toLowerCase().includes("finance")) {
        answer = "For better financial health, create a budget tracking income and expenses. Build an emergency fund covering 3-6 months of expenses. Pay down high-interest debt while making minimum payments on lower-interest obligations. Consider consulting a financial advisor for personalized guidance.";
      } else {
        answer = "Based on your question, I recommend taking a structured approach. Start by clearly defining the problem and gathering relevant information. Consider multiple perspectives and potential solutions. Evaluate each option against your priorities and constraints before making a decision.";
      }
      
      setGeneratedAnswer(answer);
      setIsGeneratingAnswer(false);
      
      toast({
        title: "Solution generated",
        description: "AI has generated a solution to your problem"
      });
    }, 2000);
  };

  const handleSaveAnswer = () => {
    toast({
      title: "Solution saved",
      description: "This solution has been saved to your collection"
    });
  };

  const handleVote = (id: number, isHelpful: boolean) => {
    toast({
      title: isHelpful ? "Marked as helpful" : "Marked as unhelpful",
      description: "Thank you for your feedback"
    });
  };

  const filteredProblems = mockProblems.filter(problem =>
    problem.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Daily Life Problem Solver</h1>
        <p className="text-muted-foreground">
          Get AI suggestions for everyday decisions and common problems
        </p>
      </header>

      <Tabs defaultValue="explore" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="explore">
              <Lightbulb className="h-4 w-4 mr-2" />
              Explore Solutions
            </TabsTrigger>
            <TabsTrigger value="ask">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask a Question
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Your History
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="explore" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Input 
                type="text" 
                placeholder="Search problems and solutions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setActiveTab("ask")}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ask New Question
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Common Solutions</h2>
              
              {filteredProblems.length > 0 ? (
                filteredProblems.map(problem => (
                  <Card key={problem.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`flex items-center gap-1 ${getCategoryColor(problem.category)}`}>
                          {getCategoryIcon(problem.category)}
                          {problem.category.charAt(0).toUpperCase() + problem.category.slice(1)}
                        </Badge>
                        <div className="flex items-center text-muted-foreground text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {problem.timeAgo}
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{problem.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{problem.answer}</p>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleVote(problem.id, true)}
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>{problem.helpfulVotes}</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleVote(problem.id, false)}
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                            <span>{problem.unhelpfulVotes}</span>
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-3.5 w-3.5 mr-1" />
                            Save
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-3.5 w-3.5 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="bg-secondary/40 rounded-lg border border-border/40 p-8 text-center">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-4 text-muted-foreground">No solutions match your search</p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Categories</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {categories.map(category => (
                      <div 
                        key={category.name}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/60 cursor-pointer"
                        onClick={() => setSearchQuery(category.name)}
                      >
                        <div className="flex items-center">
                          <div className={`p-1.5 rounded-md mr-3 ${category.color}`}>
                            {category.icon}
                          </div>
                          <span className="font-medium">{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {mockProblems.filter(p => p.category === category.name).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <h2 className="text-xl font-semibold">Popular Questions</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <p className="text-sm hover:text-primary cursor-pointer">
                      How to start investing with a small amount of money?
                    </p>
                    <Separator />
                    <p className="text-sm hover:text-primary cursor-pointer">
                      What's the best way to improve my public speaking skills?
                    </p>
                    <Separator />
                    <p className="text-sm hover:text-primary cursor-pointer">
                      How to effectively manage time between work and family?
                    </p>
                    <Separator />
                    <p className="text-sm hover:text-primary cursor-pointer">
                      What's a good strategy for meal planning and grocery shopping?
                    </p>
                    <Separator />
                    <p className="text-sm hover:text-primary cursor-pointer">
                      How to deal with a noisy neighbor?
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ask" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                Ask Your Question
              </CardTitle>
              <CardDescription>
                Describe your problem in detail for the most helpful solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="What problem are you trying to solve? Provide as much detail as possible..." 
                className="min-h-32"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              
              <div>
                <label className="text-sm font-medium block mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge 
                      key={category.name}
                      variant="outline" 
                      className={`flex items-center gap-1 cursor-pointer ${selectedCategory === category.name ? category.color : "bg-secondary text-muted-foreground"}`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.icon}
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubmitQuestion}
                disabled={isGeneratingAnswer || !question.trim()}
              >
                {isGeneratingAnswer ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Generating Solution...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Get AI Solution
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {generatedAnswer && (
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Check className="h-5 w-5 mr-2 text-green-500" />
                  Generated Solution
                </CardTitle>
                <CardDescription>
                  Based on your problem description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{generatedAnswer}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleVote(999, true)}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>Helpful</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleVote(999, false)}
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      <span>Not Helpful</span>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleSaveAnswer}>
                      <Bookmark className="h-3.5 w-3.5 mr-1" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-3.5 w-3.5 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={() => {
                    setQuestion("");
                    setGeneratedAnswer("");
                  }}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Ask Another Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <History className="h-5 w-5 mr-2 text-purple-500" />
                    Your Question History
                  </CardTitle>
                  <CardDescription>
                    Previously asked questions and saved solutions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-secondary/40 rounded-lg border border-border/40 p-8 text-center">
                    <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">You haven't asked any questions yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("ask")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Ask Your First Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Questions Asked</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Solutions Saved</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Helpful Votes</span>
                    <span className="font-medium">0</span>
                  </div>
                  <Separator className="my-2" />
                  <Button variant="outline" className="w-full">
                    View Detailed Stats
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProblemSolver;
