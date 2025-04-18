
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Globe, Zap, TrendingUp, Filter, Search, Bookmark, Clock, ThumbsUp, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock news data
const mockNews = [
  {
    id: 1,
    title: "New AI breakthrough enables more efficient language processing",
    source: "Tech Daily",
    category: "technology",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 245,
    comments: 58,
    summary: "Researchers have developed a new neural network architecture that improves language processing efficiency by 40% while using less computational resources."
  },
  {
    id: 2,
    title: "Global climate summit reaches historic agreement",
    source: "World News",
    category: "environment",
    time: "5 hours ago",
    image: "https://images.unsplash.com/photo-1569287151610-2f640de0e152?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 532,
    comments: 124,
    summary: "World leaders have agreed to ambitious new emissions targets with specific implementation mechanisms and funding commitments for developing nations."
  },
  {
    id: 3,
    title: "Stock markets reach all-time high as tech sector surges",
    source: "Finance Journal",
    category: "finance",
    time: "3 hours ago",
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 178,
    comments: 42,
    summary: "Major indices closed at record levels yesterday, led by strong performances from technology companies reporting better than expected quarterly earnings."
  },
  {
    id: 4,
    title: "New health study reveals benefits of intermittent fasting",
    source: "Health Today",
    category: "health",
    time: "8 hours ago",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    likes: 301,
    comments: 87,
    summary: "A comprehensive 5-year study has found significant health improvements for participants following various intermittent fasting protocols, particularly for metabolic health."
  }
];

