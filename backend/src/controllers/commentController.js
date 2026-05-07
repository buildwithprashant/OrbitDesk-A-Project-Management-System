const asyncHandler = require('../utils/asyncHandler');
const Comment = require('../models/Comment');
const Task = require('../models/Task');
const { canSeeEverything } = require('../utils/roles');

const createComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.validated.body.task);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const canComment =
    canSeeEverything(req.user) || task.assignees.some((assignee) => assignee.toString() === req.user._id.toString());

  if (!canComment) {
    res.status(403);
    throw new Error('You can only comment on tasks assigned to you');
  }

  const comment = await Comment.create({
    task: task._id,
    user: req.user._id,
    body: req.validated.body.body
  });

  task.activity.push({ actor: req.user._id, action: 'commented', detail: 'Added a comment' });
  await task.save();

  res.status(201).json(await comment.populate('user', 'name email role title avatarColor'));
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const ownsComment = comment.user.toString() === req.user._id.toString();
  if (!canSeeEverything(req.user) && !ownsComment) {
    res.status(403);
    throw new Error('You can only delete your own comments');
  }

  await comment.deleteOne();
  res.status(200).json({ message: 'Comment deleted' });
});

module.exports = { createComment, deleteComment };
