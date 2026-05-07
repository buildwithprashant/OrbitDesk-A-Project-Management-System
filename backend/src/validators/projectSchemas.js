const { z, objectId, requiredDate } = require('./commonSchemas');

const projectBody = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(1200).optional().default(''),
  deadline: requiredDate,
  status: z.enum(['planning', 'active', 'completed', 'archived']).optional(),
  color: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).optional(),
  members: z.array(objectId).optional().default([])
});

const createProjectSchema = z.object({ body: projectBody });
const updateProjectSchema = z.object({
  params: z.object({ id: objectId }),
  body: projectBody.partial()
});
const projectIdSchema = z.object({ params: z.object({ id: objectId }) });

const membersSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ members: z.array(objectId).min(1) })
});

module.exports = { createProjectSchema, updateProjectSchema, projectIdSchema, membersSchema };
