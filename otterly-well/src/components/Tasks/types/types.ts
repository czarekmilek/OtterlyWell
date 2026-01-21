export type TaskPriority = 1 | 2 | 3;

export interface TaskCategory {
  id: string;
  name: string;
  is_active: boolean;
  created_at?: string;
  order_index?: number;
}

export interface Task {
  id: string;
  category_id: string;
  description: string;
  priority: TaskPriority;
  is_completed: boolean;
  deadline?: string;
  created_at: string;
  completed_at?: string;
  is_dismissed?: boolean;
}
