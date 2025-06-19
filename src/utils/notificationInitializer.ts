
import { notificationService } from '@/services/notificationService';

// Initialize sample notifications for all 21 features
export const initializeSampleNotifications = async () => {
  const notifications = [
    // Daily Planner
    {
      title: 'Daily Plan Ready',
      message: 'Your schedule for today has been optimized with 8 tasks planned',
      type: 'info' as const,
      module: 'daily-planner' as const,
      priority: 'medium' as const,
      action_url: '/daily-planner'
    },
    
    // Health Assistant
    {
      title: 'Medication Reminder',
      message: 'Time to take your evening medication - Vitamin D',
      type: 'health' as const,
      module: 'health-assistant' as const,
      priority: 'high' as const,
      action_url: '/health-assistant'
    },
    
    // Yoga
    {
      title: 'Yoga Session Complete',
      message: 'Great job! You completed a 20-minute morning yoga session',
      type: 'achievement' as const,
      module: 'yoga' as const,
      priority: 'low' as const,
      action_url: '/yoga'
    },
    
    // Email Summary
    {
      title: 'New Email Summary',
      message: 'You have 5 new important emails. Listen to your audio summary',
      type: 'email' as const,
      module: 'email-summary' as const,
      priority: 'medium' as const,
      action_url: '/email-summary'
    },
    
    // Daily Motivation
    {
      title: 'Daily Inspiration',
      message: '"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill',
      type: 'motivation' as const,
      module: 'daily-motivation' as const,
      priority: 'low' as const,
      action_url: '/daily-motivation'
    },
    
    // Finance Tracker
    {
      title: 'Budget Alert',
      message: 'You\'ve spent 80% of your monthly dining budget. Consider cooking at home more often.',
      type: 'warning' as const,
      module: 'finance-tracker' as const,
      priority: 'high' as const,
      action_url: '/finance-tracker'
    },
    
    // Problem Solver
    {
      title: 'Solution Ready',
      message: 'AI has generated a solution for your work-life balance question',
      type: 'success' as const,
      module: 'problem-solver' as const,
      priority: 'medium' as const,
      action_url: '/problem-solver'
    },
    
    // Task Reminder
    {
      title: 'Upcoming Task',
      message: 'Meeting with project team starts in 15 minutes',
      type: 'reminder' as const,
      module: 'task-reminder' as const,
      priority: 'high' as const,
      action_url: '/task-reminder'
    },
    
    // App Integration
    {
      title: 'Integration Success',
      message: 'Successfully connected your Google Calendar. Syncing 12 events.',
      type: 'success' as const,
      module: 'app-integration' as const,
      priority: 'medium' as const,
      action_url: '/app-integration'
    },
    
    // Chat Companion
    {
      title: 'Daily Check-in',
      message: 'How are you feeling today? Your AI companion is here to listen.',
      type: 'info' as const,
      module: 'chat-companion' as const,
      priority: 'low' as const,
      action_url: '/chat-companion'
    },
    
    // Life Scheduler
    {
      title: 'Schedule Optimized',
      message: 'Your week has been auto-scheduled with optimal time blocks for productivity',
      type: 'success' as const,
      module: 'life-scheduler' as const,
      priority: 'medium' as const,
      action_url: '/life-scheduler'
    },
    
    // News Digest
    {
      title: 'Daily News Ready',
      message: 'Your personalized news digest with 8 trending topics is ready',
      type: 'info' as const,
      module: 'news-digest' as const,
      priority: 'low' as const,
      action_url: '/news-digest'
    },
    
    // Career Coach
    {
      title: 'Study Reminder',
      message: 'Time for your JavaScript practice session. You\'re on a 5-day streak!',
      type: 'reminder' as const,
      module: 'career-coach' as const,
      priority: 'medium' as const,
      action_url: '/career-coach'
    },
    
    // Family Sync
    {
      title: 'Family Update',
      message: 'Mom shared her location. She\'s safely arrived at the airport.',
      type: 'info' as const,
      module: 'family-sync' as const,
      priority: 'medium' as const,
      action_url: '/family-sync'
    },
    
    // Life Analyzer
    {
      title: 'Weekly Report Ready',
      message: 'Your life analytics report shows 15% improvement in productivity this week',
      type: 'achievement' as const,
      module: 'life-analyzer' as const,
      priority: 'low' as const,
      action_url: '/life-analyzer'
    },
    
    // Wish Grant System
    {
      title: 'Goal Progress',
      message: 'You\'re 70% closer to your goal of learning Spanish. Keep it up!',
      type: 'achievement' as const,
      module: 'wish-grant-system' as const,
      priority: 'medium' as const,
      action_url: '/wish-grant-system'
    },
    
    // Emergency Alert
    {
      title: 'Weather Alert',
      message: 'Severe thunderstorm warning in your area. Stay indoors and stay safe.',
      type: 'error' as const,
      module: 'emergency-alert' as const,
      priority: 'urgent' as const,
      action_url: '/emergency-alert'
    },
    
    // Celebration Tracker
    {
      title: 'Milestone Achievement',
      message: 'Congratulations! You\'ve completed 100 days of consistent exercise',
      type: 'achievement' as const,
      module: 'celebration-tracker' as const,
      priority: 'low' as const,
      action_url: '/celebration-tracker'
    },
    
    // Voice Translator
    {
      title: 'Translation Complete',
      message: 'Successfully translated conversation from English to Spanish',
      type: 'success' as const,
      module: 'voice-translator' as const,
      priority: 'low' as const,
      action_url: '/voice-translator'
    },
    
    // Privacy Guardian
    {
      title: 'Security Scan Complete',
      message: 'No security threats detected. Your data is secure.',
      type: 'success' as const,
      module: 'privacy-guardian' as const,
      priority: 'medium' as const,
      action_url: '/privacy-guardian'
    },
    
    // AI Study Master
    {
      title: 'Study Session Ready',
      message: 'Your personalized quiz on React concepts is ready. Test your knowledge!',
      type: 'info' as const,
      module: 'ai-study-master' as const,
      priority: 'medium' as const,
      action_url: '/ai-study-master'
    }
  ];

  // Add notifications with delays to simulate real-time arrival
  for (let i = 0; i < notifications.length; i++) {
    setTimeout(async () => {
      await notificationService.createNotification({
        ...notifications[i],
        read: i > 15 // Mark some as read to simulate realistic usage
      });
    }, i * 200); // Stagger notifications
  }
};

// Function to add periodic notifications
export const startPeriodicNotifications = () => {
  // Add a new notification every 10 minutes (for demo purposes)
  setInterval(async () => {
    const randomNotifications = [
      {
        title: 'Hydration Reminder',
        message: 'Time to drink some water! Stay hydrated throughout the day.',
        type: 'reminder' as const,
        module: 'health-assistant' as const,
        priority: 'low' as const,
      },
      {
        title: 'Posture Check',
        message: 'Take a moment to check your posture and stretch your neck.',
        type: 'reminder' as const,
        module: 'yoga' as const,
        priority: 'low' as const,
      },
      {
        title: 'Save Money Tip',
        message: 'Consider using public transport today to save on fuel costs.',
        type: 'info' as const,
        module: 'finance-tracker' as const,
        priority: 'low' as const,
      },
      {
        title: 'Learning Progress',
        message: 'Great job! You\'ve studied for 30 minutes today.',
        type: 'achievement' as const,
        module: 'ai-study-master' as const,
        priority: 'low' as const,
      }
    ];

    const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
    await notificationService.createNotification({
      ...randomNotification,
      read: false
    });
  }, 10 * 60 * 1000); // 10 minutes
};
