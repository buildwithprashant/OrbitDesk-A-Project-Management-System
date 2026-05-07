const { z, objectId, requiredDate } = require('./commonSchemas');

const taskStatuses = ['Pending', 'In Progress', 'Completed'];

const taskBody = z.object({
  title: z.string().min(2).max(160),
  description: z.string().max(1600).optional().default(''),
  project: objectId,
  assignees: z.array(objectId).optional().default([]),
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: requiredDate
});

const createTaskSchema = z.object({ body: taskBody });
const updateTaskSchema = z.object({
  params: z.object({ id: objectId }),
  body: taskBody.partial()
});
const updateStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ status: z.enum(taskStatuses) })
});
const taskIdSchema = z.object({ params: z.object({ id: objectId }) });

module.exports = { createTaskSchema, updateTaskSchema, updateStatusSchema, taskIdSchema };
