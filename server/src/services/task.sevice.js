const prisma = require("../../prisma.js");

const getAllTasks = async (userId) => {
    return prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    })
}

const createTask = async (title, description, userId, deadline = "", importance = "low") => {
    return prisma.task.create({
        data: {title, description, completed: false, importance, deadline, createdAt: new Date().toISOString(), userId}
    })
}

const updateTask = async ( id, updates, userId) => {
    await verifyOwnership(id, userId)

    return prisma.task.update({
        where: { id },
        data: updates
    })
}

const deleteTask = async (id, userId) => {
    await verifyOwnership(id, userId)

    return prisma.task.delete({
        where: { id }
    })
}

const verifyOwnership = async(taskId, userId) =>{
    const task = await prisma.task.findUnique({ where: {id: taskId}})

    if(!task) throw new Error("Task not found")
    if( task.userId !== userId ) throw new Error("No access to task")
}

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
}