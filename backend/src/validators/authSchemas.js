const { z } = require('./commonSchemas');

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(72),
    role: z.enum(['user', 'manager', 'admin']).optional(),
    title: z.string().max(80).optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

module.exports = { signupSchema, loginSchema };
