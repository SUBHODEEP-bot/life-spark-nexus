
import React from 'react';

interface YoutubeEmbedProps {
  youtubeId: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ youtubeId }) => {
  return (
    <div className="aspect-video w-full">
      <iframe
        className="w-full h-full rounded-md"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YoutubeEmbed;
