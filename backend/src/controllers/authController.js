const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const { ROLES } = require('../utils/roles');

const authResponse = (user, token) => ({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    avatarColor: user.avatarColor
  }
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, title } = req.validated.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const requestedRole = ROLES.includes(role) ? role : 'user';

  const user = await User.create({
    name,
    email,
    password,
    title,
    role: requestedRole
  });
  const token = generateToken(user._id);

  res.status(201).json(authResponse(user, token));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }

  const token = generateToken(user._id);
  res.status(200).json(authResponse(user, token));
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: authResponse(req.user, '').user });
});

module.exports = { signup, login, me };
