
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { YogaPose, YouTubeSearchResult } from '@/types/yoga';
import { Info, Video, Search, Loader2 } from 'lucide-react';
import YoutubeEmbed from './YoutubeEmbed';
import { useYouTubeSearch } from '@/hooks/useYouTubeSearch';

interface PoseLibraryProps {
  poses: YogaPose[];
}

const PoseLibrary: React.FC<PoseLibraryProps> = ({ poses }) => {
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All Levels');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const { results, loading, error, searchVideos } = useYouTubeSearch();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchVideos(searchQuery);
      setShowSearchResults(true);
    }
  };

  const filteredPoses = selectedLevel === 'All Levels' 
    ? poses 
    : poses.filter(pose => pose.level === selectedLevel);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold">Yoga Poses</h2>
        
        <div className="flex gap-3 items-center">
          <select 
            className="bg-secondary rounded-md border border-border px-3 py-2 text-sm appearance-none pr-8"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search for yoga poses or tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-10"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {showSearchResults && results.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Search Results</h3>
            <Button 
              variant="ghost" 
              onClick={() => setShowSearchResults(false)}
              size="sm"
            >
              Back to Pose Library
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{video.channelTitle}</p>
                </CardContent>
                <CardFooter className="px-4 py-3 bg-secondary/40 flex justify-end">
                  <Button 
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                  >
                    <Video className="h-4 w-4 mr-2" /> Watch on YouTube
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {!showSearchResults && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPoses.map((pose) => (
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

          <div className="flex justify-center">
            <Button variant="outline">
              Load More Poses
            </Button>
          </div>
        </>
      )}

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
    </div>
  );
};

export default PoseLibrary;
