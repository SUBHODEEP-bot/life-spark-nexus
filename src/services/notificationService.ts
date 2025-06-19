
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id?: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'achievement' | 'health' | 'task' | 'email' | 'finance' | 'yoga' | 'motivation';
  module: 'daily-planner' | 'health-assistant' | 'yoga' | 'email-summary' | 'daily-motivation' | 'finance-tracker' | 'problem-solver' | 'task-reminder' | 'app-integration' | 'chat-companion' | 'life-scheduler' | 'news-digest' | 'career-coach' | 'family-sync' | 'life-analyzer' | 'wish-grant-system' | 'emergency-alert' | 'celebration-tracker' | 'voice-translator' | 'privacy-guardian' | 'ai-study-master';
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string;
  metadata?: any;
  created_at?: string;
  expires_at?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private listeners: ((notifications: Notification[]) => void)[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Add notification listener
  addListener(callback: (notifications: Notification[]) => void) {
    this.listeners.push(callback);
  }

  // Remove notification listener
  removeListener(callback: (notifications: Notification[]) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  private notifyListeners(notifications: Notification[]) {
    this.listeners.forEach(listener => listener(notifications));
  }

  // Create a new notification
  async createNotification(notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const newNotification = {
        ...notification,
        user_id: userData.user.id,
        created_at: new Date().toISOString(),
      };

      // Store in localStorage for demo purposes (replace with Supabase in production)
      const existingNotifications = this.getStoredNotifications();
      const notificationWithId = {
        ...newNotification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      existingNotifications.unshift(notificationWithId);
      localStorage.setItem('lifemate_notifications', JSON.stringify(existingNotifications.slice(0, 100))); // Keep only latest 100

      this.notifyListeners(existingNotifications);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  // Get stored notifications from localStorage
  private getStoredNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem('lifemate_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Get all notifications for current user
  async getNotifications(): Promise<Notification[]> {
    return this.getStoredNotifications();
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = this.getStoredNotifications();
      const updatedNotifications = notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      
      localStorage.setItem('lifemate_notifications', JSON.stringify(updatedNotifications));
      this.notifyListeners(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      const notifications = this.getStoredNotifications();
      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
      
      localStorage.setItem('lifemate_notifications', JSON.stringify(updatedNotifications));
      this.notifyListeners(updatedNotifications);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notifications = this.getStoredNotifications();
      const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
      
      localStorage.setItem('lifemate_notifications', JSON.stringify(updatedNotifications));
      this.notifyListeners(updatedNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  // Get unread count
  async getUnreadCount(): Promise<number> {
    const notifications = this.getStoredNotifications();
    return notifications.filter(notif => !notif.read).length;
  }

  // Clear all notifications
  async clearAll(): Promise<void> {
    try {
      localStorage.removeItem('lifemate_notifications');
      this.notifyListeners([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  // Module-specific notification creators
  async createHealthReminder(message: string, actionUrl?: string) {
    await this.createNotification({
      title: 'Health Reminder',
      message,
      type: 'health',
      module: 'health-assistant',
      read: false,
      priority: 'high',
      action_url: actionUrl,
    });
  }

  async createTaskReminder(taskTitle: string, actionUrl?: string) {
    await this.createNotification({
      title: 'Task Reminder',
      message: `Don't forget: ${taskTitle}`,
      type: 'reminder',
      module: 'task-reminder',
      read: false,
      priority: 'medium',
      action_url: actionUrl,
    });
  }

  async createYogaAchievement(achievement: string) {
    await this.createNotification({
      title: 'Yoga Achievement',
      message: achievement,
      type: 'achievement',
      module: 'yoga',
      read: false,
      priority: 'low',
    });
  }

  async createFinanceAlert(message: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    await this.createNotification({
      title: 'Finance Alert',
      message,
      type: 'warning',
      module: 'finance-tracker',
      read: false,
      priority,
    });
  }

  async createEmergencyAlert(message: string) {
    await this.createNotification({
      title: 'Emergency Alert',
      message,
      type: 'error',
      module: 'emergency-alert',
      read: false,
      priority: 'urgent',
    });
  }

  async createEmailSummary(count: number) {
    await this.createNotification({
      title: 'Email Summary',
      message: `You have ${count} new emails to review`,
      type: 'info',
      module: 'email-summary',
      read: false,
      priority: 'low',
    });
  }

  async createMotivationDaily(quote: string) {
    await this.createNotification({
      title: 'Daily Motivation',
      message: quote,
      type: 'motivation',
      module: 'daily-motivation',
      read: false,
      priority: 'low',
    });
  }

  async createStudyReminder(subject: string) {
    await this.createNotification({
      title: 'Study Reminder',
      message: `Time to study ${subject}`,
      type: 'reminder',
      module: 'ai-study-master',
      read: false,
      priority: 'medium',
    });
  }

  async createCelebration(milestone: string) {
    await this.createNotification({
      title: 'Celebration Time!',
      message: milestone,
      type: 'achievement',
      module: 'celebration-tracker',
      read: false,
      priority: 'low',
    });
  }
}

export const notificationService = NotificationService.getInstance();
