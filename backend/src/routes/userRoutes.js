const express = require('express');
const { listUsers, updateProfile, deactivateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', listUsers);
router.patch('/me', updateProfile);
router.delete('/:id', authorize('admin'), deactivateUser);

module.exports = router;
