const taskService = require("../services/task.sevice")
const { taskCreateSchema, taskUpdateSchema } = require("../schemas/task.schema")

const getAll = async(req, res) => {
    try{
        const tasks = await taskService.getAllTasks(req.user.id)
        res.status(200).json(tasks)
    }catch(error){
        console.error("GET ERROR:", error)
        res.status(500).json({ error: error.message })
    }
}

const create = async(req, res) => {
    const parsed = taskCreateSchema.safeParse(req.body)

    if(!parsed.success){
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors })
    }

    const {title, description} = parsed.data

    const userId = req.user.id
    try{
        const task = await taskService.createTask(title, description, userId)
        res.status(200).json(task)
    }catch(error){
        console.error("CREATE ERROR:", error)
        res.status(500).json({ error: error.message })
    }
}

const update = async(req, res) => {
    const parsed = taskUpdateSchema.safeParse(req.body)

    if(!parsed.success){
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors })
    }

    const id = req.params.id
    const { title, description, completed } = parsed.data

    try{
        const task = await taskService.updateTask(id, {title, description, completed}, req.user.id)
        res.status(200).json(task)
    }catch(error){
        console.error("UPDATE ERROR:", error)
        res.status(403).json({ error: error.message})
    }
}

const remove = async(req, res) => {
    const id = req.params.id
    const userId = req.user.id
    
    try{
        await taskService.deleteTask(id, userId)
        res.status(200).json({message: "task deleted"})
    }catch(error){
        console.error("DELETE ERROR:", error)
        res.status(500).json({ error: error.message})
    }
}

module.exports = {
    getAll,
    create,
    update,
    remove,
}