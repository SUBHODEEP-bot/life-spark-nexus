
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/services/notificationService';
import { 
  Bell, 
  X, 
  Trash2, 
  CheckCheck, 
  Calendar,
  Heart,
  ActivitySquare,
  Mail,
  Star,
  Wallet,
  HelpCircle,
  MessageCircle,
  CheckSquare,
  Newspaper,
  User,
  BarChart3,
  AlertTriangle,
  Award,
  Mic,
  Shield,
  BookOpen,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getModuleIcon = (module: string) => {
  const iconMap = {
    'daily-planner': Calendar,
    'health-assistant': Heart,
    'yoga': ActivitySquare,
    'email-summary': Mail,
    'daily-motivation': Star,
    'finance-tracker': Wallet,
    'problem-solver': HelpCircle,
    'task-reminder': Bell,
    'app-integration': CheckSquare,
    'chat-companion': MessageCircle,
    'life-scheduler': CheckSquare,
    'news-digest': Newspaper,
    'career-coach': User,
    'family-sync': User,
    'life-analyzer': BarChart3,
    'wish-grant-system': Star,
    'emergency-alert': AlertTriangle,
    'celebration-tracker': Award,
    'voice-translator': Mic,
    'privacy-guardian': Shield,
    'ai-study-master': BookOpen,
  };
  
  const IconComponent = iconMap[module as keyof typeof iconMap] || Bell;
  return <IconComponent className="h-4 w-4" />;
};

const getTypeColor = (type: string) => {
  const colorMap = {
    'info': 'bg-blue-500/10 text-blue-500 border-blue-200',
    'success': 'bg-green-500/10 text-green-500 border-green-200',
    'warning': 'bg-yellow-500/10 text-yellow-500 border-yellow-200',
    'error': 'bg-red-500/10 text-red-500 border-red-200',
    'reminder': 'bg-purple-500/10 text-purple-500 border-purple-200',
    'achievement': 'bg-emerald-500/10 text-emerald-500 border-emerald-200',
    'health': 'bg-pink-500/10 text-pink-500 border-pink-200',
    'task': 'bg-orange-500/10 text-orange-500 border-orange-200',
    'email': 'bg-indigo-500/10 text-indigo-500 border-indigo-200',
    'finance': 'bg-green-600/10 text-green-600 border-green-300',
    'yoga': 'bg-teal-500/10 text-teal-500 border-teal-200',
    'motivation': 'bg-amber-500/10 text-amber-500 border-amber-200',
  };
  
  return colorMap[type as keyof typeof colorMap] || 'bg-secondary text-muted-foreground';
};

const getPriorityColor = (priority: string) => {
  const priorityMap = {
    'low': 'border-l-gray-400',
    'medium': 'border-l-blue-400',
    'high': 'border-l-orange-400',
    'urgent': 'border-l-red-500',
  };
  
  return priorityMap[priority as keyof typeof priorityMap] || 'border-l-gray-400';
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

interface NotificationPanelProps {
  onClose?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read && notification.id) {
      await markAsRead(notification.id);
    }
    
    if (notification.action_url) {
      navigate(notification.action_url);
      onClose?.();
    }
  };

  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await deleteNotification(notificationId);
  };

  return (
    <Card className="w-96 max-h-[600px] shadow-xl border-0 bg-card/95 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-lifemate-purple" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex items-center gap-1">
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll} className="flex items-center gap-1">
              <Trash2 className="h-3 w-3" />
              Clear all
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-0 max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground/60">We'll notify you when something important happens</p>
          </div>
        ) : (
          <div className="space-y-0">
            {notifications.map((notification, index) => (
              <div key={notification.id || index}>
                <div 
                  className={`p-3 cursor-pointer hover:bg-secondary/50 transition-colors border-l-2 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-lifemate-purple/5' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-1.5 rounded-md ${getTypeColor(notification.type)}`}>
                        {getModuleIcon(notification.module)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-medium truncate ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-lifemate-purple flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className={`text-xs mb-2 ${!notification.read ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {notification.created_at && formatTimeAgo(notification.created_at)}
                          </div>
                          
                          <Badge variant="outline" className={`text-xs ${getTypeColor(notification.type)}`}>
                            {notification.type}
                          </Badge>
                          
                          {notification.action_url && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => notification.id && handleDeleteNotification(notification.id, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
