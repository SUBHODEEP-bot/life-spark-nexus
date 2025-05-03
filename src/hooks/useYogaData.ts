
import { useState, useEffect } from 'react';
import { YogaClass, YogaPose, YogaStreak, YogaRoutine, YogaRecommendation } from '@/types/yoga';

export const useYogaData = () => {
  // Sample data
  const [classes, setClasses] = useState<YogaClass[]>([
    {
      id: "1",
      title: "Morning Flow",
      description: "Start your day with energizing yoga flow to awaken body and mind",
      duration: "20 min",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
      youtubeId: "J9VnPbdqQ4Q", // 20 Minute Morning Yoga Flow
      completedToday: false,
      category: ["Energy", "Morning", "Flow"]
    },
    {
      id: "2",
      title: "Evening Relaxation",
      description: "Wind down with gentle stretches and relaxing poses for better sleep",
      duration: "15 min",
      level: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7",
      youtubeId: "v7AYKMP6rOE", // Yoga For Bedtime
      completedToday: false,
      category: ["Relaxation", "Evening", "Sleep"]
    },
    {
      id: "3",
      title: "Core Strengthening",
      description: "Focus on building core strength with challenging yoga poses",
      duration: "30 min",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b",
      youtubeId: "apXlxPaMNnM", // Core Yoga Workout
      completedToday: false,
      category: ["Strength", "Core", "Toning"]
    },
    {
      id: "4",
      title: "Balance Practice",
      description: "Improve your balance and concentration with these focused poses",
      duration: "25 min",
      level: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      youtubeId: "iEVnN2R0_vg", // Yoga For Balance
      completedToday: false,
      category: ["Balance", "Focus", "Mindfulness"]
    },
  ]);

  const [poses, setPoses] = useState<YogaPose[]>([
    {
      id: "1",
      name: "Downward-Facing Dog",
      sanskritName: "Adho Mukha Svanasana",
      description: "This pose stretches the hamstrings, shoulders, calves, arches, hands, and spine while building strength in the arms, shoulders, and legs.",
      benefits: ["Energizes the body", "Stretches shoulders, hamstrings, calves", "Strengthens arms and legs"],
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      youtubeId: "YqOqM79McYY",
      level: "Beginner",
    },
    {
      id: "2",
      name: "Tree Pose",
      sanskritName: "Vrksasana",
      description: "This balancing pose strengthens the legs and core while improving concentration and balance.",
      benefits: ["Improves balance", "Strengthens thighs, calves, and ankles", "Stretches the groins and inner thighs"],
      image: "https://images.unsplash.com/photo-1566501206188-5dd0cf160a0e",
      youtubeId: "wdln9qWYloU",
      level: "Beginner",
    },
    {
      id: "3",
      name: "Warrior II",
      sanskritName: "Virabhadrasana II",
      description: "This standing pose strengthens and stretches the legs and ankles, while also expanding the chest and shoulders.",
      benefits: ["Strengthens legs and opens hips", "Builds stamina and concentration", "Stimulates abdominal organs"],
      image: "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539",
      youtubeId: "4Ejz7IgODlU",
      level: "Beginner",
    },
  ]);

  const [streak, setStreak] = useState<YogaStreak>({
    currentStreak: 7,
    longestStreak: 14,
    totalSessions: 32,
    lastPracticeDate: new Date(),
  });

  const [routines, setRoutines] = useState<YogaRoutine[]>([]);
  const [recommendations, setRecommendations] = useState<YogaRecommendation[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem('yoga-classes');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }

    const savedPoses = localStorage.getItem('yoga-poses');
    if (savedPoses) {
      setPoses(JSON.parse(savedPoses));
    }

    const savedStreak = localStorage.getItem('yoga-streak');
    if (savedStreak) {
      const parsedStreak = JSON.parse(savedStreak);
      setStreak({
        ...parsedStreak,
        lastPracticeDate: new Date(parsedStreak.lastPracticeDate)
      });
    }

    const savedRoutines = localStorage.getItem('yoga-routines');
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    }

    const savedRecommendations = localStorage.getItem('yoga-recommendations');
    if (savedRecommendations) {
      setRecommendations(JSON.parse(savedRecommendations));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('yoga-classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('yoga-poses', JSON.stringify(poses));
  }, [poses]);

  useEffect(() => {
    localStorage.setItem('yoga-streak', JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('yoga-routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('yoga-recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  // Mark a class as completed
  const markClassAsCompleted = (classId: string) => {
    // Update classes list
    setClasses(prev => 
      prev.map(yogaClass => 
        yogaClass.id === classId 
          ? { ...yogaClass, completedToday: true } 
          : yogaClass
      )
    );

    // Update streak data
    const today = new Date();
    const lastPractice = streak.lastPracticeDate;
    const isConsecutiveDay = 
      today.getDate() === lastPractice.getDate() + 1 || 
      (today.getDate() === lastPractice.getDate() && 
       today.getMonth() === lastPractice.getMonth() && 
       today.getFullYear() === lastPractice.getFullYear());
    
    let newCurrentStreak = isConsecutiveDay ? streak.currentStreak + 1 : 1;
    
    setStreak(prev => ({
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(newCurrentStreak, prev.longestStreak),
      totalSessions: prev.totalSessions + 1,
      lastPracticeDate: today,
    }));
  };

  // Add routine
  const addRoutine = (routine: Omit<YogaRoutine, 'id'>) => {
    const newRoutine: YogaRoutine = {
      ...routine,
      id: Date.now().toString(),
    };
    
    setRoutines(prev => [...prev, newRoutine]);
    return newRoutine;
  };

  // Delete routine
  const deleteRoutine = (routineId: string) => {
    setRoutines(prev => prev.filter(routine => routine.id !== routineId));
  };

  // Update routine
  const updateRoutine = (updatedRoutine: YogaRoutine) => {
    setRoutines(prev => 
      prev.map(routine => 
        routine.id === updatedRoutine.id 
          ? updatedRoutine 
          : routine
      )
    );
  };

  // Add recommendation
  const addRecommendation = (recommendation: YogaRecommendation) => {
    setRecommendations(prev => [...prev, recommendation]);
  };

  return {
    classes,
    poses,
    streak,
    routines,
    recommendations,
    markClassAsCompleted,
    addRoutine,
    deleteRoutine,
    updateRoutine,
    addRecommendation
  };
};
