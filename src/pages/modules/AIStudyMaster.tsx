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
import { Mic, Loader2, Search, Book, CheckCircle2, AlertCircle, Youtube, Lightbulb, FileText } from "lucide-react";
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
import { generateGeminiResponse } from "@/utils/geminiHelpers";

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

// Mock data for demos when API fails
const MOCK_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars"
  },
  {
    id: 3,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: "Au"
  },
  {
    id: 4,
    question: "Which is not a programming language?",
    options: ["Java", "Python", "HTML", "Photoshop"],
    correctAnswer: "Photoshop"
  },
  {
    id: 5,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "22"],
    correctAnswer: "4"
  }
];

const MOCK_TASKS = [
  { id: "1", title: "Read a chapter from your textbook", completed: false, date: new Date().toLocaleDateString() },
  { id: "2", title: "Complete practice problems", completed: false, date: new Date().toLocaleDateString() },
  { id: "3", title: "Watch educational videos", completed: false, date: new Date().toLocaleDateString() },
  { id: "4", title: "Create summary notes", completed: false, date: new Date().toLocaleDateString() },
  { id: "5", title: "Practice with flashcards", completed: false, date: new Date().toLocaleDateString() },
];

const MOCK_SEARCH_CONTENT = {
  content: "The topic you searched for is an important area of study. Key concepts include fundamental principles and practical applications. Students should focus on understanding core ideas and their relationships to other subjects. Practice problems can reinforce learning and develop critical thinking skills.",
  videos: [
    {
      id: "sample1",
      title: "Introduction to the Topic",
      thumbnail: "https://i.imgur.com/ZLlGYIJ.png",
      channelTitle: "Educational Channel"
    },
    {
      id: "sample2",
      title: "Advanced Concepts Explained",
      thumbnail: "https://i.imgur.com/McZgHsA.png",
      channelTitle: "Learning Platform"
    },
    {
      id: "sample3",
      title: "Practice Problems & Solutions",
      thumbnail: "https://i.imgur.com/5tJTysE.png",
      channelTitle: "Study Helper"
    }
  ]
};

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
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
  // Progress tracking state
  const [progressData, setProgressData] = useState<any[]>([
    { day: 'Mon', score: 60 },
    { day: 'Tue', score: 75 },
    { day: 'Wed', score: 65 },
    { day: 'Thu', score: 85 },
    { day: 'Fri', score: 90 },
    { day: 'Sat', score: 70 },
    { day: 'Sun', score: 80 }
  ]);
  const [weeklyProgress, setWeeklyProgress] = useState(75);
  
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
      } else {
        // Load demo data if not logged in
        setTasks(MOCK_TASKS);
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
      
      if (taskData && taskData.length > 0) {
        setTasks(taskData.map((task: any) => ({
          id: task.id,
          title: task.title,
          completed: task.status === 'completed',
          date: new Date(task.created_at).toLocaleDateString()
        })));
      } else {
        // Use mock data if no tasks found
        setTasks(MOCK_TASKS);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Fallback to mock data on error
      setTasks(MOCK_TASKS);
      toast.error("Could not load your tasks. Using sample data instead.");
    } finally {
      setTasksLoading(false);
    }

    // Check if quiz has been taken today
    const today = new Date().toLocaleDateString();
    const quizTakenToday = localStorage.getItem(`quizTaken_${userId}_${today}`);
    setQuizTaken(quizTakenToday === 'true');
    
    const savedScore = localStorage.getItem(`quizScore_${userId}_${today}`);
    if (savedScore) {
      setQuizScore(parseInt(savedScore, 10));
    }
  };

  // Feature 1: Smart Topic Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchResults({ content: "", videos: [] });

    try {
      const prompt = `Provide a comprehensive educational explanation (around 300-400 words) about: ${searchQuery}. 
      
      Structure your response to include:
      1. A clear definition or introduction
      2. Key concepts and principles
      3. Real-world applications or examples
      4. Why this topic is important to understand
      
      Make it educational and engaging for students.`;
      
      const response = await generateGeminiResponse(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Simulate video results since we can't call YouTube API directly
      const mockVideos = [
        {
          id: `${searchQuery.replace(/\s/g, '')}-1`,
          title: `Learn ${searchQuery} - Complete Guide`,
          thumbnail: "https://i.imgur.com/ZLlGYIJ.png",
          channelTitle: "Educational Hub"
        },
        {
          id: `${searchQuery.replace(/\s/g, '')}-2`,
          title: `${searchQuery} Explained Simply`,
          thumbnail: "https://i.imgur.com/McZgHsA.png",
          channelTitle: "Learning Made Easy"
        },
        {
          id: `${searchQuery.replace(/\s/g, '')}-3`,
          title: `${searchQuery} - Advanced Concepts`,
          thumbnail: "https://i.imgur.com/5tJTysE.png",
          channelTitle: "Study Pro"
        }
      ];

      setSearchResults({
        content: response.text,
        videos: mockVideos
      });

      if (user) {
        await saveSearchToHistory(searchQuery);
      }
    } catch (error) {
      console.error('Error during search:', error);
      toast.error('Error fetching results. Please try again.');
      
      // Fallback to basic response
      setSearchResults({
        content: `${searchQuery} is an important topic in education. Understanding the fundamentals and applying them through practice is key to mastering this subject. Consider exploring various resources and engaging with the material through different learning methods.`,
        videos: []
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const saveSearchToHistory = async (query: string) => {
    try {
      if (!user) return;
      
      // Here you would typically save to database
      console.log('Saved search to history:', query);
      
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Feature 2: Daily AI Quiz
  const generateQuiz = async () => {
    if (quizTaken) return;
    
    setQuizLoading(true);
    try {
      const prompt = `Create a quiz with exactly 5 multiple choice questions about general educational topics including science, history, literature, mathematics, and current events.

      For each question, provide exactly 4 options and indicate which one is correct.
      
      Return ONLY a valid JSON array in this exact format:
      [
        {
          "question": "What is the capital of France?",
          "options": ["London", "Berlin", "Paris", "Madrid"],
          "correctAnswer": "Paris"
        }
      ]
      
      Make sure the questions are educational, diverse, and appropriate for general knowledge. Do not include any explanation or additional text.`;

      const response = await generateGeminiResponse(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      try {
        let text = response.text.trim();
        
        // Clean up the response to extract JSON
        if (text.includes('```json')) {
          text = text.split('```json')[1].split('```')[0].trim();
        } else if (text.includes('```')) {
          text = text.split('```')[1].split('```')[0].trim();
        }
        
        // Remove any leading/trailing text that isn't JSON
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          text = text.substring(jsonStart, jsonEnd + 1);
        }
        
        const questions = JSON.parse(text);
        
        const formattedQuestions = questions.map((q: any, index: number) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }));

        setQuizQuestions(formattedQuestions);
      } catch (parseError) {
        console.error('Error parsing quiz JSON:', parseError);
        throw new Error('Failed to parse quiz data');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Using sample quiz questions.');
      
      // Fallback to mock quiz questions
      setQuizQuestions(MOCK_QUIZ_QUESTIONS);
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
      
      saveQuizResult(score);
    }

    toast.success(`Quiz submitted! Your score: ${score}%`);
  };

  const saveQuizResult = async (score: number) => {
    try {
      if (!user) return;
      
      // Here you would save to your database
      console.log('Saved quiz result:', score);
      
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
      const prompt = `Generate 5 practical study tasks that would help any student improve their learning. 
      
      Focus on different aspects of studying like reading, practice, review, and active learning techniques.
      
      Return ONLY a valid JSON array in this exact format:
      [
        {
          "title": "Read one chapter from your textbook and summarize key points"
        }
      ]
      
      Make each task specific, actionable, and educationally valuable. Do not include explanations.`;

      const response = await generateGeminiResponse(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      try {
        let text = response.text.trim();
        
        // Clean up the response to extract JSON
        if (text.includes('```json')) {
          text = text.split('```json')[1].split('```')[0].trim();
        } else if (text.includes('```')) {
          text = text.split('```')[1].split('```')[0].trim();
        }
        
        // Remove any leading/trailing text that isn't JSON
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          text = text.substring(jsonStart, jsonEnd + 1);
        }
        
        const newTasks = JSON.parse(text);
        
        const generatedTasks = newTasks.map((task: any, index: number) => ({
          id: `generated-${Date.now()}-${index}`,
          title: task.title,
          completed: false,
          date: new Date().toLocaleDateString()
        }));
        
        if (user) {
          for (const task of generatedTasks) {
            await saveTasks(task.title);
          }
          loadUserData(user.id);
        } else {
          setTasks(prev => [...generatedTasks, ...prev]);
        }
        
        toast.success('New study tasks generated!');
      } catch (parseError) {
        console.error('Error parsing tasks JSON:', parseError);
        throw new Error('Failed to parse task data');
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast.error('Using sample tasks.');
      
      // Fallback to mock tasks
      const newMockTasks = MOCK_TASKS.map(task => ({
        ...task,
        id: `mock-${Date.now()}-${task.id}`,
        date: new Date().toLocaleDateString()
      }));
      
      setTasks(prev => [...newMockTasks, ...prev]);
    } finally {
      setTasksLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    const newTask = {
      id: `manual-${Date.now()}`,
      title: newTaskTitle,
      completed: false,
      date: new Date().toLocaleDateString()
    };

    if (user) {
      await saveTasks(newTaskTitle);
      loadUserData(user.id);
    } else {
      setTasks(prev => [newTask, ...prev]);
    }

    setNewTaskTitle("");
    toast.success("Task added successfully");
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
    
    // @ts-ignore - Using browser API that TypeScript may not recognize
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
      const prompt = `You are an educational assistant. A student is asking: "${query}"
      
      Provide a helpful, educational response in 100-150 words. Be encouraging and informative. Focus on giving practical study advice or explaining concepts clearly.`;
      
      const response = await generateGeminiResponse(prompt);
      
      if (response.error) {
        throw new Error(response.error);
      }

      setVoiceResponse(response.text);
      
      // Speak the response if speech synthesis is available
      if ('speechSynthesis' in window) {
        speakResponse(response.text);
      }
    } catch (error) {
      console.error('Error processing voice query:', error);
      toast.error('Error processing your question.');
      
      // Fallback response
      const fallbackResponse = `I understand you're asking about "${query}". Here's some general study advice: Break down complex topics into smaller, manageable parts. Use active learning techniques like summarizing, questioning, and teaching others. Regular practice and review help reinforce your understanding. Don't hesitate to seek help when needed.`;
      setVoiceResponse(fallbackResponse);
      
      if ('speechSynthesis' in window) {
        speakResponse(fallbackResponse);
      }
    } finally {
      setVoiceLoading(false);
    }
  };
  
  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported in your browser');
      return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
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
        <h1 className="text-3xl font-bold text-center mb-2 gradient-text">AI Study Master</h1>
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
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + " education")}`}
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
                            <span className="text-xs">Find on YouTube</span>
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
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setQuizTaken(false);
                      setQuizQuestions([]);
                    }}
                    className="mt-4"
                  >
                    Take Another Quiz
                  </Button>
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
                      <div className="bg-secondary/50 p-6 rounded-lg mb-6">
                        <Lightbulb className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                        <p className="mb-4">Ready to test your knowledge with AI-generated questions?</p>
                      </div>
                      <Button onClick={generateQuiz} className="shadow-glow">Generate Today's Quiz</Button>
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
                <div className="flex gap-2">
                  <Button 
                    onClick={generateTasks}
                    disabled={tasksLoading}
                    variant="outline"
                  >
                    {tasksLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Generate Tasks
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Add a new study task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <Button onClick={addTask} variant="secondary">Add Task</Button>
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
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
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
                  <span className="text-xs text-muted-foreground">{weeklyProgress}%</span>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 100]} />
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
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-500/10">Mathematics</Badge>
                  <Badge variant="outline" className="bg-green-500/10">Science</Badge>
                  <Badge variant="outline" className="bg-purple-500/10">Computer Science</Badge>
                  <Badge variant="outline" className="bg-amber-500/10">History</Badge>
                  <Badge variant="outline" className="bg-pink-500/10">Literature</Badge>
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
