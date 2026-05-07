const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isActive: true }).select('-password').sort({ name: 1 });
  res.status(200).json(users);
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'title', 'avatarColor'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });

  const saved = await req.user.save();
  res.status(200).json({
    id: saved._id,
    name: saved.name,
    email: saved.email,
    role: saved.role,
    title: saved.title,
    avatarColor: saved.avatarColor
  });
});

const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isActive = false;
  await user.save();
  res.status(200).json({ message: 'User deactivated' });
});

module.exports = { listUsers, updateProfile, deactivateUser };
