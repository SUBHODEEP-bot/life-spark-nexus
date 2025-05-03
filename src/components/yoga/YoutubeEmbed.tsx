
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YoutubeEmbedProps {
  youtubeId: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ youtubeId }) => {
  return (
    <div className="aspect-video w-full relative bg-secondary/30 rounded-md overflow-hidden">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <Button 
        className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white shadow-lg"
        onClick={() => window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank')}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Watch on YouTube
      </Button>
    </div>
  );
};

export default YoutubeEmbed;
