
export type Task = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
};
