const taskService = require("../services/task.sevice")

const getAll = async(req, res) => {
    try{
        const tasks = await taskService.getAllTasks()
        res.status(200).json(tasks)
    }catch(error){
        console.error("GET ERROR:", error)
        res.status(500).json({ error: error.message })
    }
}

const create = async(req, res) => {
    const {title, description} = req.body
    try{
        const task = await taskService.createTask(title, description)
        res.status(200).json(task)
    }catch(error){
        console.error("CREATE ERROR:", error)
        res.status(500).json({ error: error.message })
    }
}

const update = async(req, res) => {
    const id = parseInt(req.params.id)
    const {title, description, completed} = req.body

    try{
        const task = await taskService.updateTask(id, {title, description, completed})
        res.status(200).json(task)
    }catch(error){
        console.error("UPDATE ERROR:", error)
        res.status(500).json({ error: error.message})
    }
}

const remove = async(req, res) => {
    const id = parseInt(req.params.id)
    
    try{
        await taskService.deleteTask(id)
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