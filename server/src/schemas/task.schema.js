const { z } = require("zod")

const importanceEnum = z.enum(["low", "medium", "high"])

const taskCreateSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    deadline: z.string().optional(),
    importance: importanceEnum.optional()
})

const taskUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    deadline: z.string().optional(),
    importance: importanceEnum.optional()
})

module.exports = {
    taskCreateSchema,
    taskUpdateSchema,
}