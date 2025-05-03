
import { useState } from 'react';
import { YouTubeSearchResult } from '@/types/yoga';

// YouTube API key
const API_KEY = 'AIzaSyAGf72z_ThspQUBrfYq3Z0-9Ki5xl58aT8';

export const useYouTubeSearch = () => {
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchVideos = async (query: string, maxResults: number = 6) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=yoga+${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${API_KEY}`;
      
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch search results from YouTube');
      }
      
      const data = await response.json();
      
      // Get video IDs for duration details
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
      
      const videosResponse = await fetch(videosUrl);
      if (!videosResponse.ok) {
        throw new Error('Failed to fetch video details from YouTube');
      }
      
      const videosData = await videosResponse.json();
      
      // Map the results with duration information
      const formattedResults = data.items.map((item: any) => {
        const videoDetails = videosData.items.find((video: any) => video.id === item.id.videoId);
        const durationISO = videoDetails?.contentDetails?.duration || 'PT0M0S';
        
        // Convert ISO 8601 duration to readable format
        const match = durationISO.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const seconds = match[3] ? parseInt(match[3]) : 0;
        
        let duration = '';
        if (hours > 0) {
          duration = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          duration
        };
      });
      
      setResults(formattedResults);
    } catch (err) {
      console.error('Error searching YouTube videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to search videos');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchVideos };
};
