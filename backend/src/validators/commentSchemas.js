const { z, objectId } = require('./commonSchemas');

const createCommentSchema = z.object({
  body: z.object({
    task: objectId,
    body: z.string().min(1).max(1200)
  })
});

const commentIdSchema = z.object({
  params: z.object({ id: objectId })
});

module.exports = { createCommentSchema, commentIdSchema };
