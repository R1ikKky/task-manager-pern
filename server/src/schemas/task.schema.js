const { z } = require("zod")


const taskCreateSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
})

const taskUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
})

module.exports = {
    taskCreateSchema,
    taskUpdateSchema,
}