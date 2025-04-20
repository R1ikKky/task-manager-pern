import { create } from "zustand"
import { Task } from "../interfaces/task.interface"

interface TaskState {
    tasks: Task[]
    setTasks: (tasks: Task[]) => void
    addTask: (task: Task) => void
    deleteTask: (id: string) => void
    updateTask: (task: Task) => void
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],

    setTasks: (tasks) => set({ tasks }),

    addTask: (task) =>
        set((state) => ({
            tasks: [...state.tasks, task],
        })),
    deleteTask: (id) => 
        set((state) =>({
            tasks: state.tasks.filter((t) => t.id !== id),
        })),

    updateTask: (updatedTask) => 
        set((state) =>({
            tasks: state.tasks.map((task) => 
            updatedTask.id === task.id ? updatedTask : task
            )
        }))
}))