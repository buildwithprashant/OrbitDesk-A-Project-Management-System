const express = require('express');
const {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMembers,
  removeMember,
  analytics
} = require('../controllers/projectController');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
  membersSchema
} = require('../validators/projectSchemas');
const { objectId, z } = require('../validators/commonSchemas');

const router = express.Router();

router.use(protect);
router.get('/analytics/summary', analytics);
router.route('/').get(listProjects).post(authorize('manager', 'admin'), validate(createProjectSchema), createProject);
router
  .route('/:id')
  .get(validate(projectIdSchema), getProject)
  .patch(authorize('manager', 'admin'), validate(updateProjectSchema), updateProject)
  .delete(authorize('admin'), validate(projectIdSchema), deleteProject);
router.patch('/:id/members', authorize('manager', 'admin'), validate(membersSchema), addMembers);
router.delete(
  '/:id/members/:userId',
  authorize('manager', 'admin'),
  validate(z.object({ params: z.object({ id: objectId, userId: objectId }) })),
  removeMember
);

module.exports = router;
