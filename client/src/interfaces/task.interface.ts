export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    deadline?: string;
    importance: 'low' | 'medium' | 'high'; 
    createdAt: string;
    userId: string;
  }
  