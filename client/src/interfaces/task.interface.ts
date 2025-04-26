export type QuadrantType = 
  | 'productive_attractive' 
  | 'productive_unattractive' 
  | 'unproductive_attractive' 
  | 'unproductive_unattractive'
  | "inbox"; 

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    deadline?: string;
    importance: 'low' | 'medium' | 'high'; 
    createdAt: Date;
    userId: string;
    quadrant?: QuadrantType;
}
