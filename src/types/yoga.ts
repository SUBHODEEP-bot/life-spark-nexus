
// Define all types used in the Yoga module

export interface YogaClass {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "20 min"
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail?: string;
  youtubeId: string;
  completedToday: boolean;
  category?: string[];
}

export interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  benefits: string[];
  image?: string;
  youtubeId?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface YogaStreak {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  lastPracticeDate: Date;
}

export interface YogaRoutine {
  id: string;
  name: string;
  description: string;
  days: string[]; // Days of the week: "Monday", "Tuesday", etc.
  timeOfDay: "Morning" | "Evening" | "Both";
  category: string[];
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  poses: string[]; // IDs of poses included
  classes?: string[]; // IDs of classes included
}

export interface YouTubeSearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
}

export interface YogaRecommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  yogaClassId?: string;
  yogaPoseIds?: string[];
  thumbnail?: string;
  youtubeId?: string;
}

export interface YogaExpertResponse {
  issue: string;
  poses: {
    name: string;
    steps: string[];
    benefits: string[];
    youtubeSearchTerm?: string;
  }[];
  advice: string;
}
