const { z } = require("zod")

const importanceEnum = z.enum(["low", "medium", "high"])

const taskCreateSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    deadline: z.string().optional(),
    importance: importanceEnum.optional(),
    quadrant    : z.enum([
        "productive_attractive",
        "productive_unattractive",
        "unproductive_attractive",
        "unproductive_unattractive",
        "inbox"                         
      ]).default("inbox")
})

const taskUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    deadline: z.string().optional(),
    importance: importanceEnum.optional(),
    quadrant    : z.enum([
        "productive_attractive",
        "productive_unattractive",
        "unproductive_attractive",
        "unproductive_unattractive",
        "inbox"                         
      ]).default("inbox")
})

module.exports = {
    taskCreateSchema,
    taskUpdateSchema,
}