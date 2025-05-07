
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartContainer } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Mic, Loader2, Search, Book, CheckCircle2, AlertCircle, Youtube } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { supabase } from "@/integrations/supabase/client";

const GEMINI_API_KEY = "AIzaSyB4frRuhdWmCrUfyUojOTYcFJ9HQFqbhTY";
const YOUTUBE_API_KEY = "AIzaSyAGf72z_ThspQUBrfYq3Z0-9Ki5xl58aT8";

interface StudyTask {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
}

interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

const AIStudyMaster = () => {
  // Authentication state
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Content search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    content: string;
    videos: VideoResult[];
  }>({ content: "", videos: [] });
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizTaken, setQuizTaken] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);
  
  // Study tasks state
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  
  // Progress tracking state
  const [progressData, setProgressData] = useState<any[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  
  // Voice assistant state
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [voiceResponse, setVoiceResponse] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);

  // Speech recognition
  const recognitionRef = useRef<any>(null);

  // Check user authentication and load data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
      
      if (session?.user) {
        loadUserData(session.user.id);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          loadUserData(session.user.id);
        }
      }
    );

    checkAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    // Load tasks
    setTasksLoading(true);
    try {
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (taskData) {
        setTasks(taskData.map((task: any) => ({
          id: task.id,
          title: task.title,
          completed: task.status === 'completed',
          date: new Date(task.created_at).toLocaleDateString()
        })));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setTasksLoading(false);
    }

    // Load progress data
    try {
      // This would be replaced with actual progress data from your database
      const mockProgressData = [
        { day: 'Mon', score: 60 },
        { day: 'Tue', score: 75 },
        { day: 'Wed', score: 65 },
        { day: 'Thu', score: 85 },
        { day: 'Fri', score: 90 },
        { day: 'Sat', score: 70 },
        { day: 'Sun', score: 80 }
      ];
      setProgressData(mockProgressData);
      
      // Calculate weekly progress
      const avgProgress = mockProgressData.reduce((sum, item) => sum + item.score, 0) / mockProgressData.length;
      setWeeklyProgress(avgProgress);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }

    // Check if quiz has been taken today
    const today = new Date().toLocaleDateString();
    const quizTakenToday = localStorage.getItem(`quizTaken_${userId}_${today}`);
    setQuizTaken(quizTakenToday === 'true');
  };

  // Feature 1: Smart Topic Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchResults({ content: "", videos: [] });

    try {
      // Get content from Gemini API
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Provide a concise educational explanation (around 250 words) of: ${searchQuery}. Focus on key points that would be helpful for a student.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });

      const geminiData = await geminiResponse.json();
      const content = geminiData.candidates[0].content.parts[0].text;

      // Get YouTube videos
      const youtubeResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery + " educational")}&maxResults=3&type=video&key=${YOUTUBE_API_KEY}`
      );
      
      const youtubeData = await youtubeResponse.json();
      
      const videos = youtubeData.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle
      }));

      setSearchResults({
        content,
        videos
      });

      // Save search to user history if logged in
      if (user) {
        // Here you would save to Firebase or your backend
        await saveSearchToHistory(searchQuery);
      }
    } catch (error) {
      console.error('Error during search:', error);
      toast.error('Error fetching results. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const saveSearchToHistory = async (query: string) => {
    try {
      if (!user) return;
      
      // Implement your saving logic here
      console.log('Saving search to history:', query);
      
      // This would typically go to Firebase or your database
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Feature 2: Daily AI Quiz
  const generateQuiz = async () => {
    if (quizTaken) return;
    
    setQuizLoading(true);
    try {
      const prompt = `Generate a quiz with 5 multiple choice questions about general educational topics or based on these recent topics: ${tasks.slice(0, 3).map(t => t.title).join(", ")}. 
      For each question, provide 4 options and indicate the correct answer. 
      Format your response as a valid JSON array with this exact structure:
      [
        {
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option that is correct"
        }
      ]
      Don't include any explanations or additional text, just the JSON array.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        })
      });

      const data = await response.json();
      let text = data.candidates[0].content.parts[0].text;
      
      // Clean up the response to ensure it's valid JSON
      text = text.replace(/```json|```/g, '').trim();
      
      const questions = JSON.parse(text);
      const formattedQuestions = questions.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));

      setQuizQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    // Calculate score
    const answeredQuestions = quizQuestions.filter(q => q.userAnswer);
    if (answeredQuestions.length === 0) {
      toast.error('Please answer at least one question');
      return;
    }

    const correctAnswers = quizQuestions.filter(q => q.userAnswer === q.correctAnswer);
    const score = Math.round((correctAnswers.length / quizQuestions.length) * 100);
    setQuizScore(score);
    setQuizTaken(true);

    // Save quiz result
    if (user) {
      const today = new Date().toLocaleDateString();
      localStorage.setItem(`quizTaken_${user.id}_${today}`, 'true');
      localStorage.setItem(`quizScore_${user.id}_${today}`, score.toString());
      
      // Here you would save to Firebase or your backend
      saveQuizResult(score);
    }

    toast.success(`Quiz submitted! Your score: ${score}%`);
  };

  const saveQuizResult = async (score: number) => {
    try {
      if (!user) return;
      
      // Implement your saving logic here
      console.log('Saving quiz result:', score);
      
      // This would typically go to Firebase or your database
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  const handleQuizAnswer = (questionId: number, answer: string) => {
    setQuizQuestions(questions => 
      questions.map(q => 
        q.id === questionId ? { ...q, userAnswer: answer } : q
      )
    );
  };

  // Feature 3: Study Task Scheduler
  const generateTasks = async () => {
    setTasksLoading(true);
    try {
      const prompt = `Based on general educational needs, generate 5 study tasks that would be helpful for a student. Format as a JSON array with this structure:
      [
        {
          "title": "Task description"
        }
      ]
      Keep tasks concise and actionable. Don't include any explanations or additional text, just the JSON array.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        })
      });

      const data = await response.json();
      let text = data.candidates[0].content.parts[0].text;
      
      // Clean up the response to ensure it's valid JSON
      text = text.replace(/```json|```/g, '').trim();
      
      const newTasks = JSON.parse(text);
      
      if (user) {
        // Save tasks to Firebase or your backend
        for (const task of newTasks) {
          await saveTasks(task.title);
        }
        
        // Reload tasks to show the newly created ones
        loadUserData(user.id);
      } else {
        // For demo without login
        const demoTasks = newTasks.map((task: any, index: number) => ({
          id: `demo-${Date.now()}-${index}`,
          title: task.title,
          completed: false,
          date: new Date().toLocaleDateString()
        }));
        
        setTasks(prev => [...demoTasks, ...prev]);
      }
      
      toast.success('New study tasks generated!');
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast.error('Failed to generate tasks. Please try again.');
    } finally {
      setTasksLoading(false);
    }
  };

  const saveTasks = async (title: string) => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          { 
            user_id: user.id, 
            title: title,
            status: 'pending',
            description: 'Generated study task'
          }
        ]);
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving task:', error);
      throw error;
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      );
      setTasks(updatedTasks);
      
      if (user) {
        // Update in database if logged in
        await supabase
          .from('tasks')
          .update({ status: completed ? 'completed' : 'pending' })
          .eq('id', taskId);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  };

  // Feature 5: Voice Assistant
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(true);
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceQuery(transcript);
      setIsListening(false);
      processVoiceQuery(transcript);
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      setIsListening(false);
      toast.error('Error recognizing speech. Please try again.');
    };
    
    recognitionRef.current.start();
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };
  
  const processVoiceQuery = async (query: string) => {
    setVoiceLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an educational assistant. Provide a brief (100-150 words) explanation of this topic or answer this question: ${query}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      setVoiceResponse(responseText);
      
      // Speak the response
      speakResponse(responseText);
    } catch (error) {
      console.error('Error processing voice query:', error);
      toast.error('Error processing your question. Please try again.');
    } finally {
      setVoiceLoading(false);
    }
  };
  
  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported in your browser');
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading AI Study Master...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">AI Study Master</h1>
        <p className="text-muted-foreground text-center">Your Intelligent Education Assistant</p>
      </header>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4 w-full">
          <TabsTrigger value="search">
            <Search className="h-4 w-4 mr-2" />
            Smart Search
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Book className="h-4 w-4 mr-2" />
            Daily Quiz
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Study Tasks
          </TabsTrigger>
          <TabsTrigger value="progress">
            <AlertCircle className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Mic className="h-4 w-4 mr-2" />
            Voice Assistant
          </TabsTrigger>
        </TabsList>

        {/* Smart Topic Search */}
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Smart Topic Search</CardTitle>
              <CardDescription>Search for any educational topic to get AI-generated content and video recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Enter a topic (e.g., Photosynthesis, C Programming)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={searchLoading}>
                  {searchLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  Search
                </Button>
              </div>

              {searchResults.content && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Topic Overview:</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <p>{searchResults.content}</p>
                  </div>
                </div>
              )}

              {searchResults.videos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Educational Videos:</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {searchResults.videos.map((video) => (
                      <a 
                        key={video.id}
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="overflow-hidden h-full flex flex-col">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full aspect-video object-cover"
                          />
                          <div className="p-3">
                            <h4 className="font-medium line-clamp-2 text-sm">{video.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{video.channelTitle}</p>
                          </div>
                          <div className="mt-auto p-3 pt-0 flex items-center">
                            <Youtube className="h-4 w-4 mr-1 text-red-500" />
                            <span className="text-xs">Watch on YouTube</span>
                          </div>
                        </Card>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {searchLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p>Searching for educational content...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily AI Quiz */}
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>Daily AI Quiz</CardTitle>
              <CardDescription>Test your knowledge with daily AI-generated questions</CardDescription>
            </CardHeader>
            <CardContent>
              {quizTaken ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium">You've completed today's quiz!</h3>
                  <p className="mt-2 text-muted-foreground">Your score: {quizScore}%</p>
                  <p className="mt-4">Come back tomorrow for a new quiz.</p>
                </div>
              ) : quizQuestions.length > 0 ? (
                <div className="space-y-6">
                  {quizQuestions.map((question) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3">{question.id}. {question.question}</h3>
                      <RadioGroup
                        value={question.userAnswer}
                        onValueChange={(value) => handleQuizAnswer(question.id, value)}
                      >
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2 py-2">
                            <RadioGroupItem value={option} id={`q${question.id}-option${index}`} />
                            <Label htmlFor={`q${question.id}-option${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                  <Button onClick={handleQuizSubmit} className="w-full">Submit Quiz</Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  {quizLoading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p>Generating your daily quiz...</p>
                    </>
                  ) : (
                    <>
                      <p className="mb-4">Ready to test your knowledge?</p>
                      <Button onClick={generateQuiz}>Generate Today's Quiz</Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Task Scheduler */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Study Task Scheduler</CardTitle>
              <CardDescription>Manage your daily study tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Your Study Tasks</h3>
                <Button 
                  onClick={generateTasks}
                  disabled={tasksLoading}
                >
                  {tasksLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Generate New Tasks
                </Button>
              </div>

              {tasksLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-2 py-2 border-b">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={(checked) => 
                          toggleTaskCompletion(task.id, checked as boolean)
                        }
                      />
                      <div className="flex flex-1 justify-between">
                        <Label
                          htmlFor={`task-${task.id}`}
                          className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {task.title}
                        </Label>
                        <span className="text-xs text-muted-foreground">{task.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks yet. Generate some study tasks to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tracker */}
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracker</CardTitle>
              <CardDescription>Track your learning progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Weekly Progress</h3>
                <Progress value={weeklyProgress} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">0%</span>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
              </div>
              
              <div className="h-64">
                <h3 className="text-lg font-medium mb-4">Quiz Performance</h3>
                <ChartContainer
                  config={{
                    day: {
                      theme: {
                        light: "#64748b",
                        dark: "#94a3b8",
                      },
                    },
                    score: {
                      theme: {
                        light: "#2563eb",
                        dark: "#3b82f6",
                      },
                    },
                  }}
                >
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-score)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-score)" }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Mathematics</Badge>
                  <Badge>Science</Badge>
                  <Badge>Computer Science</Badge>
                  <Badge>History</Badge>
                  <Badge>Literature</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Assistant */}
        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant</CardTitle>
              <CardDescription>Ask questions using your voice and get spoken answers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Button
                  className={`rounded-full p-8 ${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                >
                  <Mic className="h-8 w-8" />
                </Button>
                <p className="mt-4">
                  {isListening 
                    ? 'Listening... Speak now' 
                    : 'Click the microphone and ask a question'}
                </p>
              </div>

              {voiceQuery && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">You asked:</h3>
                  <div className="bg-secondary p-4 rounded-md">
                    <p>"{voiceQuery}"</p>
                  </div>
                </div>
              )}

              {voiceLoading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}

              {voiceResponse && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">AI Response:</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <p>{voiceResponse}</p>
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => speakResponse(voiceResponse)}>
                      Speak Response Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIStudyMaster;
