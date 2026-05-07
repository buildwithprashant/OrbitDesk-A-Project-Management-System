const express = require('express');
const { signup, login, me } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { signupSchema, loginSchema } = require('../validators/authSchemas');

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);

module.exports = router;
