import { useTaskStore } from "../store/task.store"
import { useAuthStore } from "../store/user.store"
import { Task } from "../interfaces/task.interface"
import { v4 as uuidv4 } from "uuid"
import { api } from "./interceptors"

import "./interceptors"

export const fetchTasks = async() => {
    const { setTasks } = useTaskStore.getState()

    const res = await api.get<Task[]>('/tasks/get-all')
    setTasks(res.data)
}

export const createTask = async (title: string, description: string, deadline?: string, importance: "low" | "medium" | "high" = "low") => {
    const { addTask, removeTask, updateTask } = useTaskStore.getState()
    const { user } = useAuthStore.getState()

    if(!user){
        console.warn("Attempting to create a task without an account")
        return
    }

    const tempTask: Task = {
        id: uuidv4(),
        title,
        description,
        completed: false,
        importance,
        deadline: deadline || "",
        createdAt: new Date().toISOString(),
        userId: user.id,
    }


    addTask(tempTask) //отправляем в зустанд

    try{
        const res = await api.post<Task>("/tasks/create-one",{ title, description, completed: false, importance, deadline, createTask: tempTask.createdAt, userId: user.id})
        updateTask(res.data)
    } catch(err){
        removeTask(tempTask.id)
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


    try{
        await api.delete(`/tasks/delete-one/${id}`)
        const { removeTask } = useTaskStore.getState()
        removeTask(id)

    } catch(err){
        console.log("Failed to delete task", err)
    }
}