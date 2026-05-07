const express = require('express');
const { createComment, deleteComment } = require('../controllers/commentController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { createCommentSchema, commentIdSchema } = require('../validators/commentSchemas');

const router = express.Router();

router.use(protect);
router.post('/', validate(createCommentSchema), createComment);
router.delete('/:id', validate(commentIdSchema), deleteComment);

module.exports = router;
