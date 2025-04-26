import { useTaskStore } from "../store/task.store"
import { useAuthStore } from "../store/user.store"
import { QuadrantType, Task } from "../interfaces/task.interface"
import { api } from "./interceptors"

export const fetchTasks = async() => {
    const { setTasks } = useTaskStore.getState()

    const res = await api.get<Task[]>('/tasks/get-all')
    setTasks(res.data)
}

export const createTask = async (title: string, description: string, deadline?: string, importance: "low" | "medium" | "high" = "low", quadrant: QuadrantType = "inbox") => {
    const { addTask } = useTaskStore.getState()
    const { user } = useAuthStore.getState()

    if(!user){
        console.warn("Attempting to create a task without an account")
        return
    }

    try{
        const res = await api.post<Task>("/tasks/create-one", {
            title,
            description,
            importance,
            deadline,
            quadrant,
            userId: user.id
        })
        addTask(res.data)
    } catch(err){
        console.log("Failed to create task", err)
    }
}

export const updateTask = async(id: string, updates: Partial<Task>) => {
    const { updateTask } = useTaskStore.getState();

    try{
        const res = await api.put<Task>(`/tasks/update-one/${id}`, updates)
        updateTask(res.data)
    } catch(err){
        console.log("Failed to update task", err)
    }

}

export const deleteTask = async(id: string) => {  
    const { removeTask } = useTaskStore.getState()

    try{
        await api.delete(`/tasks/delete-one/${id}`)
        removeTask(id)

    } catch(err){
        console.log("Failed to delete task", err)
        throw err
    }
}