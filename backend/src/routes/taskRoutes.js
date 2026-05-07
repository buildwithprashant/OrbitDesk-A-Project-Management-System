const express = require('express');
const {
  listTasks,
  createTask,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/authMiddleware');
const { createTaskSchema, updateTaskSchema, updateStatusSchema, taskIdSchema } = require('../validators/taskSchemas');

const router = express.Router();

router.use(protect);
router.route('/').get(listTasks).post(authorize('manager', 'admin'), validate(createTaskSchema), createTask);
router
  .route('/:id')
  .get(validate(taskIdSchema), getTask)
  .patch(authorize('manager', 'admin'), validate(updateTaskSchema), updateTask)
  .delete(authorize('admin'), validate(taskIdSchema), deleteTask);
router.patch('/:id/status', validate(updateStatusSchema), updateTaskStatus);

module.exports = router;
