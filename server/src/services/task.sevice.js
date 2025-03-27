const prisma = require("../../prisma.js");

const getAllTasks = async () => {
    return prisma.task.findMany()
}

const createTask = async (title, description, userId = 1) => {
    return prisma.task.create({
        data: {title, description, userId}
    })
}

const updateTask = async ( id, data ) => {
    return prisma.task.update({
        where: { id: id },
        data: data,
    })
}

const deleteTask = async ( id ) => {
    return prisma.task.delete({
        where: { id: id }
    })
}

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
}