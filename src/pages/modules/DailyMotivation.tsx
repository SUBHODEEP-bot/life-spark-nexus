
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Star, RefreshCw, Share2, Heart, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Quote = {
  id: number;
  text: string;
  author: string;
  category: string;
};

type Mood = "happy" | "motivated" | "stressed" | "thoughtful" | "creative" | "calm";

const DailyMotivation = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood>("motivated");
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [activeTab, setActiveTab] = useState("daily");
  const { toast } = useToast();

  // Predefined quotes based on different moods
  const quotesByMood: Record<Mood, Quote[]> = {
    happy: [
      { id: 1, text: "Happiness is not by chance, but by choice.", author: "Jim Rohn", category: "happy" },
      { id: 2, text: "The most wasted of all days is one without laughter.", author: "E. E. Cummings", category: "happy" },
      { id: 3, text: "Happiness is a warm puppy.", author: "Charles M. Schulz", category: "happy" },
      { id: 4, text: "Count your age by friends, not years. Count your life by smiles, not tears.", author: "John Lennon", category: "happy" }
    ],
    motivated: [
      { id: 5, text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "motivated" },
      { id: 6, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivated" },
      { id: 7, text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "motivated" },
      { id: 8, text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivated" }
    ],
    stressed: [
      { id: 9, text: "Stress is caused by being 'here' but wanting to be 'there'.", author: "Eckhart Tolle", category: "stressed" },
      { id: 10, text: "The greatest weapon against stress is our ability to choose one thought over another.", author: "William James", category: "stressed" },
      { id: 11, text: "The time to relax is when you don't have time for it.", author: "Sydney J. Harris", category: "stressed" },
      { id: 12, text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", category: "stressed" }
    ],
    thoughtful: [
      { id: 13, text: "We cannot solve our problems with the same thinking we used when we created them.", author: "Albert Einstein", category: "thoughtful" },
      { id: 14, text: "The unexamined life is not worth living.", author: "Socrates", category: "thoughtful" },
      { id: 15, text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein", category: "thoughtful" },
      { id: 16, text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr.", category: "thoughtful" }
    ],
    creative: [
      { id: 17, text: "Creativity is intelligence having fun.", author: "Albert Einstein", category: "creative" },
      { id: 18, text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson", category: "creative" },
      { id: 19, text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou", category: "creative" },
      { id: 20, text: "Creativity takes courage.", author: "Henri Matisse", category: "creative" }
    ],
    calm: [
      { id: 21, text: "Peace comes from within. Do not seek it without.", author: "Buddha", category: "calm" },
      { id: 22, text: "Calm mind brings inner strength and self-confidence.", author: "Dalai Lama", category: "calm" },
      { id: 23, text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra", category: "calm" },
      { id: 24, text: "The nearer a man comes to a calm mind, the closer he is to strength.", author: "Marcus Aurelius", category: "calm" }
    ]
  };

  // Generate a new quote based on selected mood
  const generateNewQuote = () => {
    setLoading(true);
    
    setTimeout(() => {
      const moodQuotes = quotesByMood[selectedMood];
      const randomIndex = Math.floor(Math.random() * moodQuotes.length);
      setCurrentQuote(moodQuotes[randomIndex]);
      setLoading(false);
    }, 600); // Simulate loading delay
  };

  // Handle favorite action
  const handleFavorite = () => {
    if (currentQuote) {
      if (favorites.some(q => q.id === currentQuote.id)) {
        setFavorites(favorites.filter(q => q.id !== currentQuote.id));
        toast({ 
          title: "Removed from favorites",
          description: "Quote has been removed from your favorites"
        });
      } else {
        setFavorites([...favorites, currentQuote]);
        toast({ 
          title: "Added to favorites",
          description: "Quote has been saved to your favorites"
        });
      }
    }
  };

  // Handle share action (simulated)
  const handleShare = () => {
    if (currentQuote) {
      const text = `"${currentQuote.text}" - ${currentQuote.author}`;
      
      // In a real app, we'd use the Web Share API
      // For now we'll just copy to clipboard and notify
      navigator.clipboard.writeText(text)
        .then(() => {
          toast({ 
            title: "Quote copied to clipboard",
            description: "You can now paste and share it anywhere"
          });
        })
        .catch(err => {
          toast({ 
            title: "Couldn't copy quote",
            description: "There was an error copying to clipboard",
            variant: "destructive"
          });
        });
    }
  };

  // Initially load a quote on component mount
  useEffect(() => {
    generateNewQuote();
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('motivation_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Error loading favorites:", e);
      }
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('motivation_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Determine if current quote is favorite
  const isCurrentQuoteFavorite = currentQuote ? 
    favorites.some(q => q.id === currentQuote.id) : false;

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Daily Motivation & Quote Generator</h1>
        <p className="text-muted-foreground">
          AI-generated quotes to inspire and motivate you based on your mood
        </p>
      </header>

      <Tabs 
        defaultValue="daily" 
        className="w-full" 
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">Daily Quote</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6 mt-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Personalize Your Inspiration</h2>
              <p className="text-sm text-muted-foreground">
                Select your current mood to get targeted motivation
              </p>
            </div>
            
            <div className="flex gap-2 items-center">
              <Select
                value={selectedMood}
                onValueChange={(value) => setSelectedMood(value as Mood)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="motivated">Motivated</SelectItem>
                  <SelectItem value="stressed">Stressed</SelectItem>
                  <SelectItem value="thoughtful">Thoughtful</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={generateNewQuote} 
                disabled={loading}
                variant="secondary"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                New Quote
              </Button>
            </div>
          </div>

          <Card className="border-lifemate-purple/30 bg-gradient-to-br from-lifemate-purple/15 to-transparent p-8">
            {currentQuote ? (
              <div className="flex flex-col items-center text-center space-y-6 py-4">
                <div className="p-3 rounded-full bg-lifemate-purple/20 text-yellow-400">
                  <Star className="h-8 w-8" />
                </div>
                
                <blockquote className="text-2xl font-medium leading-relaxed max-w-2xl">
                  "{currentQuote.text}"
                </blockquote>
                
                <cite className="text-lg text-muted-foreground">
                  — {currentQuote.author}
                </cite>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleFavorite}
                    className={isCurrentQuoteFavorite ? "text-red-500 border-red-200" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isCurrentQuoteFavorite ? "fill-red-500" : ""}`} />
                    {isCurrentQuoteFavorite ? "Favorited" : "Favorite"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </Card>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Need more motivation? Try our AI-powered motivation coach to get personalized inspiration.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Favorite Quotes</h2>
            <p className="text-sm text-muted-foreground">{favorites.length} saved quotes</p>
          </div>

          {favorites.length > 0 ? (
            <div className="grid gap-4">
              {favorites.map((quote) => (
                <Card key={quote.id} className="p-6 border-lifemate-purple/20">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <blockquote className="text-lg font-medium">
                        "{quote.text}"
                      </blockquote>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 h-8 w-8"
                        onClick={() => {
                          setFavorites(favorites.filter(q => q.id !== quote.id));
                          toast({ 
                            title: "Removed from favorites",
                            description: "Quote has been removed from your favorites"
                          });
                        }}
                      >
                        <Heart className="h-4 w-4 fill-red-500" />
                      </Button>
                    </div>
                    <cite className="text-sm text-muted-foreground">
                      — {quote.author}
                    </cite>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Save className="h-12 w-12 text-muted-foreground opacity-30" />
              <div>
                <h3 className="text-lg font-medium">No favorites yet</h3>
                <p className="text-sm text-muted-foreground">
                  Save your favorite quotes by clicking the heart icon
                </p>
              </div>
              <Button variant="outline" onClick={() => setActiveTab("daily")}>
                Discover Quotes
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyMotivation;
