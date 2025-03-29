const prisma = require("../../prisma.js");

const getAllTasks = async (userId) => {
    return prisma.task.findMany({
        where: {userId},
        orderBy: {id: "desc"}
    })
}

const createTask = async (title, description, userId) => {
    return prisma.task.create({
        data: {title, description, userId}
    })
}

const updateTask = async ( id, data, userId) => {
    await verifyOwnership(id, userId)

    return prisma.task.update({
        where: { id },
        data
    })
}

const deleteTask = async ( id, userId) => {
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