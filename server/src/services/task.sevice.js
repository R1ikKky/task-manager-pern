const prisma = require("../../prisma.js");

const verifyOwnership = async(taskId, userId) =>{
    console.log('Verifying task:', taskId, 'for user:', userId);
    const task = await prisma.task.findFirst({
        where: {id: taskId, userId: userId},
        select: {id: true, userId: true}})

    if(!task) {
        throw new Error("Task not found")
    }
    
    return task
}

const getAllTasks = async (userId) => {
    return prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    })
}

const createTask = async (title, description, userId, deadline = "", quadrant = "inbox", importance = "low") => {
    return prisma.task.create({
        data: {title, description, completed: false, quadrant, deadline, createdAt: new Date().toISOString(), userId, importance}
    })
}

const updateTask = async ( id, updates, userId) => {
    await verifyOwnership(id, userId)

    return prisma.task.update({
        where: { id },
        data: {...updates, quadrant: updates.quadrant}
    })
}

const deleteTask = async (id, userId) => {
    await verifyOwnership(id, userId)

    return prisma.task.delete({
        where: { id, userId }
    })
}

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
}