// Mock social media updates
const mockSocialUpdates = [
  {
    id: 1,
    user: "Sarah Johnson",
    handle: "@sarahj",
    content: "Just finished my first marathon! 26.2 miles and feeling accomplished. #Running #PersonalBest",
    time: "45 minutes ago",
    platform: "twitter",
    likes: 84,
    comments: 23,
    avatar: "S"
  },
  {
    id: 2,
    user: "Tech Innovators",
    handle: "@techinnovate",
    content: "We're excited to announce our latest product launch next week. Stay tuned for something that will change how you work! #Innovation #TechNews",
    time: "2 hours ago",
    platform: "twitter",
    likes: 423,
    comments: 57,
    avatar: "T"
  },
  {
    id: 3,
    user: "Mark Wilson",
    handle: "@markw",
    content: "Beautiful sunset hike today. Nature is the best therapy. Check out these views!",
    time: "3 hours ago",
    platform: "instagram",
    likes: 512,
    comments: 45,
    avatar: "M"
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "technology":
      return "bg-blue-500/10 text-blue-500 border-blue-200";
    case "environment":
      return "bg-green-500/10 text-green-500 border-green-200";
    case "finance":
      return "bg-amber-500/10 text-amber-500 border-amber-200";
    case "health":
      return "bg-purple-500/10 text-purple-500 border-purple-200";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "twitter":
      return <TrendingUp className="h-4 w-4" />;
    case "instagram":
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};

const NewsDigest = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [savedArticles, setSavedArticles] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSaveArticle = (id: number) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(savedArticles.filter(articleId => articleId !== id));
      toast({
        title: "Removed from saved articles",
        description: "The article has been removed from your saved list"
      });
    } else {
      setSavedArticles([...savedArticles, id]);
      toast({
        title: "Article saved",
        description: "The article has been added to your saved list"
      });
    }
  };

  const filteredNews = mockNews.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSocial = mockSocialUpdates.filter(update => 
    update.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    update.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Social & News Digest</h1>
        <p className="text-muted-foreground">
          Curated news articles and social media trends personalized for you
        </p>
      </header>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column: News and social feed */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs defaultValue="news" onValueChange={setActiveTab} value={activeTab}>
              <TabsList>
                <TabsTrigger value="news">
                  <Newspaper className="h-4 w-4 mr-2" />
                  News
                </TabsTrigger>
                <TabsTrigger value="social">
                  <Globe className="h-4 w-4 mr-2" />
                  Social
                </TabsTrigger>
                <TabsTrigger value="saved">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved
                </TabsTrigger>
              </TabsList>
            
              {/* TabsContent sections moved inside Tabs component */}
              <TabsContent value="news" className="space-y-4 mt-0">
                {filteredNews.length > 0 ? (
                  filteredNews.map(article => (
                    <Card key={article.id} className="overflow-hidden">
                      <div className="sm:flex">
                        <div className="sm:w-1/3 h-48 sm:h-auto bg-secondary">
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="sm:w-2/3">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className={getCategoryColor(article.category)}>
                                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                              </Badge>
                              <div className="flex items-center text-muted-foreground text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {article.time}
                              </div>
                            </div>
                            <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                            <CardDescription className="flex items-center">
                              <span>Source: {article.source}</span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{article.summary}</p>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{article.likes}</span>
                                </div>
                                <div className="flex items-center">
                                  <MessageCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{article.comments}</span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleSaveArticle(article.id)}
                              >
                                <Bookmark className={`h-4 w-4 mr-1 ${savedArticles.includes(article.id) ? 'fill-primary text-primary' : ''}`} />
                                {savedArticles.includes(article.id) ? "Saved" : "Save"}
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-secondary/20 rounded-lg">
                    <Newspaper className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">No news articles match your search</p>
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
              </TabsContent>
              
              <TabsContent value="social" className="space-y-4 mt-0">
                {filteredSocial.length > 0 ? (
                  filteredSocial.map(update => (
                    <Card key={update.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>{update.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{update.user}</p>
                                <p className="text-sm text-muted-foreground">{update.handle}</p>
                              </div>
                              <div className="flex items-center">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  {getPlatformIcon(update.platform)}
                                  {update.platform.charAt(0).toUpperCase() + update.platform.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            <p className="mt-3">{update.content}</p>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{update.likes}</span>
                                </div>
                                <div className="flex items-center">
                                  <MessageCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{update.comments}</span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {update.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-secondary/20 rounded-lg">
                    <Globe className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">No social updates match your search</p>
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
              </TabsContent>
              
              <TabsContent value="saved" className="mt-0">
                {savedArticles.length > 0 ? (
                  <div className="space-y-4">
                    {mockNews
                      .filter(article => savedArticles.includes(article.id))
                      .map(article => (
                        <Card key={article.id} className="overflow-hidden">
                          <div className="sm:flex">
                            <div className="sm:w-1/3 h-48 sm:h-auto bg-secondary">
                              <img 
                                src={article.image} 
                                alt={article.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="sm:w-2/3">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className={getCategoryColor(article.category)}>
                                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                                  </Badge>
                                  <div className="flex items-center text-muted-foreground text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {article.time}
                                  </div>
                                </div>
                                <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                                <CardDescription className="flex items-center">
                                  <span>Source: {article.source}</span>
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">{article.summary}</p>
                                <div className="flex items-center justify-end mt-4">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleSaveArticle(article.id)}
                                  >
                                    <Bookmark className="h-4 w-4 mr-1 fill-primary text-primary" />
                                    Remove
                                  </Button>
                                </div>
                              </CardContent>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-secondary/20 rounded-lg">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">No saved articles yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("news")}
                    >
                      Browse news
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-9 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Right column: Trending and filters */}
        <div className="w-full md:w-64 lg:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Zap className="h-5 w-5 mr-2 text-amber-500" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="font-bold text-muted-foreground">#{i}</div>
                  <div>
                    <p className="text-sm font-medium">
                      {i === 1 && "Global climate conference"}
                      {i === 2 && "Tech industry layoffs"}
                      {i === 3 && "New smartphone launch"}
                      {i === 4 && "Economic recession fears"}
                      {i === 5 && "Sports championship"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i === 1 && "50K+ articles"}
                      {i === 2 && "42K+ articles"}
                      {i === 3 && "36K+ articles"}
                      {i === 4 && "29K+ articles"}
                      {i === 5 && "25K+ articles"}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2 text-sky-500" />
                Filter Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getCategoryColor("technology")}>Technology</Badge>
                  <Badge variant="outline" className={getCategoryColor("environment")}>Environment</Badge>
                  <Badge variant="outline" className={getCategoryColor("finance")}>Finance</Badge>
                  <Badge variant="outline" className={getCategoryColor("health")}>Health</Badge>
                  <Badge variant="outline" className="bg-secondary text-muted-foreground">Sports</Badge>
                  <Badge variant="outline" className="bg-secondary text-muted-foreground">Politics</Badge>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Sources</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="source1" className="mr-2" defaultChecked />
                    <label htmlFor="source1" className="text-sm">Tech Daily</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="source2" className="mr-2" defaultChecked />
                    <label htmlFor="source2" className="text-sm">World News</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="source3" className="mr-2" defaultChecked />
                    <label htmlFor="source3" className="text-sm">Finance Journal</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="source4" className="mr-2" defaultChecked />
                    <label htmlFor="source4" className="text-sm">Health Today</label>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Time Period</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">Today</Button>
                  <Button variant="outline" size="sm" className="justify-start">This Week</Button>
                  <Button variant="outline" size="sm" className="justify-start">This Month</Button>
                  <Button variant="outline" size="sm" className="justify-start">Custom</Button>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsDigest;
